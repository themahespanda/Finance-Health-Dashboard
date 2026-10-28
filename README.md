# ACRU Finance — Premium Financial Analytics Dashboard

**Tagline:** *Understand your money. Improve your financial health.*

[![💰 Live Demo](https://img.shields.io/badge/💰_LIVE_DEMO-Finance_Health_Dashboard-047857?style=for-the-badge)](https://themahespanda.github.io/Finance-Health-Dashboard/)

ACRU Finance is a high-performance, responsive personal finance analytics dashboard built with a professional fintech design system. It brings together cash flow analytics, spending limits, multi-category cost analysis, transparent financial health scoring, goal tracking, rule-based budget optimization tips, and an interactive debit card interface.

---

## 🎨 Visual Design System & Architecture

Inspired by top-tier modern fintech products:
* **Outer Canvas:** Light grey backdrop (`#ECEFF1`) providing subtle contrast.
* **Dashboard Surface:** Crisp, rounded white container (`#FFFFFF`, `border-radius: 28px`, subtle multi-layer drop shadows).
* **Card Structure:** Clean white cards with gentle borders (`#E2E8F0`) and elevation.
* **Palette:**
  * **Forest Green (`#15803D`):** Primary brand anchor, income, healthy statuses.
  * **Lime Green (`#84CC16`):** Savings rate, positive cash flow, financial health gauge.
  * **Soft Orange (`#F97316`):** Living expenses, warnings, discretionary spending.
  * **Dark Grey / Slate (`#111827`, `#64748B`):** Sharp, high-contrast typography and neutral indicators.
* **Typography:** `Plus Jakarta Sans` for clean UI layout, paired with `JetBrains Mono` for precise financial figures.

---

## 🏛️ 3-Column Layout Breakdown

### Column 1: Left Navigation Sidebar
* **ACRU Logo & Brand Header:** Geometric badge with ACRU Finance brand mark.
* **Menu Navigation:**
  * **Dashboard:** Primary analytics overview.
  * **Accounts:** Multi-account breakdown.
  * **Transactions (Expandable):** Submenu with quick access to *History* and *Reports*.
  * **Cash Flow:** Cash inflow and outflow velocity.
  * **Budget:** Spending allocations and limit controls.
  * **Investments:** Portfolio compounding status.
  * **Learning Center & Support:** Educational knowledge base and guides.
* **Bottom Promotional Card:** "Optimize Your Wealth" with pro simulation cues.
* **Collapse Sidebar:** One-click toggle that collapses the sidebar into an icon-only dock.

### Column 2: Main Analytics Area
* **Top Header:** Global search bar, date-range dropdown (`This Month (Oct 2026)`, `Last Quarter`, `YTD`), and quick *Edit Profile* modal trigger.
* **Top Balance Overview:**
  * Total Estimated Net Worth with trend badge.
  * Three summary cards: *Total Monthly Income*, *Total Monthly Expenses*, and *Monthly Saved Balance*.
* **Income & Expenses Flow Chart (Chart.js):**
  * Clean bar chart comparing income (green), savings (lime), and expenses (orange) across recent months with formatted rupee tooltips.
* **Monthly Spending Limit:**
  * Live cap based on the 60% expense benchmark rule.
  * Gradient progress bar, remaining cushion indicator, and breakdowns for fixed needs, discretionary costs, and EMI.
* **Cost Analysis (Chart.js & Segmented Bar):**
  * Segmented horizontal stacked bar mapping out 7 expense categories: Housing, Food, Transportation, Utilities, Insurance, Entertainment, and Other.
  * Grid legend showing exact rupee allocations and percentages.
* **Financial Health Score:**
  * 240-degree semi-doughnut gauge displaying score out of 100 with dynamic grade tier (*Excellent*, *Good*, *Fair*, *Needs Attention*, *Critical*).
  * 4 detailed progress bars showing earned points across the 4 pillars.
* **Budget Optimization Card:**
  * Rule-based actionable tips computed from your actual cash flow, expense ratio, debt burden, and liquidity reserves.
* **Goal Tracker:**
  * Live progress bars for:
    * 6-Month Emergency Cushion.
    * Annual Savings Goal (₹5,00,000 target).
    * Long-term Investment Milestone (₹10,00,000 target).

### Column 3: Right Sidebar
* **My Card Panel:**
  * High-fidelity green ACRU Platinum debit card with metallic chip, contactless icon, masked card number, and cardholder info.
* **Quick Actions:** *Top Up*, *Send Money*, *Request*, and *Card History* (demo-interactive).
* **Quick Payment Contacts ("Send Again"):**
  * Avatars for Rahul, Ananya, Priya, Dev, and "+ Add New" recipient.
* **Recent Transactions:**
  * Filtered ledger with category icons, timestamps, rupee values, and credit/debit indicators.
* **Security & Disclaimer Banner:** Explicit notice highlighting that this is a simulated demo.

---

## 📐 Financial Formulas & 100-Point Scoring Model

### Core Calculations

| Metric | Formula | Benchmark Target |
| :--- | :--- | :--- |
| **Total Monthly Income** | $\text{Take-Home Income} + \text{Other Income}$ | Base Solvency |
| **Total Monthly Expenses** | $\sum(\text{Housing} + \text{Food} + \text{Transport} + \text{Utilities} + \text{Insurance} + \text{Entertainment} + \text{Other})$ | $\le 50\% - 60\%$ of Income |
| **Monthly Cash Flow** | $\text{Total Income} - \text{Total Expenses} - \text{Monthly EMI}$ | Surplus $> ₹0$ |
| **Savings Rate** | $(\text{Monthly Cash Flow} / \text{Total Income}) \times 100$ | $\ge 20\%$ |
| **Expense Ratio** | $(\text{Total Expenses} / \text{Total Income}) \times 100$ | $\le 60\%$ |
| **Debt-to-Income (DTI)** | $(\text{Monthly EMI} / \text{Total Income}) \times 100$ | Ceiling $< 36\%$ |
| **Emergency Fund Coverage** | $\text{Current Cash Savings} / \text{Total Monthly Expenses}$ | $3.0\text{ to }6.0\text{ months}$ |
| **Annual Cash Flow** | $\text{Monthly Cash Flow} \times 12$ | Compounding pace |
| **Net Worth** | $\text{Savings} + \text{Investments} - \text{Total Debt}$ | Positive & Growing |

---

### Transparent 100-Point Scoring Rubric

$$\text{Financial Health Score} = \text{Savings (30)} + \text{Debt (25)} + \text{Emergency (25)} + \text{Cash Flow (20)}$$

1. **Savings Rate (30 Points Max):**
   * $\ge 30\% \implies \mathbf{30\text{ pts}}$
   * $20\% - 29.9\% \implies \mathbf{20\text{ pts}}$
   * $10\% - 19.9\% \implies \mathbf{12\text{ pts}}$
   * $0\% - 9.9\% \implies \mathbf{5\text{ pts}}$
   * $< 0\% \implies \mathbf{0\text{ pts}}$

2. **Debt-to-Income Ratio (25 Points Max):**
   * $\le 10\% \implies \mathbf{25\text{ pts}}$
   * $10.1\% - 20\% \implies \mathbf{20\text{ pts}}$
   * $20.1\% - 30\% \implies \mathbf{12\text{ pts}}$
   * $30.1\% - 40\% \implies \mathbf{6\text{ pts}}$
   * $> 40\% \implies \mathbf{0\text{ pts}}$

3. **Emergency Fund Coverage (25 Points Max):**
   * $\ge 6.0\text{ months} \implies \mathbf{25\text{ pts}}$
   * $3.0 - 5.9\text{ months} \implies \mathbf{20\text{ pts}}$
   * $1.0 - 2.9\text{ months} \implies \mathbf{12\text{ pts}}$
   * $< 1.0\text{ month} \implies \mathbf{5\text{ pts}}$

4. **Monthly Cash Flow (20 Points Max):**
   * $\ge 30\%$ of Income $\implies \mathbf{20\text{ pts}}$
   * $20\% - 29.9\%$ of Income $\implies \mathbf{15\text{ pts}}$
   * $10\% - 19.9\%$ of Income $\implies \mathbf{10\text{ pts}}$
   * $0\% - 9.9\%$ of Income $\implies \mathbf{5\text{ pts}}$
   * Negative Deficit $\implies \mathbf{0\text{ pts}}$

**Score Grades:**
* **80–100:** *Excellent* (Lime Green)
* **65–79:** *Good* (Forest Green)
* **50–64:** *Fair* (Amber)
* **30–49:** *Needs Attention* (Orange)
* **0–29:** *Critical* (Red)

---

## 🚀 Running Locally

Because ACRU Finance is built with pure client-side standard technologies (HTML5, CSS3, ES6+ JavaScript, Chart.js via CDN), no compilation or package installation is needed.

### Method 1: Local HTTP Server (Python)
```bash
cd C:\Users\mahes\.gemini\antigravity\scratch\finance-health-dashboard
python -m http.server 8085
```
Open **`http://localhost:8085`** in your browser.

### Method 2: Direct Browser Launch
Double-click `index.html` to open it directly in Chrome, Edge, Safari, or Firefox.

---

## 🌐 Netlify Deployment (Zero-Config)

1. Sign in to your [Netlify](https://app.netlify.com) dashboard.
2. Go to **Sites** > **Add new site** > **Deploy manually**.
3. Drag and drop the `finance-health-dashboard` directory into the upload zone.
4. Your site will deploy in under 10 seconds with a production HTTPS URL.
