import { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about ADACheck and our mission to make the web accessible for everyone.",
};

export default function AboutPage() {
  return (
    <div className="py-20">
      <Container size="md">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="success" className="mb-4">About Us</Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Making the Web Accessible for Everyone
          </h1>
          <p className="text-xl text-slate-400">
            We believe everyone deserves equal access to digital experiences.
          </p>
        </div>

        {/* Mission */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
          <div className="prose prose-invert prose-slate max-w-none">
            <p className="text-slate-300 text-lg leading-relaxed">
              Over 1 billion people worldwide live with some form of disability. Yet the vast majority
              of websites remain inaccessible, creating barriers that exclude people from essential
              services, information, and opportunities.
            </p>
            <p className="text-slate-300 text-lg leading-relaxed mt-4">
              ADACheck was founded to help organizations identify and fix accessibility issues
              before they become barriers. We combine automated testing with AI-powered analysis to
              make accessibility compliance faster, easier, and more affordable than ever.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8">Our Values</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50">
              <div className="w-12 h-12 rounded-lg bg-emerald-900/50 flex items-center justify-center text-emerald-400 mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Inclusion First</h3>
              <p className="text-slate-400">
                We design every feature with accessibility in mind, ensuring our own product
                is fully accessible to all users.
              </p>
            </div>
            <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50">
              <div className="w-12 h-12 rounded-lg bg-emerald-900/50 flex items-center justify-center text-emerald-400 mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Transparency</h3>
              <p className="text-slate-400">
                We&apos;re upfront about what automated testing can and cannot do. We never
                overpromise or claim to guarantee compliance.
              </p>
            </div>
            <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50">
              <div className="w-12 h-12 rounded-lg bg-emerald-900/50 flex items-center justify-center text-emerald-400 mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Continuous Improvement</h3>
              <p className="text-slate-400">
                Accessibility standards evolve, and so do we. We continuously update our
                scanning algorithms and AI models.
              </p>
            </div>
            <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50">
              <div className="w-12 h-12 rounded-lg bg-emerald-900/50 flex items-center justify-center text-emerald-400 mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Education</h3>
              <p className="text-slate-400">
                Beyond just finding issues, we help teams understand why accessibility
                matters and how to build inclusive experiences.
              </p>
            </div>
          </div>
        </section>

        {/* Technology */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-4">Our Technology</h2>
          <div className="prose prose-invert prose-slate max-w-none">
            <p className="text-slate-300 text-lg leading-relaxed">
              ADACheck combines industry-standard testing engines (axe-core and Pa11y) with
              Claude AI for intelligent analysis. Our platform:
            </p>
            <ul className="text-slate-300 mt-4 space-y-2">
              <li>Crawls websites using Playwright for accurate, real-browser testing</li>
              <li>Runs comprehensive WCAG 2.1 AA checks on every page</li>
              <li>Uses Claude AI to explain issues in plain language and provide specific fixes</li>
              <li>Captures visual evidence (screenshots) for each finding</li>
              <li>Generates risk scores to help prioritize remediation efforts</li>
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center p-8 rounded-xl border border-emerald-800/50 bg-emerald-900/20">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Make Your Site Accessible?
          </h2>
          <p className="text-slate-400 mb-6">
            Start with a free scan and see how we can help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/scan">
              <Button size="lg">Start Free Scan</Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg">Contact Us</Button>
            </Link>
          </div>
        </section>
      </Container>
    </div>
  );
}
