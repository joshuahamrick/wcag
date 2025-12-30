"use client";

export default function Privacy() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-4xl px-6 py-12 space-y-4">
        <h1 className="text-3xl font-semibold">Privacy Notice (Preview)</h1>
        <p className="text-slate-300">
          We process URLs you submit to generate accessibility findings. Do not provide
          sensitive or confidential data. Scan results and artifacts may be retained to
          deliver the service and improve detection quality.
        </p>
        <ul className="list-disc space-y-2 pl-6 text-slate-200">
          <li>Inputs: URLs and page content fetched during scans.</li>
          <li>Outputs: Findings, screenshots/snapshots (when enabled), reports.</li>
          <li>AI: Explanations may call third-party AI providers if configured.</li>
          <li>Security: Use HTTPS endpoints; store creds in secure env vars.</li>
        </ul>
        <p className="text-xs text-slate-500">
          Draft placeholder — finalize with counsel before launch.
        </p>
      </div>
    </main>
  );
}

