"use client";

import { useEffect, useMemo, useState } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge, SeverityBadge } from "@/components/ui/badge";

type ScanStatus = "pending" | "running" | "completed" | "failed";
type BusinessType = "government" | "publicAccommodation" | "education" | "healthcare" | "financial" | "other";

type StateComplianceInfo = {
  stateCode: string;
  stateName: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  estimatedExposure: string;
  demandLetterLikelihood: "low" | "medium" | "high";
  applicableLaws: {
    code: string;
    name: string;
    description: string;
    privateRightOfAction: boolean;
    penalties: string;
  }[];
  priorityRemediations: string[];
};

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
  errorMessage?: string;
  stateCode?: string;
  businessType?: BusinessType;
  stateCompliance?: StateComplianceInfo;
};

type StateOption = {
  code: string;
  name: string;
  riskMultiplier: number;
  litigationTrend: string;
};

type BusinessTypeOption = {
  value: BusinessType;
  label: string;
};

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export default function ScanPage() {
  const [siteUrl, setSiteUrl] = useState("");
  const [maxPages, setMaxPages] = useState(10);
  const [stateCode, setStateCode] = useState<string>("");
  const [businessType, setBusinessType] = useState<BusinessType>("other");
  const [loading, setLoading] = useState(false);
  const [scanId, setScanId] = useState<string | null>(null);
  const [scan, setScan] = useState<ScanResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [states, setStates] = useState<StateOption[]>([]);
  const [businessTypes, setBusinessTypes] = useState<BusinessTypeOption[]>([]);
  const [highRiskStates, setHighRiskStates] = useState<string[]>([]);
  const [stateDataLastVerified, setStateDataLastVerified] = useState<string>("");
  const [stateDisclaimer, setStateDisclaimer] = useState<string>("");

  // Fetch available states on mount
  useEffect(() => {
    async function fetchStates() {
      try {
        const res = await fetch(`${apiBase}/api/states`);
        if (res.ok) {
          const data = await res.json();
          setStates(data.states);
          setBusinessTypes(data.businessTypes);
          setHighRiskStates(data.highRiskStates);
          if (data.lastVerified) setStateDataLastVerified(data.lastVerified);
          if (data.disclaimer) setStateDisclaimer(data.disclaimer);
        }
      } catch {
        // States API unavailable, will use federal-only mode
      }
    }
    fetchStates();
  }, []);

  useEffect(() => {
    if (!scanId) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${apiBase}/api/scans/${scanId}`);
        if (!res.ok) return;
        const data = (await res.json()) as ScanResponse;
        setScan(data);
        if (data.status === "completed" || data.status === "failed") {
          clearInterval(interval);
          setLoading(false);
          if (data.status === "failed" && data.errorMessage) {
            setError(data.errorMessage);
          }
        }
      } catch {
        // Continue polling
      }
    }, 2000);
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
    setScanId(null);

    try {
      const body: Record<string, unknown> = { siteUrl, maxPages };
      if (stateCode) body.stateCode = stateCode;
      if (businessType !== "other") body.businessType = businessType;

      const res = await fetch(`${apiBase}/api/scans`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const payload = await res.json();
        setError(payload?.error ? JSON.stringify(payload.error) : "Failed to start scan");
        setLoading(false);
        return;
      }

      const data = (await res.json()) as { id: string; status: ScanStatus };
      setScanId(data.id);
    } catch (err) {
      setError("Failed to connect to API");
      setLoading(false);
    }
  }

  const getRiskScoreColor = (score: number) => {
    if (score >= 70) return "text-rose-400";
    if (score >= 40) return "text-amber-400";
    return "text-emerald-400";
  };

  return (
    <div className="py-12">
      <Container size="lg">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="success" className="mb-4">Free Accessibility Scan</Badge>
          <h1 className="text-4xl font-bold text-white mb-4">
            Scan Your Website for Accessibility Issues
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Get an instant WCAG 2.1 compliance report with AI-powered recommendations.
            Identify legal risks, usability issues, and best practice improvements.
          </p>
        </div>

        {/* Scan Form */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <Input
                label="Website URL"
                value={siteUrl}
                onChange={(e) => setSiteUrl(e.target.value)}
                placeholder="https://example.com"
                type="url"
              />
              <div className="grid grid-cols-3 gap-4">
                <div className="w-full">
                  <Input
                    label="Max Pages"
                    type="number"
                    min={1}
                    max={50}
                    value={maxPages}
                    onChange={(e) => setMaxPages(Number(e.target.value))}
                  />
                </div>
                <div className="w-full">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    State/Jurisdiction
                  </label>
                  <select
                    value={stateCode}
                    onChange={(e) => setStateCode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">Federal Only</option>
                    {states.map((state) => (
                      <option key={state.code} value={state.code}>
                        {state.name} {highRiskStates.includes(state.code) ? "⚠️" : ""}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-full">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Business Type
                  </label>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value as BusinessType)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    {businessTypes.length > 0 ? (
                      businessTypes.map((bt) => (
                        <option key={bt.value} value={bt.value}>
                          {bt.label}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="other">Other</option>
                        <option value="government">Government</option>
                        <option value="publicAccommodation">Public Accommodation</option>
                        <option value="education">Education</option>
                        <option value="healthcare">Healthcare</option>
                        <option value="financial">Financial</option>
                      </>
                    )}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                onClick={startScan}
                disabled={loading || !siteUrl}
                isLoading={loading}
                size="lg"
              >
                {loading ? "Scanning..." : "Start Scan"}
              </Button>
            </div>
            {stateCode && (
              <div className="mt-4 p-3 rounded-lg bg-amber-900/20 border border-amber-800/50 text-amber-300 text-sm">
                <strong>State-specific scan:</strong> Results will include {states.find(s => s.code === stateCode)?.name} compliance analysis with applicable state laws, risk assessment, and estimated legal exposure.
              </div>
            )}
            {error && (
              <div className="mt-4 p-3 rounded-lg bg-rose-900/30 border border-rose-800 text-rose-300 text-sm">
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status Panel */}
        {(loading || scan) && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500 uppercase tracking-wide mb-1">Status</p>
                  <div className="flex items-center gap-3">
                    <span className={`text-2xl font-bold ${
                      scan?.status === "completed" ? "text-emerald-400" :
                      scan?.status === "failed" ? "text-rose-400" :
                      "text-amber-400"
                    }`}>
                      {scan?.status ?? "running"}
                    </span>
                    {loading && (
                      <svg className="animate-spin h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 mt-1">
                    {scan ? `${scan.pageCount} pages scanned` : "Scanning..."}
                  </p>
                </div>

                {scan?.riskScore !== undefined && (
                  <div className="text-right">
                    <p className="text-sm text-slate-500 uppercase tracking-wide mb-1">Risk Score</p>
                    <p className={`text-4xl font-bold ${getRiskScoreColor(scan.riskScore)}`}>
                      {scan.riskScore}
                      <span className="text-lg text-slate-500">/100</span>
                    </p>
                  </div>
                )}

                {scanId && scan?.status === "completed" && (
                  <div className="flex gap-2">
                    <a
                      href={`${apiBase}/api/scans/${scanId}/report.pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm">
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        PDF Report
                      </Button>
                    </a>
                    <a
                      href={`${apiBase}/api/scans/${scanId}/export`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm">
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        JSON Export
                      </Button>
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Summary Cards */}
        {scan && scan.status === "completed" && (
          <>
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <SummaryCard
                label="Legal Risk Issues"
                value={issueBuckets.LEGAL}
                description="Potential ADA/WCAG violations"
                variant="danger"
              />
              <SummaryCard
                label="Usability Issues"
                value={issueBuckets.USABILITY}
                description="User experience barriers"
                variant="warning"
              />
              <SummaryCard
                label="Best Practices"
                value={issueBuckets.BEST_PRACTICE}
                description="Recommended improvements"
                variant="info"
              />
            </div>

            {/* State Compliance Panel */}
            {scan.stateCompliance && (
              <Card className="mb-8">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-white">
                        {scan.stateCompliance.stateName} Compliance Analysis
                      </h2>
                      <p className="text-sm text-slate-500">
                        State-specific legal risk assessment
                        {stateDataLastVerified && (
                          <span className="ml-2 text-slate-600">
                            (Data verified: {new Date(stateDataLastVerified).toLocaleDateString()})
                          </span>
                        )}
                      </p>
                    </div>
                    <RiskLevelBadge level={scan.stateCompliance.riskLevel} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-slate-400 mb-3">Risk Assessment</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300">Estimated Legal Exposure</span>
                          <span className="text-amber-400 font-medium">{scan.stateCompliance.estimatedExposure}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300">Demand Letter Likelihood</span>
                          <DemandLetterBadge likelihood={scan.stateCompliance.demandLetterLikelihood} />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-slate-400 mb-3">Priority Actions</h3>
                      <ul className="space-y-2">
                        {scan.stateCompliance.priorityRemediations.slice(0, 4).map((action, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                            <span className="text-emerald-400 mt-1">&#10003;</span>
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Applicable Laws */}
                  <div className="mt-6 pt-6 border-t border-slate-700/50">
                    <h3 className="text-sm font-medium text-slate-400 mb-3">Applicable State Laws</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {scan.stateCompliance.applicableLaws.map((law) => (
                        <div key={law.code} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-white">{law.name}</h4>
                            {law.privateRightOfAction && (
                              <Badge variant="danger" size="sm">Private Right of Action</Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-400 mb-2">{law.description}</p>
                          <p className="text-xs text-amber-400">
                            <strong>Penalties:</strong> {law.penalties}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* State Compliance Disclaimer */}
                  <div className="mt-6 p-4 rounded-lg bg-amber-900/20 border border-amber-800/50">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-amber-300 mb-1">Important Legal Disclaimer</p>
                        <p className="text-xs text-amber-200/80">
                          {stateDisclaimer || "This state compliance information is for educational purposes only and does not constitute legal advice. Laws, penalties, and enforcement practices may have changed. The risk assessments and exposure estimates are approximations based on general factors. Always consult with qualified legal counsel familiar with your specific jurisdiction and circumstances before making compliance decisions."}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Issues List */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-white">Accessibility Issues</h2>
                    <p className="text-sm text-slate-500">
                      {scan.issues.length} issues found across {scan.pageCount} pages
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-700/50">
                  {scan.issues.length === 0 ? (
                    <div className="p-8 text-center">
                      <div className="w-16 h-16 rounded-full bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-lg font-medium text-white">No issues found!</p>
                      <p className="text-slate-500">Great job! Your site passed all automated checks.</p>
                    </div>
                  ) : (
                    scan.issues.map((issue) => (
                      <IssueCard key={issue.id} issue={issue} />
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Disclaimer */}
            <div className="mt-8 p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <p className="text-sm text-slate-400 mb-3">
                <strong className="text-slate-300">Important Disclaimer:</strong> This automated scan identifies common accessibility issues but cannot detect all WCAG violations. Research indicates automated tools can identify approximately 30-40% of accessibility barriers. Many WCAG success criteria require human judgment and cannot be fully automated.
              </p>
              <p className="text-sm text-slate-400 mb-3">
                <strong className="text-slate-300">Not Legal Advice:</strong> The results, risk scores, and state compliance information provided are for educational and informational purposes only. They do not constitute legal advice, legal opinion, or a guarantee of compliance with any federal, state, or local accessibility laws including the ADA, Section 508, or state-specific statutes.
              </p>
              <p className="text-sm text-slate-400">
                <strong className="text-slate-300">Recommendation:</strong> We strongly recommend supplementing automated scanning with manual accessibility testing by qualified professionals, testing with assistive technologies, and consultation with legal counsel familiar with accessibility requirements in your jurisdiction.
              </p>
            </div>
          </>
        )}
      </Container>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  description,
  variant,
}: {
  label: string;
  value: number;
  description: string;
  variant: "danger" | "warning" | "info";
}) {
  const styles = {
    danger: "border-rose-800 bg-rose-900/20",
    warning: "border-amber-800 bg-amber-900/20",
    info: "border-blue-800 bg-blue-900/20",
  };

  const textStyles = {
    danger: "text-rose-400",
    warning: "text-amber-400",
    info: "text-blue-400",
  };

  return (
    <div className={`rounded-xl border p-5 ${styles[variant]}`}>
      <p className="text-sm text-slate-400 mb-1">{label}</p>
      <p className={`text-3xl font-bold ${textStyles[variant]}`}>{value}</p>
      <p className="text-xs text-slate-500 mt-1">{description}</p>
    </div>
  );
}

function IssueCard({ issue }: { issue: IssueRecord }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="p-4 hover:bg-slate-800/30 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <SeverityBadge severity={issue.severity} />
            {issue.wcagId && (
              <Badge size="sm">{issue.wcagId}</Badge>
            )}
            {issue.needsReview && (
              <Badge variant="warning" size="sm">Needs Review</Badge>
            )}
          </div>
          <h3 className="font-medium text-white">{issue.title}</h3>
          <p className="text-sm text-slate-400 truncate">{issue.pageUrl}</p>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-2 text-slate-400 hover:text-white transition-colors"
        >
          <svg
            className={`w-5 h-5 transition-transform ${expanded ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {expanded && (
        <div className="mt-4 space-y-3 text-sm">
          <div>
            <p className="text-slate-500 mb-1">Description</p>
            <p className="text-slate-300">{issue.description}</p>
          </div>
          <div>
            <p className="text-slate-500 mb-1">Recommendation</p>
            <p className="text-emerald-400">{issue.recommendation}</p>
          </div>
          {issue.selector && (
            <div>
              <p className="text-slate-500 mb-1">Selector</p>
              <code className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-300">
                {issue.selector}
              </code>
            </div>
          )}
          {issue.snippet && (
            <div>
              <p className="text-slate-500 mb-1">Code Snippet</p>
              <pre className="text-xs bg-slate-800 p-3 rounded overflow-x-auto text-slate-300">
                {issue.snippet}
              </pre>
            </div>
          )}
          <div className="flex gap-4 text-xs text-slate-500">
            <span>Confidence: {(issue.confidence * 100).toFixed(0)}%</span>
          </div>
        </div>
      )}
    </div>
  );
}

function RiskLevelBadge({ level }: { level: "low" | "medium" | "high" | "critical" }) {
  const styles = {
    low: "bg-emerald-900/30 text-emerald-400 border-emerald-800",
    medium: "bg-amber-900/30 text-amber-400 border-amber-800",
    high: "bg-orange-900/30 text-orange-400 border-orange-800",
    critical: "bg-rose-900/30 text-rose-400 border-rose-800",
  };

  const labels = {
    low: "Low Risk",
    medium: "Medium Risk",
    high: "High Risk",
    critical: "Critical Risk",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${styles[level]}`}>
      {labels[level]}
    </span>
  );
}

function DemandLetterBadge({ likelihood }: { likelihood: "low" | "medium" | "high" }) {
  const styles = {
    low: "text-emerald-400",
    medium: "text-amber-400",
    high: "text-rose-400",
  };

  const labels = {
    low: "Low",
    medium: "Medium",
    high: "High",
  };

  return (
    <span className={`font-medium ${styles[likelihood]}`}>
      {labels[likelihood]}
    </span>
  );
}
