"use client";

import { useEffect, useMemo, useState } from "react";

type ScanStatus = "pending" | "running" | "completed" | "failed";

type IssueRecord = {
  id: string;
  pageUrl: string;
  wcagId?: string;
  severity: "LEGAL" | "USABILITY" | "BEST_PRACTICE";
  confidence: number;
  needsReview: boolean;
  title: string;
  description: string;
  recommendation: string;
  selector?: string;
  snippet?: string;
};

type ScanResponse = {
  id: string;
  siteUrl: string;
  status: ScanStatus;
  issues: IssueRecord[];
  startedAt: string;
  completedAt?: string;
  pageCount: number;
  riskScore?: number;
};

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export default function Home() {
  const [siteUrl, setSiteUrl] = useState("");
  const [maxPages, setMaxPages] = useState(5);
  const [loading, setLoading] = useState(false);
  const [scanId, setScanId] = useState<string | null>(null);
  const [scan, setScan] = useState<ScanResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!scanId) return;
    const interval = setInterval(async () => {
      const res = await fetch(`${apiBase}/api/scans/${scanId}`);
      if (!res.ok) return;
      const data = (await res.json()) as ScanResponse;
      setScan(data);
      if (data.status === "completed" || data.status === "failed") {
        clearInterval(interval);
        setLoading(false);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [scanId]);

  const issueBuckets = useMemo(() => {
    const buckets = { LEGAL: 0, USABILITY: 0, BEST_PRACTICE: 0 };
    (scan?.issues ?? []).forEach((issue) => {
      buckets[issue.severity] += 1;
    });
    return buckets;
  }, [scan]);

  async function startScan() {
    setError(null);
    setLoading(true);
    setScan(null);

    const res = await fetch(`${apiBase}/api/scans`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ siteUrl, maxPages }),
    });

    if (!res.ok) {
      const payload = await res.json();
      setError(payload?.error ? JSON.stringify(payload.error) : "Failed to start scan");
      setLoading(false);
      return;
    }

    const data = (await res.json()) as { id: string; status: ScanStatus };
    setScanId(data.id);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12">
        <header className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">
            WCAG Compliance Intelligence
          </p>
          <h1 className="text-3xl font-semibold sm:text-4xl">
            Scan a site, get risk, ship fixes
          </h1>
          <p className="text-slate-300 sm:text-lg">
            Automated checks + AI explanations. Clear legal/usability risk, export-ready
            reports.
          </p>
          <p className="text-xs text-slate-500">
            Methodology: automated rules (axe/Pa11y) + AI interpretation. Human review is
            required for subjective WCAG checks. This is not legal advice.
          </p>
          <div className="flex gap-4 text-sm">
            <a
              href="/methodology"
              className="text-emerald-300 underline underline-offset-4 hover:text-emerald-200"
            >
              Methodology
            </a>
            <a
              href="/tos"
              className="text-emerald-300 underline underline-offset-4 hover:text-emerald-200"
            >
              Terms
            </a>
            <a
              href="/privacy"
              className="text-emerald-300 underline underline-offset-4 hover:text-emerald-200"
            >
              Privacy
            </a>
          </div>
        </header>

        <section className="grid gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg sm:grid-cols-[2fr_1fr]">
          <div className="space-y-3">
            <label className="block text-sm text-slate-200">
              Site URL
              <input
                value={siteUrl}
                onChange={(e) => setSiteUrl(e.target.value)}
                placeholder="https://city.gov"
                className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
              />
            </label>
            <label className="block text-sm text-slate-200">
              Max pages to crawl
              <input
                type="number"
                min={1}
                max={50}
                value={maxPages}
                onChange={(e) => setMaxPages(Number(e.target.value))}
                className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
              />
            </label>
            <button
              onClick={startScan}
              disabled={loading || !siteUrl}
              className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
            >
              {loading ? "Scanning..." : "Start scan"}
            </button>
            {error && <p className="text-sm text-amber-400">{error}</p>}
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">Status</p>
            <p className="text-xl font-semibold">
              {scan?.status ?? (loading ? "running" : "idle")}
            </p>
            <p className="text-sm text-slate-400">
              {scan ? `${scan.pageCount} pages scanned` : "Up to 50 pages per run."}
            </p>
            {scan?.riskScore !== undefined && (
              <p className="mt-2 text-sm text-emerald-300">Risk score: {scan.riskScore}/100</p>
            )}
            {scanId && (
              <div className="mt-3 space-y-2 text-sm text-slate-300">
                <p>Scan ID: {scanId}</p>
                <div className="flex gap-2">
                  <a
                    href={`${apiBase}/api/scans/${scanId}/report.pdf`}
                    className="rounded border border-slate-700 px-3 py-1 hover:border-emerald-400"
                  >
                    Download PDF
                  </a>
                  <a
                    href={`${apiBase}/api/scans/${scanId}/export`}
                    className="rounded border border-slate-700 px-3 py-1 hover:border-emerald-400"
                  >
                    JSON
                  </a>
                </div>
              </div>
            )}
          </div>
        </section>

        {scan && (
          <>
            <section className="grid gap-3 sm:grid-cols-3">
              <SummaryCard label="Legal risk" value={issueBuckets.LEGAL} tone="critical" />
              <SummaryCard label="Usability risk" value={issueBuckets.USABILITY} tone="warn" />
              <SummaryCard
                label="Best practice"
                value={issueBuckets.BEST_PRACTICE}
                tone="muted"
              />
            </section>

            <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 shadow-inner">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">Findings</p>
                  <h2 className="text-xl font-semibold">
                    {scan.issues.length} issues across {scan.pageCount} pages
                  </h2>
                </div>
                {scan.riskScore !== undefined && (
                  <span className="rounded-md bg-slate-800 px-3 py-1 text-sm text-emerald-300">
                    Risk score: {scan.riskScore}/100
                  </span>
                )}
              </div>
              <div className="mt-4 divide-y divide-slate-800">
                {scan.issues.map((issue) => (
                  <article key={issue.id} className="py-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-white">{issue.title}</p>
                        <p className="text-xs text-slate-400">
                          {issue.pageUrl} · {issue.selector ?? "no selector"}
                        </p>
                      </div>
                      <SeverityBadge severity={issue.severity} />
                    </div>
                    <p className="mt-2 text-sm text-slate-200">{issue.description}</p>
                    <p className="mt-1 text-sm text-emerald-300">{issue.recommendation}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      WCAG: {issue.wcagId ?? "unknown"} · Confidence:{" "}
                      {(issue.confidence * 100).toFixed(0)}% · Needs review:{" "}
                      {issue.needsReview ? "Yes" : "No"}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

function SeverityBadge({
  severity,
}: {
  severity: "LEGAL" | "USABILITY" | "BEST_PRACTICE";
}) {
  const styles =
    severity === "LEGAL"
      ? "bg-rose-500/20 text-rose-200 border-rose-400"
      : severity === "USABILITY"
        ? "bg-amber-500/20 text-amber-100 border-amber-300"
        : "bg-slate-700 text-slate-200 border-slate-500";
  return <span className={`rounded border px-3 py-1 text-xs font-semibold ${styles}`}>{severity}</span>;
}

function SummaryCard({ label, value, tone }: { label: string; value: number; tone: "critical" | "warn" | "muted" }) {
  const toneClasses =
    tone === "critical"
      ? "border-rose-500 text-rose-100"
      : tone === "warn"
        ? "border-amber-400 text-amber-100"
        : "border-slate-700 text-slate-200";
  return (
    <div className={`rounded-lg border bg-slate-900/60 p-4 shadow-sm ${toneClasses}`}>
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
