import { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for ADACheck - how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <div className="py-20">
      <Container size="md">
        <article className="prose prose-invert prose-slate max-w-none">
          <h1>Privacy Policy</h1>
          <p className="lead">Last updated: January 2025</p>

          <p>
            ADACheck (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy.
            This Privacy Policy explains how we collect, use, disclose, and safeguard your
            information when you use our accessibility scanning service.
          </p>

          <h2>1. Information We Collect</h2>

          <h3>1.1 Information You Provide</h3>
          <ul>
            <li><strong>Account Information:</strong> Email address, name, company name, and password when you create an account</li>
            <li><strong>Payment Information:</strong> Billing address and payment card details (processed securely by our payment processor)</li>
            <li><strong>Scan Requests:</strong> Website URLs you submit for scanning</li>
            <li><strong>Communications:</strong> Messages you send to our support team</li>
          </ul>

          <h3>1.2 Information Collected Automatically</h3>
          <ul>
            <li><strong>Usage Data:</strong> Pages visited, features used, scan history, and interaction patterns</li>
            <li><strong>Device Information:</strong> Browser type, operating system, device identifiers</li>
            <li><strong>Log Data:</strong> IP address, access times, referring URLs</li>
            <li><strong>Cookies:</strong> See our <Link href="/cookies" className="text-emerald-400 hover:text-emerald-300">Cookie Policy</Link></li>
          </ul>

          <h3>1.3 Information from Scanned Websites</h3>
          <p>
            When you scan a website, we temporarily collect:
          </p>
          <ul>
            <li>HTML content of scanned pages</li>
            <li>Screenshots of scanned pages</li>
            <li>Accessibility findings and metadata</li>
          </ul>
          <p>
            This data is used solely to generate your accessibility report and is automatically
            deleted after 30 days unless you save it to your account.
          </p>

          <h2>2. How We Use Your Information</h2>
          <p>We use collected information to:</p>
          <ul>
            <li>Provide, maintain, and improve our Service</li>
            <li>Process transactions and send related information</li>
            <li>Send technical notices, updates, and security alerts</li>
            <li>Respond to your comments, questions, and support requests</li>
            <li>Monitor and analyze usage patterns and trends</li>
            <li>Detect, prevent, and address technical issues or fraud</li>
            <li>Develop new features and services</li>
          </ul>

          <h2>3. How We Share Your Information</h2>
          <p>We do not sell your personal information. We may share information with:</p>

          <h3>3.1 Service Providers</h3>
          <p>
            Third-party vendors who perform services on our behalf (hosting, payment processing,
            analytics, email delivery). These providers are contractually obligated to protect
            your information.
          </p>

          <h3>3.2 Legal Requirements</h3>
          <p>
            We may disclose information if required by law, regulation, legal process, or
            governmental request.
          </p>

          <h3>3.3 Business Transfers</h3>
          <p>
            In connection with a merger, acquisition, or sale of assets, your information may
            be transferred. We will notify you of any such change.
          </p>

          <h2>4. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your
            information, including:
          </p>
          <ul>
            <li>Encryption of data in transit (TLS) and at rest</li>
            <li>Regular security assessments and penetration testing</li>
            <li>Access controls and authentication requirements</li>
            <li>Employee security training</li>
          </ul>
          <p>
            However, no method of transmission over the Internet is 100% secure. We cannot
            guarantee absolute security.
          </p>

          <h2>5. Data Retention</h2>
          <ul>
            <li><strong>Account Data:</strong> Retained while your account is active and for 90 days after deletion</li>
            <li><strong>Scan Data:</strong> Automatically deleted after 30 days unless saved to your account</li>
            <li><strong>Saved Reports:</strong> Retained until you delete them or close your account</li>
            <li><strong>Log Data:</strong> Retained for up to 12 months for security and analytics</li>
          </ul>

          <h2>6. Your Rights</h2>
          <p>Depending on your location, you may have rights to:</p>
          <ul>
            <li><strong>Access:</strong> Request a copy of your personal data</li>
            <li><strong>Correction:</strong> Request correction of inaccurate data</li>
            <li><strong>Deletion:</strong> Request deletion of your data</li>
            <li><strong>Portability:</strong> Request your data in a portable format</li>
            <li><strong>Opt-out:</strong> Opt out of marketing communications</li>
            <li><strong>Restrict Processing:</strong> Request limitation of data processing</li>
          </ul>
          <p>
            To exercise these rights, contact us at privacy@adacheck.io.
          </p>

          <h2>7. International Data Transfers</h2>
          <p>
            Your information may be transferred to and processed in countries other than your
            own. We ensure appropriate safeguards are in place, including Standard Contractual
            Clauses approved by relevant authorities.
          </p>

          <h2>8. Children&apos;s Privacy</h2>
          <p>
            Our Service is not intended for children under 16. We do not knowingly collect
            personal information from children. If you believe we have collected information
            from a child, please contact us immediately.
          </p>

          <h2>9. California Privacy Rights (CCPA)</h2>
          <p>California residents have additional rights:</p>
          <ul>
            <li>Right to know what personal information is collected</li>
            <li>Right to know whether personal information is sold or disclosed</li>
            <li>Right to opt out of the sale of personal information (we do not sell your data)</li>
            <li>Right to non-discrimination for exercising privacy rights</li>
          </ul>

          <h2>10. European Privacy Rights (GDPR)</h2>
          <p>
            If you are in the European Economic Area, you have rights under the General Data
            Protection Regulation, including the rights described in Section 6. Our legal basis
            for processing includes:
          </p>
          <ul>
            <li><strong>Contract:</strong> Processing necessary to provide our Service</li>
            <li><strong>Legitimate Interests:</strong> Improving our Service and preventing fraud</li>
            <li><strong>Consent:</strong> Where you have provided explicit consent</li>
            <li><strong>Legal Obligation:</strong> Compliance with applicable laws</li>
          </ul>

          <h2>11. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy periodically. We will notify you of material
            changes by posting the new policy and updating the &quot;Last updated&quot; date. Your
            continued use of the Service after changes constitutes acceptance.
          </p>

          <h2>12. Contact Us</h2>
          <p>
            For questions about this Privacy Policy or our data practices, contact us at:
          </p>
          <p>
            Email: privacy@adacheck.io
          </p>
          <p>
            For GDPR-related inquiries, you may also contact our Data Protection Officer at
            dpo@adacheck.io.
          </p>
        </article>
      </Container>
    </div>
  );
}
