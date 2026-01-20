# ADACheck Launch Checklist

This document outlines everything needed to fully launch ADACheck as a paid SaaS product.

---

## Current Status

| Component | Status | Notes |
|-----------|--------|-------|
| Website | Live | https://adacheck.io |
| API | Live | https://api.adacheck.io |
| Scanning | Working | WCAG 2.1 AA via axe-core + Pa11y |
| AI Analysis | Working | Claude-powered recommendations |
| PDF Export | Working | Full compliance reports |
| State Compliance | Working | All 50 US states |
| Pricing Tiers | UI Only | Not enforced - everyone gets Pro features free |
| User Accounts | Not Built | No login/signup system |
| Payments | Not Built | Requires Stripe setup |
| Contact Form | Working | Opens user's email client |

---

## Phase 1: Business Formation (Do First)

You must complete these steps before accepting any payments.

### 1.1 Form an LLC

**Why:** Protects your personal assets from business lawsuits.

**Cost:** $50-500 depending on state

**How:**
1. Go to your state's Secretary of State website
2. Search for "form LLC" or "business registration"
3. File "Articles of Organization"
4. Choose a registered agent:
   - Can be yourself (your address becomes public record)
   - Or use a service like Northwest Registered Agent (~$125/year) for privacy
5. Pay the filing fee

**Popular states for tech companies:**
- Your home state (simplest)
- Delaware (business-friendly courts)
- Wyoming (low fees, privacy)

**Timeline:** 1-2 weeks for approval

---

### 1.2 Get an EIN (Employer Identification Number)

**Why:** Tax ID required for bank accounts and Stripe.

**Cost:** Free

**How:**
1. Go to: https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online
2. Apply online (takes ~10 minutes)
3. Receive your EIN instantly

**Requirements:** Must have LLC formed first (or apply as sole proprietor)

---

### 1.3 Open a Business Bank Account

**Why:** Keep business money separate from personal (required for LLC protection).

**Cost:** Free to $15/month

**Recommended banks for startups:**
- **Mercury** (https://mercury.com) - Free, tech-friendly, great UI
- **Relay** (https://relayfi.com) - Free, multiple accounts
- **Chase Business** - Traditional, physical branches

**What you need:**
- LLC formation documents (Articles of Organization)
- EIN confirmation letter
- Personal ID

---

### 1.4 Set Up Business Email

**Why:** Professional communication, receive contact form submissions.

**Options:**

| Service | Cost | Notes |
|---------|------|-------|
| Google Workspace | $6/user/mo | Best integration, familiar UI |
| Zoho Mail | Free (1 user) | Good free option |
| Fastmail | $5/user/mo | Privacy-focused |

**How (Google Workspace):**
1. Go to https://workspace.google.com
2. Sign up with adacheck.io domain
3. Verify domain ownership (add TXT record to DNS)
4. Update MX records to point to Google
5. Create support@adacheck.io, sales@adacheck.io, etc.

---

## Phase 2: Payment Setup

Complete Phase 1 first.

### 2.1 Set Up Stripe

**Why:** Industry-standard payment processing.

**Cost:** 2.9% + $0.30 per transaction (no monthly fee)

**How:**
1. Go to https://stripe.com
2. Create account with business email
3. Complete business verification:
   - LLC information
   - EIN
   - Bank account for payouts
   - Personal ID (for fraud prevention)
4. Get API keys (publishable + secret)

**Timeline:** 1-3 days for verification

### 2.2 Technical Integration (I Can Help With This)

Once Stripe is set up, the following can be implemented:

- [ ] User authentication (login/signup with email)
- [ ] Stripe Checkout integration
- [ ] Subscription management
- [ ] Usage tracking per user
- [ ] Tier enforcement (page limits, scan limits)
- [ ] User dashboard

Provide the Stripe API keys and I'll build the integration.

---

## Phase 3: Legal Protection (Recommended)

These can wait but should be done eventually.

### 3.1 Lawyer Review of Terms & Privacy Policy

**Why:** Current Terms of Service and Privacy Policy are templates. A lawyer should review them.

**Cost:** $500-2,000

**What to ask for:**
- Review of Terms of Service (apps/web/app/tos/page.tsx)
- Review of Privacy Policy (apps/web/app/privacy/page.tsx)
- Ensure GDPR compliance if serving EU users
- Liability limitations for scan accuracy

**Find a lawyer:**
- LegalZoom (budget option)
- Clerky (startup-focused)
- Local business attorney

### 3.2 Trademark "ADACheck"

**Why:** Prevent others from using your brand name.

**Cost:** $250-400 (USPTO filing fee)

**How:**
1. Search USPTO database first: https://tmsearch.uspto.gov
2. File application at: https://www.uspto.gov/trademarks
3. Choose Class 42 (Software as a Service)

**Timeline:** 6-12 months for approval

**Alternative:** Use a service like Trademarkia (~$199 + filing fees)

### 3.3 Business Insurance

**Why:** Errors & Omissions (E&O) insurance protects against claims that your scans missed issues.

**Cost:** $500-1,500/year

**Providers:**
- Hiscox (good for small tech companies)
- Hartford
- Next Insurance

---

## Phase 4: Growth Features (Future)

Technical features to add after payments are working:

| Feature | Priority | Notes |
|---------|----------|-------|
| Scheduled recurring scans | High | Weekly/monthly automatic scans |
| Email notifications | High | Scan complete, issues found |
| Team accounts | Medium | Multiple users per organization |
| API access | Medium | Let customers integrate programmatically |
| White-label reports | Medium | Remove ADACheck branding for agencies |
| Webhook integrations | Low | Notify external systems |
| Slack/Teams integration | Low | Send alerts to chat |

---

## Quick Reference: Costs Summary

### One-Time Costs
| Item | Cost |
|------|------|
| LLC Formation | $50-500 |
| EIN | Free |
| Trademark (optional) | $250-400 |

### Monthly Costs
| Item | Cost |
|------|------|
| Google Workspace | $6/user |
| Vercel (Frontend) | Free tier |
| Render (API) | ~$7-25/mo |
| Domain renewal | ~$12/year |

### Per-Transaction Costs
| Item | Cost |
|------|------|
| Stripe | 2.9% + $0.30 |

---

## Environment Variables Reference

When ready to add Stripe, these env vars will be needed:

```bash
# Add to Vercel (frontend)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Add to Render (API)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## Files Reference

| File | Purpose |
|------|---------|
| `apps/web/app/tos/page.tsx` | Terms of Service (needs lawyer review) |
| `apps/web/app/privacy/page.tsx` | Privacy Policy (needs lawyer review) |
| `apps/web/app/pricing/page.tsx` | Pricing page (update when payments ready) |
| `apps/web/app/contact/page.tsx` | Contact form |
| `apps/api/src/index.ts` | API entry point |
| `apps/api/src/stateRequirements.ts` | State compliance data |

---

## Support

For technical help implementing any of these features, continue the conversation with Claude Code or open an issue at the repository.

---

*Last updated: January 2025*
