import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import { existsSync, readFileSync } from "fs";
import path from "path";

type JsonRecord = Record<string, unknown>;

type UserSummary = {
  id: string;
  email: string;
};

const SOURCE_TABLES_IN_ORDER = [
  "projects",
  "pages",
  "articles",
  "suggestions",
  "google_tokens",
  "crawl_logs",
] as const;

const UPSERT_BATCH_SIZE = 200;

function loadEnvFile(filePath: string) {
  if (!existsSync(filePath)) {
    return;
  }

  const contents = readFileSync(filePath, "utf8");
  for (const line of contents.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }

    const [rawKey, ...rawValueParts] = trimmed.split("=");
    const key = rawKey.trim();
    if (!key || process.env[key]) {
      continue;
    }

    const rawValue = rawValueParts.join("=").trim();
    const value =
      (rawValue.startsWith('"') && rawValue.endsWith('"')) ||
      (rawValue.startsWith("'") && rawValue.endsWith("'"))
        ? rawValue.slice(1, -1)
        : rawValue;

    process.env[key] = value;
  }
}

function loadRuntimeEnv() {
  const cwd = process.cwd();
  loadEnvFile(path.join(cwd, ".env"));
  loadEnvFile(path.join(cwd, ".env.local"));
}

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function createAdminClient(urlEnv: string, keyEnv: string): SupabaseClient {
  return createClient(getRequiredEnv(urlEnv), getRequiredEnv(keyEnv), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

async function listAllAuthUsers(client: SupabaseClient): Promise<UserSummary[]> {
  const users: UserSummary[] = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const { data, error } = await client.auth.admin.listUsers({
      page,
      perPage,
    });

    if (error) {
      throw new Error(`Failed to list auth users on page ${page}: ${error.message}`);
    }

    const batch = (data.users ?? [])
      .filter((user) => user.email)
      .map((user) => ({
        id: user.id,
        email: user.email!.toLowerCase(),
      }));

    users.push(...batch);

    if ((data.users ?? []).length < perPage) {
      break;
    }

    page += 1;
  }

  return users;
}

async function seedMissingAuthUsers(client: SupabaseClient, emails: string[]): Promise<void> {
  for (const email of emails.sort()) {
    const { error } = await client.auth.admin.createUser({
      email,
      password: `${randomUUID()}!Aa1`,
      email_confirm: true,
    });

    if (error) {
      throw new Error(`Failed to create missing target auth user ${email}: ${error.message}`);
    }

    console.log(`Created missing target auth user: ${email}`);
  }
}

async function fetchAllRows(client: SupabaseClient, table: string): Promise<JsonRecord[]> {
  const pageSize = 1000;
  const rows: JsonRecord[] = [];
  let from = 0;

  while (true) {
    const to = from + pageSize - 1;
    const { data, error } = await client.from(table).select("*").range(from, to);

    if (error) {
      throw new Error(`Failed to read ${table}: ${error.message}`);
    }

    const batch = (data ?? []) as JsonRecord[];
    rows.push(...batch);

    if (batch.length < pageSize) {
      break;
    }

    from += pageSize;
  }

  return rows;
}

function chunkRows<T>(rows: T[], size: number): T[][] {
  const chunks: T[][] = [];

  for (let index = 0; index < rows.length; index += size) {
    chunks.push(rows.slice(index, index + size));
  }

  return chunks;
}

function remapOwnership(row: JsonRecord, emailMap: Map<string, string>): JsonRecord {
  const nextRow = { ...row };

  if (typeof nextRow.owner_id === "string") {
    const mappedOwner = emailMap.get(nextRow.owner_id);
    if (!mappedOwner) {
      throw new Error(`No target auth user mapping found for owner_id ${nextRow.owner_id}`);
    }
    nextRow.owner_id = mappedOwner;
  }

  if (typeof nextRow.user_id === "string") {
    const mappedUser = emailMap.get(nextRow.user_id);
    if (!mappedUser) {
      throw new Error(`No target auth user mapping found for user_id ${nextRow.user_id}`);
    }
    nextRow.user_id = mappedUser;
  }

  return nextRow;
}

async function upsertRows(
  client: SupabaseClient,
  table: string,
  rows: JsonRecord[],
  dryRun: boolean
): Promise<void> {
  if (rows.length === 0) {
    console.log(`${table}: no rows to migrate`);
    return;
  }

  if (dryRun) {
    console.log(`${table}: dry run, would upsert ${rows.length} rows`);
    return;
  }

  for (const chunk of chunkRows(rows, UPSERT_BATCH_SIZE)) {
    const { error } = await client.from(table).upsert(chunk, {
      onConflict: "id",
      ignoreDuplicates: false,
    });

    if (error) {
      throw new Error(`Failed to upsert ${table}: ${error.message}`);
    }
  }

  console.log(`${table}: migrated ${rows.length} rows`);
}

async function main(): Promise<void> {
  loadRuntimeEnv();
  const dryRun = process.argv.includes("--dry-run");
  const seedMissingUsers = process.argv.includes("--seed-missing-users");
  const source = createAdminClient(
    "MYLINKS_SOURCE_SUPABASE_URL",
    "MYLINKS_SOURCE_SUPABASE_SERVICE_ROLE_KEY"
  );
  const target = createAdminClient("SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY");

  const [sourceUsers, targetUsers] = await Promise.all([
    listAllAuthUsers(source),
    listAllAuthUsers(target),
  ]);

  const targetUserIdByEmail = new Map(targetUsers.map((user) => [user.email, user.id]));
  const sourceUserIdToTargetUserId = new Map<string, string>();
  const missingEmails = new Set<string>();

  for (const sourceUser of sourceUsers) {
    const targetUserId = targetUserIdByEmail.get(sourceUser.email);
    if (!targetUserId) {
      missingEmails.add(sourceUser.email);
      continue;
    }

    sourceUserIdToTargetUserId.set(sourceUser.id, targetUserId);
  }

  if (missingEmails.size > 0 && seedMissingUsers) {
    await seedMissingAuthUsers(target, Array.from(missingEmails));

    const refreshedTargetUsers = await listAllAuthUsers(target);
    const refreshedTargetUserIdByEmail = new Map(
      refreshedTargetUsers.map((user) => [user.email, user.id])
    );

    missingEmails.clear();
    sourceUserIdToTargetUserId.clear();

    for (const sourceUser of sourceUsers) {
      const targetUserId = refreshedTargetUserIdByEmail.get(sourceUser.email);
      if (!targetUserId) {
        missingEmails.add(sourceUser.email);
        continue;
      }

      sourceUserIdToTargetUserId.set(sourceUser.id, targetUserId);
    }
  }

  if (missingEmails.size > 0) {
    const resolution = seedMissingUsers
      ? "Some emails are still missing after seeding."
      : "Rerun with --seed-missing-users, or have each missing user sign in once against the target project.";

    throw new Error(
      [
        "The target Supabase project is missing auth users for these emails:",
        ...Array.from(missingEmails).sort().map((email) => `- ${email}`),
        resolution,
      ].join("\n")
    );
  }

  console.log(
    `Auth mapping ready: ${sourceUserIdToTargetUserId.size} source user(s) matched by email`
  );

  for (const table of SOURCE_TABLES_IN_ORDER) {
    const sourceRows = await fetchAllRows(source, table);
    const transformedRows = sourceRows.map((row) =>
      remapOwnership(row, sourceUserIdToTargetUserId)
    );

    await upsertRows(target, table, transformedRows, dryRun);
  }

  console.log(dryRun ? "Dry run completed." : "MyLinks data migration completed.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
