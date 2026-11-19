# Digital Education Fund

Education crowdfunding platform for supporting school fees, books, uniforms and learning resources for children from low-income families.

## Features
- Responsive public campaign listing
- Donor registration and login
- Student/guardian funding applications (admin approval required)
- Razorpay order creation and payment-signature verification
- Admin dashboard for campaign review and donation reports
- SQLite persistence, password hashing, JWT auth, rate limiting and Helmet headers

## Setup
Requires Node.js 20+.

```bash
cd funding
npm install
cp .env.example .env
```

Set a random JWT_SECRET (32+ characters), ADMIN_EMAIL and a strong ADMIN_PASSWORD in .env. Add Razorpay test keys to enable payments. Never commit .env.

```bash
npm start
```
Open http://localhost:3000.

## Before public launch
This is a starter implementation, not legal or compliance advice. Obtain Indian legal/CA review for fundraising structure, tax claims, FCRA/CSR/80G applicability, KYC and payment flows. Verify every beneficiary and expense, obtain guardian consent, protect minors' personal data, publish refund/privacy/grievance policies, use HTTPS and audited organisation-controlled bank accounts. Sample campaigns must be replaced with verified beneficiaries before accepting public donations.
