import { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Cookie Policy for ADACheck - how we use cookies and similar technologies.",
};

export default function CookiePage() {
  return (
    <div className="py-20">
      <Container size="md">
        <article className="prose prose-invert prose-slate max-w-none">
          <h1>Cookie Policy</h1>
          <p className="lead">Last updated: January 2025</p>

          <p>
            This Cookie Policy explains how ADACheck (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) uses
            cookies and similar technologies when you visit our website or use our services.
          </p>

          <h2>1. What Are Cookies?</h2>
          <p>
            Cookies are small text files that are stored on your device when you visit a website.
            They help the website remember your preferences and improve your experience. Cookies
            can be &quot;session&quot; cookies (deleted when you close your browser) or &quot;persistent&quot;
            cookies (remain until they expire or you delete them).
          </p>

          <h2>2. Types of Cookies We Use</h2>

          <h3>2.1 Essential Cookies</h3>
          <p>
            These cookies are necessary for the website to function properly. They enable core
            features like security, authentication, and accessibility. You cannot opt out of
            essential cookies.
          </p>
          <table>
            <thead>
              <tr>
                <th>Cookie</th>
                <th>Purpose</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>session_id</td>
                <td>Maintains your login session</td>
                <td>Session</td>
              </tr>
              <tr>
                <td>csrf_token</td>
                <td>Security protection against cross-site attacks</td>
                <td>Session</td>
              </tr>
              <tr>
                <td>cookie_consent</td>
                <td>Remembers your cookie preferences</td>
                <td>1 year</td>
              </tr>
            </tbody>
          </table>

          <h3>2.2 Analytics Cookies</h3>
          <p>
            These cookies help us understand how visitors interact with our website. They collect
            information anonymously and help us improve our service.
          </p>
          <table>
            <thead>
              <tr>
                <th>Cookie</th>
                <th>Purpose</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>_ga</td>
                <td>Google Analytics - distinguishes users</td>
                <td>2 years</td>
              </tr>
              <tr>
                <td>_gid</td>
                <td>Google Analytics - distinguishes users</td>
                <td>24 hours</td>
              </tr>
            </tbody>
          </table>

          <h3>2.3 Functional Cookies</h3>
          <p>
            These cookies remember your preferences and settings to provide a more personalized
            experience.
          </p>
          <table>
            <thead>
              <tr>
                <th>Cookie</th>
                <th>Purpose</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>theme</td>
                <td>Remembers your display preferences</td>
                <td>1 year</td>
              </tr>
              <tr>
                <td>locale</td>
                <td>Remembers your language preference</td>
                <td>1 year</td>
              </tr>
            </tbody>
          </table>

          <h2>3. Your Choices</h2>

          <h3>3.1 Cookie Consent</h3>
          <p>
            When you first visit our website, you will see a cookie consent banner. You can
            choose to accept all cookies or customize your preferences. You can change your
            preferences at any time through the cookie settings link in our footer.
          </p>

          <h3>3.2 Browser Settings</h3>
          <p>
            Most web browsers allow you to control cookies through their settings. You can:
          </p>
          <ul>
            <li>Block all cookies</li>
            <li>Block third-party cookies</li>
            <li>Clear existing cookies</li>
            <li>Receive notifications when cookies are set</li>
          </ul>
          <p>
            Note that blocking certain cookies may affect website functionality.
          </p>

          <h3>3.3 Opt-Out Links</h3>
          <p>You can opt out of specific analytics services:</p>
          <ul>
            <li>
              <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300">
                Google Analytics Opt-out
              </a>
            </li>
          </ul>

          <h2>4. Third-Party Cookies</h2>
          <p>
            Some cookies are placed by third-party services that appear on our pages. We do not
            control these cookies. Please review the privacy policies of these third parties:
          </p>
          <ul>
            <li>Google Analytics: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300">Privacy Policy</a></li>
          </ul>

          <h2>5. Do Not Track</h2>
          <p>
            Some browsers have a &quot;Do Not Track&quot; feature. We currently do not respond to Do Not
            Track signals, but you can use the cookie settings described above to manage your
            preferences.
          </p>

          <h2>6. Updates to This Policy</h2>
          <p>
            We may update this Cookie Policy periodically. Changes will be posted on this page
            with an updated &quot;Last updated&quot; date.
          </p>

          <h2>7. Contact Us</h2>
          <p>
            For questions about this Cookie Policy, please contact us at:
          </p>
          <p>
            Email: privacy@adacheck.io
          </p>
          <p>
            For more information about how we handle your personal data, please see our{" "}
            <Link href="/privacy" className="text-emerald-400 hover:text-emerald-300">Privacy Policy</Link>.
          </p>
        </article>
      </Container>
    </div>
  );
}
