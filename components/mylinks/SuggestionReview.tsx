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
import { Tooltip } from "@/components/mylinks/Tooltip";

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
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [lastClickedId, setLastClickedId] = useState<string | null>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [mobileTab, setMobileTab] = useState<'article' | 'suggestions'>('article');
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

  // ---------------- Multi-select helpers ----------------

  function toggleSelect(id: string, withShift: boolean) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (withShift && lastClickedId) {
        const currentIndex = suggestions.findIndex((s) => s.id === id);
        const anchorIndex = suggestions.findIndex((s) => s.id === lastClickedId);
        if (currentIndex !== -1 && anchorIndex !== -1) {
          const [from, to] =
            currentIndex < anchorIndex ? [currentIndex, anchorIndex] : [anchorIndex, currentIndex];
          for (let i = from; i <= to; i += 1) next.add(suggestions[i].id);
          setLastClickedId(id);
          return next;
        }
      }
      if (next.has(id)) next.delete(id);
      else next.add(id);
      setLastClickedId(id);
      return next;
    });
  }

  function clearSelection() {
    setSelectedIds(new Set());
  }

  function selectAllPending() {
    setSelectedIds(
      new Set(suggestions.filter((s) => s.status === "pending").map((s) => s.id))
    );
  }

  async function batchUpdateStatus(status: "approved" | "rejected" | "pending") {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    const previous = suggestions;
    setSuggestions((current) =>
      current.map((s) => (selectedIds.has(s.id) ? { ...s, status } : s))
    );
    clearSelection();

    const results = await Promise.allSettled(
      ids.map((id) =>
        fetch(`/api/mylinks/articles/${article.id}/suggestions/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        })
      )
    );
    const failed = results.filter(
      (r) => r.status === "rejected" || (r.status === "fulfilled" && !r.value.ok)
    ).length;
    if (failed > 0) {
      setSuggestions(previous);
      showToast(`${failed} update${failed === 1 ? "" : "s"} failed. Reverted.`);
    } else {
      showToast(
        `${ids.length} suggestion${ids.length === 1 ? "" : "s"} ${
          status === "approved" ? "approved" : status === "rejected" ? "rejected" : "moved to pending"
        }.`
      );
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

  // ---------------- Keyboard shortcuts ----------------
  useEffect(() => {
    function isEditable(el: EventTarget | null): boolean {
      if (!(el instanceof HTMLElement)) return false;
      const tag = el.tagName;
      return (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        el.isContentEditable
      );
    }

    function handleKey(event: KeyboardEvent) {
      if (isEditable(event.target)) return;

      const key = event.key.toLowerCase();

      // Cmd/Ctrl+A — select all pending (override native page select)
      if ((event.metaKey || event.ctrlKey) && key === "a") {
        event.preventDefault();
        selectAllPending();
        return;
      }

      if (event.metaKey || event.ctrlKey || event.altKey) return;

      // ? — show shortcut cheatsheet
      if (event.key === "?" || (event.shiftKey && key === "/")) {
        event.preventDefault();
        setShowShortcuts((v) => !v);
        return;
      }

      // Esc — clear selection or close modals
      if (event.key === "Escape") {
        if (showShortcuts) setShowShortcuts(false);
        else if (showApplyModal) setShowApplyModal(false);
        else clearSelection();
        return;
      }

      // Shift+A — select all pending
      if (event.shiftKey && key === "a") {
        event.preventDefault();
        selectAllPending();
        return;
      }

      const orderedIds = suggestions.map((s) => s.id);
      const currentIndex = activeSuggestionId
        ? orderedIds.indexOf(activeSuggestionId)
        : -1;

      // J / ArrowDown — next
      if (key === "j" || event.key === "ArrowDown") {
        event.preventDefault();
        const next = orderedIds[Math.min(orderedIds.length - 1, currentIndex + 1)];
        if (next) scrollToSuggestion(next);
        return;
      }
      // K / ArrowUp — prev
      if (key === "k" || event.key === "ArrowUp") {
        event.preventDefault();
        const prev = orderedIds[Math.max(0, currentIndex === -1 ? 0 : currentIndex - 1)];
        if (prev) scrollToSuggestion(prev);
        return;
      }

      if (!activeSuggestionId) return;
      const active = suggestions.find((s) => s.id === activeSuggestionId);
      if (!active) return;

      // A — approve
      if (key === "a") {
        event.preventDefault();
        if (selectedIds.size > 0) {
          void batchUpdateStatus("approved");
        } else {
          void updateStatus(activeSuggestionId, "approved");
        }
        return;
      }
      // R — reject
      if (key === "r") {
        event.preventDefault();
        if (selectedIds.size > 0) {
          void batchUpdateStatus("rejected");
        } else {
          void updateStatus(activeSuggestionId, "rejected");
        }
        return;
      }
      // U — move back to pending / undo
      if (key === "u") {
        event.preventDefault();
        if (selectedIds.size > 0) {
          void batchUpdateStatus("pending");
        } else {
          void updateStatus(activeSuggestionId, "pending");
        }
        return;
      }
      // X — toggle select on focused
      if (key === "x") {
        event.preventDefault();
        toggleSelect(activeSuggestionId, false);
        return;
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSuggestionId, suggestions, selectedIds, showApplyModal, showShortcuts]);

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
              title="Copy the article with approved links inline (HTML + plain text). Paste into Docs, Word, Notion, etc."
            >
              {copying ? "Copying..." : "Copy as HTML"}
            </button>
            <button
              type="button"
              onClick={exportLinkedVersion}
              disabled={approvedSuggestions.length === 0}
              className="inline-flex rounded-full border border-border px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] transition-colors hover:bg-[var(--muted)] disabled:cursor-not-allowed disabled:opacity-50"
              title="Download a Word (.docx) file with approved links baked in."
            >
              Export .docx
            </button>
            <button
              type="button"
              onClick={() => setShowShortcuts(true)}
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] transition-colors hover:bg-[var(--muted)]"
              title="Keyboard shortcuts (?)"
            >
              <span>?</span>
              <span className="hidden sm:inline">Shortcuts</span>
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
                  onClick={() => setShowApplyModal(true)}
                  disabled={applying || approvedSuggestions.length === 0}
                  className="inline-flex rounded-full px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                  style={{ background: "var(--accent)" }}
                  title="Send approved links to the linked Google Doc"
                >
                  {applying ? "Sending..." : "Send to Google Doc"}
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

      {selectedIds.size > 0 ? (
        <div
          className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 border-b px-4 py-2 sm:px-6"
          style={{
            background: 'var(--ml-bg-subtle)',
            borderColor: 'var(--ml-border)',
          }}
        >
          <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--ml-text)' }}>
            <strong>{selectedIds.size} selected</strong>
            <span style={{ color: 'var(--ml-text-muted)' }}>
              <span className="ml-kbd">A</span> approve ·{' '}
              <span className="ml-kbd">R</span> reject ·{' '}
              <span className="ml-kbd">U</span> back to pending ·{' '}
              <span className="ml-kbd">Esc</span> clear
            </span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => void batchUpdateStatus('approved')}
              className="ml-btn ml-btn-primary ml-btn-sm"
            >
              Approve {selectedIds.size}
            </button>
            <button
              type="button"
              onClick={() => void batchUpdateStatus('rejected')}
              className="ml-btn ml-btn-danger ml-btn-sm"
            >
              Reject {selectedIds.size}
            </button>
            <button
              type="button"
              onClick={() => void batchUpdateStatus('pending')}
              className="ml-btn ml-btn-sm"
            >
              Back to pending
            </button>
            <button
              type="button"
              onClick={clearSelection}
              className="ml-btn ml-btn-sm"
              title="Clear selection (Esc)"
            >
              Clear
            </button>
          </div>
        </div>
      ) : null}

      {/* Mobile-only tab switcher */}
      <div
        className="flex gap-1 border-b px-3 py-2 xl:hidden"
        style={{ background: 'var(--ml-bg-elevated)', borderColor: 'var(--ml-border)' }}
      >
        <button
          type="button"
          onClick={() => setMobileTab('article')}
          className="flex-1 rounded-md py-1.5 text-xs font-medium"
          style={{
            background:
              mobileTab === 'article' ? 'var(--ml-bg-subtle)' : 'transparent',
            color: mobileTab === 'article' ? 'var(--ml-text)' : 'var(--ml-text-muted)',
          }}
        >
          Article
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('suggestions')}
          className="flex-1 rounded-md py-1.5 text-xs font-medium"
          style={{
            background:
              mobileTab === 'suggestions' ? 'var(--ml-bg-subtle)' : 'transparent',
            color:
              mobileTab === 'suggestions' ? 'var(--ml-text)' : 'var(--ml-text-muted)',
          }}
        >
          Suggestions ({suggestions.length})
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-40 xl:pb-0">
        <div className="grid min-h-full xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <div
            ref={articlePanelRef}
            onClick={handleArticleClick}
            className={`border-b border-border px-4 py-6 xl:border-b-0 xl:border-r xl:px-6 xl:block ${
              mobileTab === 'article' ? 'block' : 'hidden'
            }`}
          >
            <h2 className="text-2xl font-semibold text-foreground">{article.title}</h2>
            <div
              className="ml-prose mt-6 max-w-none"
              suppressHydrationWarning
              dangerouslySetInnerHTML={{ __html: highlightedDraft }}
            />
          </div>

          <section
            className={`border-t border-border bg-[var(--muted)]/20 px-4 py-5 xl:hidden ${
              mobileTab === 'suggestions' ? 'block' : 'hidden'
            }`}
          >
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
                    selected={selectedIds.has(suggestion.id)}
                    onSelect={scrollToSuggestion}
                    onStatusChange={updateStatus}
                    onToggleSelect={toggleSelect}
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
                    selected={selectedIds.has(suggestion.id)}
                    onSelect={scrollToSuggestion}
                    onStatusChange={updateStatus}
                    onToggleSelect={toggleSelect}
                    compact
                  />
                </div>
              ))
            )}
          </aside>
        </div>
      </div>

      {activeSuggestion ? (() => {
        const orderedIds = suggestions.map((s) => s.id);
        const activeIndex = orderedIds.indexOf(activeSuggestion.id);
        const prevId = activeIndex > 0 ? orderedIds[activeIndex - 1] : null;
        const nextId =
          activeIndex !== -1 && activeIndex < orderedIds.length - 1
            ? orderedIds[activeIndex + 1]
            : null;
        return (
          <div className="pointer-events-none fixed inset-x-4 bottom-4 z-30 xl:hidden">
            <div
              className="pointer-events-auto rounded-[1.5rem] border p-4 shadow-2xl"
              style={{ background: 'var(--ml-bg-elevated)', borderColor: 'var(--ml-border)' }}
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.14em]"
                  style={{ color: 'var(--ml-text-faint)' }}
                >
                  {activeIndex + 1} of {orderedIds.length}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={!prevId}
                    onClick={() => prevId && scrollToSuggestion(prevId)}
                    className="ml-btn ml-btn-icon"
                    aria-label="Previous suggestion (K)"
                    title="Previous suggestion (K or ↑)"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    disabled={!nextId}
                    onClick={() => nextId && scrollToSuggestion(nextId)}
                    className="ml-btn ml-btn-icon"
                    aria-label="Next suggestion (J)"
                    title="Next suggestion (J or ↓)"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSuggestionId(null)}
                    className="ml-btn ml-btn-sm"
                    aria-label="Close selected suggestion (Esc)"
                    title="Close (Esc)"
                  >
                    Close
                  </button>
                </div>
              </div>
              <SuggestionCard
                suggestion={activeSuggestion}
                isActive
                selected={selectedIds.has(activeSuggestion.id)}
                onSelect={scrollToSuggestion}
                onStatusChange={updateStatus}
                onToggleSelect={toggleSelect}
              />
            </div>
          </div>
        );
      })() : null}

      {showApplyModal ? (
        <>
          <div
            className="ml-modal-overlay"
            onClick={() => !applying && setShowApplyModal(false)}
          />
          <div className="ml-modal" role="dialog" aria-modal="true">
            <h3 className="text-base font-semibold">Send to Google Doc?</h3>
            <p className="mt-2 text-sm" style={{ color: 'var(--ml-text-muted)' }}>
              <strong>{approvedSuggestions.length}</strong> approved link
              {approvedSuggestions.length === 1 ? '' : 's'} will be inserted into the linked
              Google Doc. This edits the live document.
            </p>
            <div
              className="mt-4 max-h-56 overflow-y-auto rounded-md border p-3 text-xs"
              style={{ borderColor: 'var(--ml-border)', background: 'var(--ml-bg-subtle)' }}
            >
              <ul className="space-y-1">
                {approvedSuggestions.slice(0, 10).map((s) => (
                  <li key={s.id} className="flex gap-2">
                    <span className="font-mono">&ldquo;{s.anchor_text}&rdquo;</span>
                    <span style={{ color: 'var(--ml-text-faint)' }}>→</span>
                    <span className="truncate" style={{ color: 'var(--ml-accent)' }}>
                      {s.target_url}
                    </span>
                  </li>
                ))}
                {approvedSuggestions.length > 10 ? (
                  <li style={{ color: 'var(--ml-text-faint)' }}>
                    &hellip; and {approvedSuggestions.length - 10} more
                  </li>
                ) : null}
              </ul>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowApplyModal(false)}
                disabled={applying}
                className="ml-btn"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  await applyToGoogleDoc();
                  setShowApplyModal(false);
                }}
                disabled={applying}
                className="ml-btn ml-btn-primary"
              >
                {applying
                  ? 'Sending...'
                  : `Send ${approvedSuggestions.length} link${
                      approvedSuggestions.length === 1 ? '' : 's'
                    }`}
              </button>
            </div>
          </div>
        </>
      ) : null}

      {showShortcuts ? (
        <>
          <div className="ml-modal-overlay" onClick={() => setShowShortcuts(false)} />
          <div className="ml-modal" role="dialog" aria-modal="true">
            <h3 className="text-base font-semibold">Keyboard shortcuts</h3>
            <div className="mt-4 space-y-2 text-sm">
              {[
                ['J / ↓', 'Next suggestion'],
                ['K / ↑', 'Previous suggestion'],
                ['A', 'Approve focused (or selected)'],
                ['R', 'Reject focused (or selected)'],
                ['U', 'Move back to pending'],
                ['X', 'Toggle selection on focused'],
                ['Shift + A', 'Select all pending'],
                ['Cmd / Ctrl + A', 'Select all pending (page-wide)'],
                ['Esc', 'Clear selection / close modals'],
                ['?', 'Toggle this cheatsheet'],
              ].map(([key, desc]) => (
                <div key={key} className="flex items-center justify-between">
                  <span style={{ color: 'var(--ml-text-muted)' }}>{desc}</span>
                  <span className="ml-kbd">{key}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setShowShortcuts(false)}
                className="ml-btn"
              >
                Got it
              </button>
            </div>
          </div>
        </>
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
  selected = false,
  onStatusChange,
  onSelect,
  onToggleSelect,
  compact = false,
}: {
  suggestion: Suggestion;
  isActive: boolean;
  selected?: boolean;
  onStatusChange: (id: string, status: "approved" | "rejected" | "pending") => void;
  onSelect: (id: string) => void;
  onToggleSelect?: (id: string, withShift: boolean) => void;
  compact?: boolean;
}) {
  const statusStyle: React.CSSProperties =
    suggestion.status === "approved"
      ? { borderColor: 'var(--ml-success)', background: 'var(--ml-success-bg)' }
      : suggestion.status === "rejected"
        ? { borderColor: 'var(--ml-border)', background: 'var(--ml-bg-subtle)', opacity: 0.7 }
        : { borderColor: 'var(--ml-border)', background: 'var(--ml-bg-elevated)' };
  const ringStyle: React.CSSProperties = selected
    ? { boxShadow: '0 0 0 2px #3b82f6 inset' }
    : isActive
      ? { boxShadow: '0 0 0 2px var(--ml-accent) inset' }
      : {};
  const isPending = suggestion.status === "pending";
  const isExpanded = !compact || isActive;

  return (
    <article
      className={`rounded-md border ${compact ? 'p-2.5' : 'p-3.5'} transition-all cursor-pointer`}
      style={{ ...statusStyle, ...ringStyle }}
      onClick={() => onSelect(suggestion.id)}
    >
      <div className="flex items-start gap-2">
        {onToggleSelect ? (
          <input
            type="checkbox"
            checked={selected}
            onClick={(event) => event.stopPropagation()}
            onChange={(event) => {
              onToggleSelect(suggestion.id, (event.nativeEvent as MouseEvent).shiftKey);
            }}
            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer"
            aria-label="Select suggestion"
          />
        ) : null}
        <p
          className={`${
            compact ? 'text-[13px] leading-snug' : 'text-sm leading-snug'
          } flex-1 font-semibold`}
          style={{ color: 'var(--ml-text)' }}
        >
          &ldquo;{suggestion.anchor_text}&rdquo;
        </p>
        <Tooltip
          label={
            <>
              <strong>
                {suggestion.confidence === 'high'
                  ? 'High confidence'
                  : suggestion.confidence === 'medium'
                    ? 'Medium confidence'
                    : 'Low confidence'}
              </strong>
              <br />
              How certain the AI is this destination fits the anchor. High = exact topical match,
              medium = partial, low = loose.
            </>
          }
        >
          <ConfidenceBadge confidence={suggestion.confidence} />
        </Tooltip>
      </div>

      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
        <Tooltip
          label={
            <>
              <strong>{suggestion.page_type}</strong>
              <br />
              The kind of destination page. Product/service/landing pages get priority when the fit
              is strong.
            </>
          }
        >
          <span className="ml-chip">{suggestion.page_type}</span>
        </Tooltip>
        <Tooltip
          label={
            suggestion.destination_source === 'client'
              ? 'A URL you manually marked as client-approved for this article.'
              : 'A URL drawn automatically from the crawled site inventory.'
          }
        >
          <span
            className={`ml-chip ${
              suggestion.destination_source === 'client' ? 'ml-chip-info' : ''
            }`}
          >
            {suggestion.destination_source === 'client' ? 'client' : 'inventory'}
          </span>
        </Tooltip>
      </div>

      <a
        href={suggestion.target_url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(event) => event.stopPropagation()}
        className="mt-2 block truncate text-[12.5px]"
        style={{ color: 'var(--ml-accent)', textDecoration: 'underline', textUnderlineOffset: 3 }}
      >
        {suggestion.target_url}
      </a>

      <Tooltip
        label={
          <>
            <strong>Relevance: {Math.round(suggestion.relevance_score * 100)}%</strong>
            <br />
            Above 70% is usually safe to approve. Below 60% is already filtered out.
          </>
        }
      >
        <div className="mt-2.5 flex w-full items-center gap-2">
          <div
            className="h-1.5 flex-1 rounded-full"
            style={{ background: 'var(--ml-border)' }}
          >
            <div
              className="h-1.5 rounded-full"
              style={{
                width: `${Math.round(suggestion.relevance_score * 100)}%`,
                background: 'var(--ml-accent)',
              }}
            />
          </div>
          <span className="text-[11px] tabular-nums" style={{ color: 'var(--ml-text-muted)' }}>
            {Math.round(suggestion.relevance_score * 100)}%
          </span>
        </div>
      </Tooltip>

      {isExpanded ? (
        <p
          className={`${compact ? 'mt-2 text-[12.5px]' : 'mt-3 text-[13px]'} leading-relaxed`}
          style={{ color: 'var(--ml-text-muted)' }}
        >
          {suggestion.justification}
        </p>
      ) : null}

      <div
        className="mt-2.5 flex items-center gap-2"
        onClick={(event) => event.stopPropagation()}
      >
        {isPending ? (
          <>
            <button
              type="button"
              onClick={() => onStatusChange(suggestion.id, 'approved')}
              className="ml-btn ml-btn-primary ml-btn-sm flex-1"
              title="Approve (A)"
            >
              Approve
              <span className="ml-kbd" style={{ marginLeft: 'auto' }}>
                A
              </span>
            </button>
            <button
              type="button"
              onClick={() => onStatusChange(suggestion.id, 'rejected')}
              className="ml-btn ml-btn-sm"
              title="Reject (R)"
            >
              Reject
              <span className="ml-kbd" style={{ marginLeft: 'auto' }}>
                R
              </span>
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => onStatusChange(suggestion.id, 'pending')}
            className="ml-btn ml-btn-sm"
            title="Move back to pending (U)"
          >
            ↶ Back to pending
          </button>
        )}
      </div>
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
      ? "ml-chip ml-chip-success"
      : confidence === "medium"
        ? "ml-chip ml-chip-warning"
        : "ml-chip";
  const letter = confidence === 'high' ? 'H' : confidence === 'medium' ? 'M' : 'L';

  return (
    <span className={className} aria-label={confidence}>
      {letter}
    </span>
  );
}

