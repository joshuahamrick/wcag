import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/30 via-slate-950 to-slate-950" />

        <Container className="relative">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="success" className="mb-6">
              AI-Powered Accessibility Scanning
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Make Your Website
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600"> Accessible </span>
              to Everyone
            </h1>
            <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
              Scan your website for WCAG 2.1 compliance issues. Get AI-powered explanations
              and actionable recommendations to fix accessibility problems fast.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/scan">
                <Button size="lg" className="text-base px-8">
                  Start Free Scan
                  <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg" className="text-base px-8">
                  View Pricing
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-sm text-slate-500">
              No credit card required. Scan up to 10 pages free.
            </p>
          </div>
        </Container>
      </section>

      {/* Trust Badges */}
      <section className="py-12 border-y border-slate-800/50">
        <Container>
          <div className="flex flex-wrap justify-center items-center gap-8 text-slate-500">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>WCAG 2.1 AA</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>ADA Compliance</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Section 508</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>EN 301 549</span>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-28">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything You Need for Accessibility Compliance
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Our platform combines automated testing with AI analysis to give you
              comprehensive accessibility insights.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
              title="Automated Scanning"
              description="Crawl your entire website automatically. We check every page against WCAG 2.1 guidelines using axe-core and Pa11y engines."
            />
            <FeatureCard
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              }
              title="AI-Powered Analysis"
              description="Claude AI interprets findings in plain language, explaining the real-world impact and providing specific, actionable recommendations."
            />
            <FeatureCard
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              }
              title="Risk Scoring"
              description="Prioritize fixes with our intelligent risk scoring. Understand which issues pose legal risk vs. those that affect usability."
            />
            <FeatureCard
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
              title="PDF & JSON Reports"
              description="Export professional PDF reports for stakeholders or JSON data for developers. Share findings with your team instantly."
            />
            <FeatureCard
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
              title="Visual Evidence"
              description="Every issue includes screenshots and HTML snapshots as evidence. See exactly what the scanner found and where."
            />
            <FeatureCard
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
              title="Fast Results"
              description="Get comprehensive accessibility reports in minutes, not days. Our cloud infrastructure scales to scan sites of any size."
            />
          </div>
        </Container>
      </section>

      {/* How It Works */}
      <section className="py-20 sm:py-28 bg-slate-900/50">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-slate-400">
              Three simple steps to accessibility compliance
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Enter Your URL"
              description="Just paste your website URL and select how many pages to scan. No installation or code changes required."
            />
            <StepCard
              number="2"
              title="We Scan & Analyze"
              description="Our automated crawlers check every page while AI analyzes findings to provide context and recommendations."
            />
            <StepCard
              number="3"
              title="Get Your Report"
              description="Receive a prioritized list of issues with clear explanations and fixes. Export as PDF or JSON."
            />
          </div>

          <div className="text-center mt-12">
            <Link href="/scan">
              <Button size="lg">
                Try It Now - It&apos;s Free
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-28">
        <Container>
          <div className="relative rounded-2xl bg-gradient-to-r from-emerald-900/50 to-emerald-800/30 border border-emerald-800/50 p-8 sm:p-12 lg:p-16 text-center overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Make Your Site Accessible?
              </h2>
              <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
                Join thousands of websites using ADACheck to identify and fix
                accessibility issues before they become legal problems.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/scan">
                  <Button size="lg" className="text-base px-8">
                    Start Free Scan
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button variant="outline" size="lg" className="text-base px-8">
                    See Pricing
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ Preview */}
      <section className="py-20 sm:py-28 border-t border-slate-800/50">
        <Container size="md">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            <FAQItem
              question="What accessibility standards do you check?"
              answer="We test against WCAG 2.1 Level AA guidelines, which covers ADA, Section 508, and EN 301 549 requirements. Our scans check for issues like missing alt text, color contrast problems, keyboard navigation barriers, and more."
            />
            <FAQItem
              question="Is this a replacement for manual accessibility testing?"
              answer="No. Automated tools can catch about 30-40% of accessibility issues. Many WCAG criteria require human judgment. We recommend using our tool for initial scanning and ongoing monitoring, complemented by manual testing and user research."
            />
            <FAQItem
              question="Will this make my site legally compliant?"
              answer="Our tool helps identify potential issues, but we cannot guarantee legal compliance. Accessibility law varies by jurisdiction and situation. We recommend consulting with accessibility specialists and legal counsel for compliance assurance."
            />
            <FAQItem
              question="How long does a scan take?"
              answer="Most scans complete within 2-5 minutes depending on the number of pages. Large sites with 50+ pages may take longer. You'll receive results as soon as the scan completes."
            />
          </div>
        </Container>
      </section>
    </>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card hover className="p-6">
      <div className="w-12 h-12 rounded-lg bg-emerald-900/50 flex items-center justify-center text-emerald-400 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400">{description}</p>
    </Card>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 rounded-full bg-emerald-600 text-white text-xl font-bold flex items-center justify-center mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400">{description}</p>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group rounded-lg border border-slate-800 bg-slate-900/50">
      <summary className="flex cursor-pointer items-center justify-between p-4 text-white font-medium">
        {question}
        <svg
          className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </summary>
      <div className="px-4 pb-4 text-slate-400">
        {answer}
      </div>
    </details>
  );
}
