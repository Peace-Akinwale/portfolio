"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Database } from "@/lib/mylinks/types/database";
import { buildLinkedText } from "@/lib/mylinks/article-preview";
import {
  buildHighlightedDraftFromRichHtml,
  buildLinkedRichHtml,
} from "@/lib/mylinks/rich-text-client";
import { extractGoogleDocId } from "@/lib/mylinks/utils";

type Article = Database["public"]["Tables"]["articles"]["Row"];
type Suggestion = Database["public"]["Tables"]["suggestions"]["Row"];

interface Props {
  article: Article;
  initialSuggestions: Suggestion[];
  projectId: string;
  googleAccessEnabled: boolean;
  googleRefreshIssuedAt?: string | null;
}

export default function SuggestionReview({
  article,
  initialSuggestions,
  projectId,
  googleAccessEnabled,
  googleRefreshIssuedAt,
}: Props) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>(initialSuggestions);
  const [hasGenerated, setHasGenerated] = useState(initialSuggestions.length > 0);
  const [googleDocId, setGoogleDocId] = useState(article.google_doc_id);
  const [generating, setGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationPhase, setGenerationPhase] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);
  const [linking, setLinking] = useState(false);
  const [reimporting, setReimporting] = useState(false);
  const [copying, setCopying] = useState(false);
  const [showLinkDoc, setShowLinkDoc] = useState(false);
  const [docUrl, setDocUrl] = useState(article.google_doc_id ?? "");
  const [error, setError] = useState<string | null>(null);
  const [reconnectRequired, setReconnectRequired] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [activeSuggestionId, setActiveSuggestionId] = useState<string | null>(null);
  const [anchorPositions, setAnchorPositions] = useState<Record<string, number>>({});
  const [cardPositions, setCardPositions] = useState<Record<string, number>>({});
  const [railHeight, setRailHeight] = useState<number | null>(null);

  const articlePanelRef = useRef<HTMLDivElement>(null);
  const cardRefsMap = useRef<Record<string, HTMLDivElement | null>>({});

  const approvedSuggestions = useMemo(
    () => suggestions.filter((suggestion) => suggestion.status === "approved"),
    [suggestions]
  );
  const pendingCount = suggestions.filter((suggestion) => suggestion.status === "pending").length;
  const clientCount = suggestions.filter(
    (suggestion) => suggestion.destination_source === "client"
  ).length;
  const inventoryCount = suggestions.length - clientCount;
  const activeSuggestion = useMemo(
    () => suggestions.find((suggestion) => suggestion.id === activeSuggestionId) ?? null,
    [activeSuggestionId, suggestions]
  );

  const highlightedDraft = useMemo(
    () =>
      buildHighlightedDraftFromRichHtml(
        article.content_html,
        article.content_text,
        suggestions,
        activeSuggestionId
      ),
    [activeSuggestionId, article.content_html, article.content_text, suggestions]
  );
  const linkedHtml = useMemo(
    () => buildLinkedRichHtml(article.content_html, article.content_text, approvedSuggestions),
    [approvedSuggestions, article.content_html, article.content_text]
  );
  const linkedText = useMemo(
    () => buildLinkedText(article.content_text, approvedSuggestions),
    [approvedSuggestions, article.content_text]
  );

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 3200);
  }

  useEffect(() => {
    if (!generating) {
      setGenerationProgress(0);
      setGenerationPhase(null);
      return;
    }

    const startedAt = Date.now();
    setGenerationProgress(6);
    setGenerationPhase("Preparing article and destination inventory...");

    const timer = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const nextProgress = Math.min(94, 6 + Math.floor(elapsed / 180));
      setGenerationProgress((current) => (nextProgress > current ? nextProgress : current));

      if (nextProgress >= 78) {
        setGenerationPhase("Ranking suggestions and saving the review set...");
      } else if (nextProgress >= 52) {
        setGenerationPhase("Matching anchors against your site inventory...");
      } else if (nextProgress >= 28) {
        setGenerationPhase("Sending the article to the link generator for ideas...");
      }
    }, 220);

    return () => window.clearInterval(timer);
  }, [generating]);

  async function generateSuggestions() {
    setGenerating(true);
    setGenerationProgress(6);
    setGenerationPhase("Preparing article and destination inventory...");
    setError(null);
    setActiveSuggestionId(null);

    try {
      const response = await fetch(`/api/mylinks/articles/${article.id}/suggest`, {
        method: "POST",
      });
      const payload = (await response.json()) as { error?: string; suggestions?: Suggestion[] };

      if (!response.ok) {
        setError(payload.error ?? "Failed to generate suggestions.");
        return;
      }

      setGenerationProgress(100);
      setGenerationPhase("Suggestions ready.");
      setSuggestions(payload.suggestions ?? []);
      setHasGenerated(true);
      showToast(`${payload.suggestions?.length ?? 0} link suggestions generated.`);
    } catch {
      setError("Request failed while generating suggestions.");
    } finally {
      window.setTimeout(() => {
        setGenerating(false);
      }, 260);
    }
  }

  async function updateStatus(
    suggestionId: string,
    status: "approved" | "rejected" | "pending"
  ) {
    const previous = suggestions;
    const nextSuggestions = suggestions.map((suggestion) =>
      suggestion.id === suggestionId ? { ...suggestion, status } : suggestion
    );
    setSuggestions(nextSuggestions);

    if (status === "pending") {
      setActiveSuggestionId(suggestionId);
    } else {
      const nextSuggestionId = findNextPendingSuggestionId(nextSuggestions, suggestionId);
      if (nextSuggestionId) {
        window.requestAnimationFrame(() => {
          scrollToSuggestion(nextSuggestionId);
        });
      } else {
        setActiveSuggestionId(null);
      }
    }

    const response = await fetch(`/api/mylinks/articles/${article.id}/suggestions/${suggestionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      setSuggestions(previous);
      window.requestAnimationFrame(() => {
        scrollToSuggestion(suggestionId);
      });
      showToast("Suggestion update failed. Reverted.");
    }
  }

  function findNextPendingSuggestionId(current: Suggestion[], currentId: string) {
    const currentIndex = current.findIndex((suggestion) => suggestion.id === currentId);

    if (currentIndex === -1) {
      return current.find((suggestion) => suggestion.status === "pending")?.id ?? null;
    }

    for (let index = currentIndex + 1; index < current.length; index += 1) {
      if (current[index]?.status === "pending") {
        return current[index].id;
      }
    }

    for (let index = 0; index < currentIndex; index += 1) {
      if (current[index]?.status === "pending") {
        return current[index].id;
      }
    }

    return null;
  }

  async function reimportFromGoogleDoc() {
    if (!googleDocId) return;
    setReimporting(true);
    setError(null);
    setReconnectRequired(false);
    try {
      const response = await fetch(`/api/mylinks/articles/${article.id}/reimport`, {
        method: "POST",
      });
      const payload = (await response.json()) as {
        error?: string;
        article?: Article;
        reconnect_required?: boolean;
      };
      if (payload.reconnect_required) {
        setReconnectRequired(true);
        setError(null);
        return;
      }
      if (!response.ok || !payload.article) {
        setError(payload.error ?? "Re-import failed.");
        return;
      }
      showToast("Re-imported from Google Doc. Refreshing...");
      window.setTimeout(() => window.location.reload(), 600);
    } catch {
      setError("Request failed during re-import.");
    } finally {
      setReimporting(false);
    }
  }

  async function linkGoogleDoc() {
    const parsedId = extractGoogleDocId(docUrl.trim());
    if (!parsedId) {
      setError("Paste a valid Google Doc URL or document ID.");
      return;
    }

    setLinking(true);
    setError(null);

    try {
      const response = await fetch(`/api/mylinks/articles/${article.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ google_doc_id: parsedId }),
      });
      const payload = (await response.json()) as { error?: string; google_doc_id?: string };

      if (!response.ok) {
        setError(payload.error ?? "Failed to link Google Doc.");
        return;
      }

      setGoogleDocId(parsedId);
      setDocUrl(parsedId);
      setShowLinkDoc(false);
      showToast("Google Doc linked to this article.");
    } catch {
      setError("Request failed while linking the Google Doc.");
    } finally {
      setLinking(false);
    }
  }

  async function copyLinkedVersion() {
    if (approvedSuggestions.length === 0) {
      return;
    }

    setCopying(true);
    setError(null);

    try {
      if (
        typeof window !== "undefined" &&
        "ClipboardItem" in window &&
        navigator.clipboard &&
        typeof navigator.clipboard.write === "function"
      ) {
        const item = new ClipboardItem({
          "text/html": new Blob([linkedHtml], { type: "text/html" }),
          "text/plain": new Blob([linkedText], { type: "text/plain" }),
        });
        await navigator.clipboard.write([item]);
      } else {
        await navigator.clipboard.writeText(linkedText);
      }

      showToast("Linked draft copied to your clipboard.");
    } catch {
      setError("Clipboard copy failed. Try the .docx export instead.");
    } finally {
      setCopying(false);
    }
  }

  function exportLinkedVersion() {
    const link = document.createElement("a");
    link.href = `/api/mylinks/articles/${article.id}/export`;
    link.download = `${article.title}.docx`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  async function applyToGoogleDoc() {
    setApplying(true);
    setError(null);
    setReconnectRequired(false);

    try {
      const response = await fetch(`/api/mylinks/articles/${article.id}/apply`, {
        method: "POST",
      });
      const payload = (await response.json()) as {
        error?: string;
        applied?: number;
        reconnect_required?: boolean;
      };

      if (payload.reconnect_required) {
        setReconnectRequired(true);
        setError(null);
        return;
      }
      if (!response.ok) {
        setError(payload.error ?? "Failed to apply links.");
        return;
      }

      showToast(`${payload.applied ?? 0} links applied to the linked Google Doc.`);
    } catch {
      setError("Request failed while applying links to Google Docs.");
    } finally {
      setApplying(false);
    }
  }

  function scrollToSuggestion(id: string) {
    setActiveSuggestionId(id);
    const articlePanel = articlePanelRef.current;
    const mark = articlePanel?.querySelector(`[data-suggestion-id="${id}"]`);
    if (mark instanceof HTMLElement) {
      mark.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  function handleArticleClick(event: React.MouseEvent<HTMLDivElement>) {
    const mark = (event.target as HTMLElement).closest("[data-suggestion-id]");
    if (!mark) {
      return;
    }

    event.preventDefault();

    const suggestionId = mark.getAttribute("data-suggestion-id");
    if (suggestionId) {
      scrollToSuggestion(suggestionId);
    }
  }

  useEffect(() => {
    const articlePanel = articlePanelRef.current;
    if (!articlePanel || suggestions.length === 0) {
      setAnchorPositions({});
      setCardPositions({});
      setRailHeight(null);
      return;
    }

    const compute = () => {
      const panelRect = articlePanel.getBoundingClientRect();
      const gap = 10;
      const nextAnchorPositions: Record<string, number> = {};
      const nextCardPositions: Record<string, number> = {};
      let lastBottom = 0;

      const sorted = suggestions
        .map((suggestion) => {
          const mark = articlePanel.querySelector(`[data-suggestion-id="${suggestion.id}"]`);
          if (!(mark instanceof HTMLElement)) {
            return null;
          }

          return {
            id: suggestion.id,
            idealY: mark.getBoundingClientRect().top - panelRect.top,
          };
        })
        .filter((item): item is { id: string; idealY: number } => !!item)
        .sort((left, right) => left.idealY - right.idealY);

      for (const item of sorted) {
        nextAnchorPositions[item.id] = item.idealY;
        const cardHeight = cardRefsMap.current[item.id]?.offsetHeight ?? 120;
        const top = Math.max(item.idealY, lastBottom);
        nextCardPositions[item.id] = top;
        lastBottom = top + cardHeight + gap;
      }

      setAnchorPositions(nextAnchorPositions);
      setCardPositions(nextCardPositions);
      setRailHeight(Math.max(articlePanel.scrollHeight, lastBottom));
    };

    let frame = window.requestAnimationFrame(compute);
    let debounceTimer: number | null = null;
    const scheduleCompute = () => {
      if (debounceTimer !== null) window.clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(() => {
        window.cancelAnimationFrame(frame);
        frame = window.requestAnimationFrame(compute);
      }, 120);
    };
    window.addEventListener("resize", scheduleCompute);

    return () => {
      window.cancelAnimationFrame(frame);
      if (debounceTimer !== null) window.clearTimeout(debounceTimer);
      window.removeEventListener("resize", scheduleCompute);
    };
    // NOTE: deps intentionally narrowed — we only re-measure when the set of
    // suggestions changes (add/remove), not on status flips or focus changes.
    // Status-change re-measure is covered because the DOM reflow from highlightedDraft
    // triggers the resize-like observer in the next micro-tick.
  }, [suggestions.length]);

  return (
    <div className="flex h-full min-h-[720px] flex-col overflow-hidden">
      <div className="border-b border-border bg-background px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              <span>{suggestions.length} suggestions</span>
              <span>{approvedSuggestions.length} approved</span>
              <span>{pendingCount} pending</span>
              <span>{inventoryCount} from crawl</span>
              <span>{clientCount} client supplied</span>
            </div>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Review the draft against the right-hand suggestions, approve the useful routes, then
              export or copy the linked version.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={generateSuggestions}
              disabled={generating}
              className="inline-flex rounded-full px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: "var(--accent)" }}
            >
              {generating
                ? "Generating..."
                : suggestions.length > 0
                  ? "Regenerate suggestions"
                  : "Generate suggestions"}
            </button>
            <button
              type="button"
              onClick={copyLinkedVersion}
              disabled={copying || approvedSuggestions.length === 0}
              className="inline-flex rounded-full border border-border px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] transition-colors hover:bg-[var(--muted)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {copying ? "Copying..." : "Copy linked draft"}
            </button>
            <button
              type="button"
              onClick={exportLinkedVersion}
              disabled={approvedSuggestions.length === 0}
              className="inline-flex rounded-full border border-border px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] transition-colors hover:bg-[var(--muted)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Export .docx
            </button>
          </div>
        </div>

        {generating ? (
          <div className="mt-4 rounded-[1.25rem] border border-border bg-[var(--muted)]/30 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              <span>Generating internal links</span>
              <span>{generationProgress}%</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full transition-[width] duration-300"
                style={{
                  width: `${generationProgress}%`,
                  background: "var(--accent)",
                }}
              />
            </div>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              {generationPhase ?? "Generating suggestions..."}
            </p>
          </div>
        ) : null}
      </div>

      <div className="border-b border-border bg-[var(--muted)]/35 px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="rounded-full border border-border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]">
              {article.source === "google_doc" ? "Google Doc source" : "Pasted draft"}
            </span>
            <span className="rounded-full border border-border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]">
              Project: {projectId.slice(0, 8)}
            </span>
            {googleDocId ? (
              <span className="rounded-full border border-border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]">
                Doc linked
              </span>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-3">
            {!googleAccessEnabled ? (
              <Link
                href="/projects/mylinks/settings"
                className="inline-flex rounded-full border border-border px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] transition-colors hover:bg-[var(--muted)]"
              >
                Request Google access
              </Link>
            ) : googleDocId ? (
              <>
                <button
                  type="button"
                  onClick={reimportFromGoogleDoc}
                  disabled={reimporting}
                  className="inline-flex rounded-full border border-border px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] transition-colors hover:bg-[var(--muted)] disabled:opacity-50"
                >
                  {reimporting ? "Re-importing..." : "Re-import from Google Doc"}
                </button>
                <button
                  type="button"
                  onClick={applyToGoogleDoc}
                  disabled={applying || approvedSuggestions.length === 0}
                  className="inline-flex rounded-full px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                  style={{ background: "var(--accent)" }}
                >
                  {applying ? "Applying..." : "Apply approved to Google Doc"}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setShowLinkDoc((current) => !current)}
                className="inline-flex rounded-full border border-border px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] transition-colors hover:bg-[var(--muted)]"
              >
                {showLinkDoc ? "Hide Doc Linker" : "Link Google Doc"}
              </button>
            )}
          </div>
        </div>

        {showLinkDoc && googleAccessEnabled ? (
          <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center">
            <input
              value={docUrl}
              onChange={(event) => setDocUrl(event.target.value)}
              placeholder="Paste a Google Doc URL or document ID"
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none transition-colors focus:border-accent"
            />
            <button
              type="button"
              onClick={linkGoogleDoc}
              disabled={linking || !docUrl.trim()}
              className="inline-flex shrink-0 rounded-full px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: "var(--accent)" }}
            >
              {linking ? "Linking..." : "Save Doc Link"}
            </button>
          </div>
        ) : null}

        {!googleAccessEnabled ? (
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            Paste, crawl, suggest, copy, and export work immediately. Google Docs connection and
            auto-apply unlock after manual beta approval.
          </p>
        ) : null}
      </div>

      {!reconnectRequired && googleRefreshIssuedAt
        ? (() => {
            const ageDays =
              (Date.now() - new Date(googleRefreshIssuedAt).getTime()) / 86_400_000;
            if (ageDays < 5) return null;
            const hoursLeft = Math.max(0, Math.round((7 - ageDays) * 24));
            return (
              <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 sm:px-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span>
                    Google Docs connection expires in about {hoursLeft} hour
                    {hoursLeft === 1 ? '' : 's'} (7-day test-mode limit). Reconnect now to avoid
                    interruption.
                  </span>
                  <Link
                    href="/projects/mylinks/settings"
                    className="inline-flex rounded-full border border-amber-300 bg-amber-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-amber-900 transition-colors hover:bg-amber-200"
                  >
                    Reconnect Google
                  </Link>
                </div>
              </div>
            );
          })()
        : null}

      {reconnectRequired ? (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span>
              <strong>Google connection expired.</strong> Reconnect Google Docs to re-import or apply
              links.
            </span>
            <Link
              href="/projects/mylinks/settings"
              className="inline-flex rounded-full bg-amber-900 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-90"
            >
              Reconnect Google
            </Link>
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="border-b border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:px-6">
          {error}
        </div>
      ) : null}

      <div className="flex-1 overflow-y-auto pb-40 xl:pb-0">
        <div className="grid min-h-full xl:grid-cols-[minmax(0,1fr)_320px]">
          <div
            ref={articlePanelRef}
            onClick={handleArticleClick}
            className="border-b border-border px-4 py-6 xl:border-b-0 xl:border-r xl:px-6"
          >
            <h2 className="text-2xl font-semibold text-foreground">{article.title}</h2>
            <div
              className="prose prose-sm mt-6 max-w-none leading-relaxed text-foreground"
              dangerouslySetInnerHTML={{ __html: highlightedDraft }}
            />
          </div>

          <section className="border-t border-border bg-[var(--muted)]/20 px-4 py-5 xl:hidden">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Suggestions
              </p>
              <p className="text-xs text-muted-foreground">
                Tap a highlighted phrase to inspect its matching route.
              </p>
            </div>

            {suggestions.length === 0 ? (
              <div className="text-sm leading-7 text-muted-foreground">
                {hasGenerated
                  ? "The link generator reviewed the article and didn't find destinations that clearly fit. These are all the relevant links we could confidently recommend. Expand the draft or add client-approved URLs and regenerate to try again."
                  : "No suggestions yet. Generate suggestions after crawling the site and adding any client-approved destinations."}
              </div>
            ) : (
              <div className="space-y-4">
                {suggestions.map((suggestion) => (
                  <SuggestionCard
                    key={suggestion.id}
                    suggestion={suggestion}
                    isActive={suggestion.id === activeSuggestionId}
                    onSelect={scrollToSuggestion}
                    onStatusChange={updateStatus}
                  />
                ))}
              </div>
            )}
          </section>

          <aside
            className="relative hidden bg-[var(--muted)]/25 xl:block"
            style={{ minHeight: railHeight ?? undefined }}
          >
            {suggestions.length === 0 ? (
              <div className="px-6 py-16 text-sm leading-7 text-muted-foreground">
                {hasGenerated
                  ? "The link generator reviewed the article and didn't find destinations that clearly fit. These are all the relevant links we could confidently recommend. Expand the draft or add client-approved URLs and regenerate to try again."
                  : "No suggestions yet. Generate suggestions after crawling the site and adding any client-approved destinations."}
              </div>
            ) : (
              suggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  ref={(element) => {
                    cardRefsMap.current[suggestion.id] = element;
                  }}
                  className="absolute left-0 right-0 px-3 py-1 sm:px-4"
                  style={{
                    top: cardPositions[suggestion.id] ?? anchorPositions[suggestion.id] ?? 0,
                    zIndex: suggestion.id === activeSuggestionId ? 20 : 1,
                  }}
                >
                  <SuggestionCard
                    suggestion={suggestion}
                    isActive={suggestion.id === activeSuggestionId}
                    onSelect={scrollToSuggestion}
                    onStatusChange={updateStatus}
                    compact
                  />
                </div>
              ))
            )}
          </aside>
        </div>
      </div>

      {activeSuggestion ? (
        <div className="pointer-events-none fixed inset-x-4 bottom-4 z-30 xl:hidden">
          <div className="pointer-events-auto rounded-[1.5rem] border border-border bg-background p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Selected suggestion
              </p>
              <button
                type="button"
                onClick={() => setActiveSuggestionId(null)}
                className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground"
              >
                Close
              </button>
            </div>
            <SuggestionCard
              suggestion={activeSuggestion}
              isActive
              onSelect={scrollToSuggestion}
              onStatusChange={updateStatus}
            />
          </div>
        </div>
      ) : null}

      {toast ? (
        <div className="fixed bottom-6 left-4 right-4 rounded-2xl bg-foreground px-4 py-3 text-sm text-background shadow-lg sm:left-auto sm:right-6 sm:max-w-sm">
          {toast}
        </div>
      ) : null}
    </div>
  );
}

function SuggestionCard({
  suggestion,
  isActive,
  onStatusChange,
  onSelect,
  compact = false,
}: {
  suggestion: Suggestion;
  isActive: boolean;
  onStatusChange: (id: string, status: "approved" | "rejected" | "pending") => void;
  onSelect: (id: string) => void;
  compact?: boolean;
}) {
  const statusClass =
    suggestion.status === "approved"
      ? "border-green-300 bg-green-50"
      : suggestion.status === "rejected"
        ? "border-gray-200 bg-gray-100 opacity-70"
        : "border-yellow-300 bg-background";
  const justificationPreview =
    suggestion.justification.length > 120
      ? `${suggestion.justification.slice(0, 117)}...`
      : suggestion.justification;

  return (
    <article
      className={`rounded-[1.1rem] border ${compact ? "p-3" : "p-4"} shadow-sm transition-shadow ${
        isActive ? "ring-2 ring-[var(--accent)]" : ""
      } ${statusClass}`}
      onClick={() => onSelect(suggestion.id)}
    >
      <div className="flex items-start justify-between gap-3">
        <p className={`${compact ? "text-[13px] leading-5" : "text-sm leading-6"} font-semibold text-foreground`}>
          &ldquo;{suggestion.anchor_text}&rdquo;
        </p>
        <ConfidenceBadge confidence={suggestion.confidence} />
      </div>

      <div className={`flex flex-wrap gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground ${compact ? "mt-2" : "mt-3"}`}>
        <span className="rounded-full border border-border px-2 py-1">{suggestion.page_type}</span>
        <span className="rounded-full border border-border px-2 py-1">
          {suggestion.destination_source === "client" ? "client URL" : "site inventory"}
        </span>
      </div>

      <a
        href={suggestion.target_url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(event) => event.stopPropagation()}
        className={`${compact ? "mt-2 text-[13px]" : "mt-3 text-sm"} block truncate text-[var(--accent)] underline-offset-4 hover:underline`}
      >
        {suggestion.target_url}
      </a>

      <div
        className={`${compact ? "mt-3" : "mt-4"} flex items-center gap-3`}
        title="Relevance score: how strong the AI thinks this link is for the reader. Above 70% is usually a safe approval; below 60% is already filtered out."
      >
        <div className="h-1.5 flex-1 rounded-full bg-border">
          <div
            className="h-1.5 rounded-full"
            style={{
              width: `${Math.round(suggestion.relevance_score * 100)}%`,
              background: "var(--accent)",
            }}
          />
        </div>
        <span className="text-xs text-muted-foreground">
          {Math.round(suggestion.relevance_score * 100)}%
        </span>
      </div>

      {!compact || isActive ? (
        <p className={`${compact ? "mt-3 text-[13px] leading-6" : "mt-4 text-sm leading-7"} text-muted-foreground`}>
          {compact ? justificationPreview : suggestion.justification}
        </p>
      ) : null}

      {suggestion.status === "pending" ? (
        <div className={`${compact ? "mt-3" : "mt-4"} flex gap-3`} onClick={(event) => event.stopPropagation()}>
          <button
            type="button"
            onClick={() => onStatusChange(suggestion.id, "approved")}
            className={`inline-flex flex-1 rounded-full ${compact ? "px-3 py-2 text-[10px]" : "px-4 py-2 text-xs"} font-bold uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-90`}
            style={{ background: "var(--accent)" }}
          >
            Approve
          </button>
          <button
            type="button"
            onClick={() => onStatusChange(suggestion.id, "rejected")}
            className={`inline-flex flex-1 rounded-full border border-border ${compact ? "px-3 py-2 text-[10px]" : "px-4 py-2 text-xs"} font-semibold uppercase tracking-[0.12em] transition-colors hover:bg-[var(--muted)]`}
          >
            Reject
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onStatusChange(suggestion.id, "pending");
          }}
          className={`${compact ? "mt-3 text-[10px]" : "mt-4 text-xs"} font-semibold uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground`}
        >
          Move back to pending
        </button>
      )}
    </article>
  );
}

function ConfidenceBadge({
  confidence,
}: {
  confidence: Suggestion["confidence"];
}) {
  const className =
    confidence === "high"
      ? "bg-green-100 text-green-700"
      : confidence === "medium"
        ? "bg-yellow-100 text-yellow-700"
        : "bg-gray-100 text-gray-600";

  return (
    <span className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${className}`}>
      {confidence}
    </span>
  );
}

