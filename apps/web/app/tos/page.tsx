"use client";

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-4xl px-6 py-12 space-y-4">
        <h1 className="text-3xl font-semibold">Terms of Service (Preview)</h1>
        <p className="text-slate-300">
          By using this service you agree that results are provided “as is” without warranty
          of legal compliance. The tool offers automated and AI-assisted findings only and
          does not constitute legal advice or certification of WCAG conformance.
        </p>
        <ul className="list-disc space-y-2 pl-6 text-slate-200">
          <li>Do not rely solely on automated findings for accessibility conformance.</li>
          <li>Human review and remediation remain your responsibility.</li>
          <li>We may retain scan metadata for service quality; do not submit secrets.</li>
          <li>Use is subject to applicable laws; you are responsible for your content.</li>
        </ul>
        <p className="text-xs text-slate-500">
          Draft placeholder — finalize with counsel before launch.
        </p>
      </div>
    </main>
  );
}

