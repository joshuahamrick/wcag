"use client";

export default function Methodology() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-4xl px-6 py-12 space-y-4">
        <h1 className="text-3xl font-semibold">Methodology & Disclaimers</h1>
        <p className="text-slate-300">
          Our assessments combine automated rules (axe-core, Pa11y) with AI-generated
          explanations. Automated testing cannot determine full WCAG conformance. Human
          review is required for subjective criteria (e.g., link purpose, instructions
          clarity, error messaging).
        </p>
        <ul className="list-disc space-y-2 pl-6 text-slate-200">
          <li>Scope: WCAG 2.1 AA automated checks; some heuristics for risk.</li>
          <li>
            Evidence: DOM snapshots and screenshots (when enabled) inform AI explanations;
            manual confirmation is recommended.
          </li>
          <li>
            Risk ratings: LEGAL / USABILITY / BEST PRACTICE are guidance, not certification.
          </li>
          <li>This tool does not provide legal advice. Engage qualified counsel as needed.</li>
        </ul>
        <p className="text-xs text-slate-500">
          Last updated automatically from the current build.
        </p>
      </div>
    </main>
  );
}

