import { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple, transparent pricing for accessibility scanning. Start free, upgrade as you grow.",
};

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out our accessibility scanner",
    features: [
      "Up to 10 pages per scan",
      "Basic accessibility report",
      "PDF export",
      "WCAG 2.1 AA checks",
      "Community support",
    ],
    limitations: [
      "5 scans per month",
      "No AI recommendations",
    ],
    cta: "Start Scanning",
    href: "/scan",
    popular: false,
    badge: null,
  },
  {
    name: "Pro",
    price: "$49",
    period: "per month",
    description: "For teams serious about accessibility compliance",
    features: [
      "Up to 100 pages per scan",
      "AI-powered recommendations",
      "Priority scanning",
      "PDF & JSON exports",
      "Visual evidence capture",
      "Email support",
      "Unlimited scans",
      "Risk scoring",
    ],
    limitations: [],
    cta: "Start Free (Beta)",
    href: "/scan",
    popular: true,
    badge: "Free During Beta",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "per year",
    description: "For organizations with advanced compliance needs",
    features: [
      "Unlimited pages per scan",
      "Custom AI training",
      "API access",
      "SSO / SAML",
      "Dedicated support",
      "Custom integrations",
      "Compliance reporting",
      "SLA guarantee",
      "On-premise option",
    ],
    limitations: [],
    cta: "Contact Us",
    href: "/contact",
    popular: false,
    badge: null,
  },
];

export default function PricingPage() {
  return (
    <div className="py-20">
      <Container>
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="success" className="mb-4">Pricing</Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Start free and upgrade as your accessibility needs grow.
            No hidden fees, no surprises.
          </p>

          {/* Beta Notice */}
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-900/30 border border-emerald-700/50">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-400 text-sm font-medium">
              Beta: All Pro features are currently free while we finalize our platform
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border ${
                plan.popular
                  ? "border-emerald-500 bg-slate-800/70"
                  : "border-slate-700 bg-slate-800/50"
              } p-8`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge variant="success">Most Popular</Badge>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-slate-400">/{plan.period}</span>
                </div>
                <p className="text-slate-400 mt-2">{plan.description}</p>
              </div>

              <Link href={plan.href}>
                <Button
                  variant={plan.popular ? "primary" : "outline"}
                  className="w-full mb-6"
                >
                  {plan.cta}
                </Button>
              </Link>

              <div className="space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-slate-300">{feature}</span>
                  </div>
                ))}
                {plan.limitations.map((limitation) => (
                  <div key={limitation} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-slate-500">{limitation}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <details className="group rounded-lg border border-slate-800 bg-slate-900/50">
              <summary className="flex cursor-pointer items-center justify-between p-4 text-white font-medium">
                Can I cancel anytime?
                <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-4 pb-4 text-slate-400">
                Yes, you can cancel your subscription at any time. You&apos;ll continue to have access until the end of your billing period.
              </div>
            </details>
            <details className="group rounded-lg border border-slate-800 bg-slate-900/50">
              <summary className="flex cursor-pointer items-center justify-between p-4 text-white font-medium">
                Do you offer refunds?
                <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-4 pb-4 text-slate-400">
                We offer a 14-day money-back guarantee for Pro plans. If you&apos;re not satisfied, contact us for a full refund.
              </div>
            </details>
            <details className="group rounded-lg border border-slate-800 bg-slate-900/50">
              <summary className="flex cursor-pointer items-center justify-between p-4 text-white font-medium">
                What payment methods do you accept?
                <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-4 pb-4 text-slate-400">
                We accept all major credit cards (Visa, Mastercard, American Express) and PayPal. Enterprise customers can pay by invoice.
              </div>
            </details>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <p className="text-slate-400 mb-4">
            Have questions about which plan is right for you?
          </p>
          <Link href="/contact">
            <Button variant="outline">Contact Us</Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}
