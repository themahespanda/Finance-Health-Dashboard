/**
 * ============================================================================
 * ACRU FINANCE — PRODUCTION JAVASCRIPT CONTROLLER & ANALYTICS ENGINE
 * ============================================================================
 * Handles calculations, transparent 100-point health score, Chart.js graphs,
 * cost analysis, spending limits, budget optimization tips, and demo interactions.
 */

'use strict';

// ============================================================================
// 1. DEFAULT SAMPLE DATA
// ============================================================================

const DEFAULT_FINANCE_PROFILE = Object.freeze({
  takeHomeIncome: 80000,
  otherIncome: 5000,
  housing: 20000,
  food: 8000,
  transportation: 4000,
  utilities: 3000,
  insurance: 2000,
  entertainment: 3000,
  otherExpenses: 5000,
  totalDebt: 500000,
  emi: 8000,
  savings: 180000,
  investments: 350000
});

// Category Colors for Cost Analysis & Doughnut Segments
const CATEGORY_COLORS = Object.freeze({
  housing: '#15803D',       // Forest Green
  food: '#84CC16',          // Lime Green
  transportation: '#F97316',// Soft Orange
  utilities: '#F59E0B',     // Amber
  insurance: '#6366F1',     // Indigo
  entertainment: '#EC4899', // Pink
  otherExpenses: '#64748B'  // Slate
});

// Realistic Sample Transactions for Right Sidebar
const SAMPLE_TRANSACTIONS = Object.freeze([
  {
    id: 'tx_1',
    name: 'Salary Credited',
    category: 'Income • Tech Corp Ltd',
    date: 'Oct 01, 2026',
    amount: 80000,
    type: 'credit',
    icon: 'fa-building-columns',
    colorClass: 'bg-green-light text-green',
    status: 'Completed'
  },
  {
    id: 'tx_2',
    name: 'Apartment Rent Payment',
    category: 'Housing • Auto-debit',
    date: 'Oct 02, 2026',
    amount: -20000,
    type: 'debit',
    icon: 'fa-house',
    colorClass: 'bg-orange-light text-orange',
    status: 'Completed'
  },
  {
    id: 'tx_3',
    name: 'Home Loan EMI',
    category: 'Debt Repayment • HDFC',
    date: 'Oct 05, 2026',
    amount: -8000,
    type: 'debit',
    icon: 'fa-landmark',
    colorClass: 'bg-slate-light text-slate',
    status: 'Completed'
  },
  {
    id: 'tx_4',
    name: 'Mutual Fund SIP Investment',
    category: 'Investments • Nifty 50 Index',
    date: 'Oct 10, 2026',
    amount: -15000,
    type: 'debit',
    icon: 'fa-arrow-trend-up',
    colorClass: 'bg-lime-light text-lime',
    status: 'Completed'
  },
  {
    id: 'tx_5',
    name: 'Freelance Design Consulting',
    category: 'Other Income • Wire Transfer',
    date: 'Oct 15, 2026',
    amount: 5000,
    type: 'credit',
    icon: 'fa-laptop-code',
    colorClass: 'bg-green-light text-green',
    status: 'Completed'
  },
  {
    id: 'tx_6',
    name: 'Organic Groceries & Essentials',
    category: 'Food • Nature Basket',
    date: 'Oct 18, 2026',
    amount: -3200,
    type: 'debit',
    icon: 'fa-basket-shopping',
    colorClass: 'bg-orange-light text-orange',
    status: 'Completed'
  }
]);

// ============================================================================
// 2. NUMBER & RUPEE FORMATTERS (INDIAN DIGIT GROUPING)
// ============================================================================

const Formatters = {
  /**
   * Formats numbers into Indian Rupee representation (e.g., ₹5,00,000 or -₹12,000)
   */
  inr(amount, includeSymbol = true) {
    if (isNaN(amount) || amount === null || amount === undefined) {
      return includeSymbol ? '₹0' : '0';
    }
    const isNegative = amount < 0;
    const absVal = Math.round(Math.abs(amount));
    const formatted = new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0
    }).format(absVal);

    if (includeSymbol) {
      return isNegative ? `-₹${formatted}` : `₹${formatted}`;
    }
    return isNegative ? `-${formatted}` : formatted;
  },

  percent(val, decimals = 1) {
    if (isNaN(val) || val === null || val === undefined) return '0.0%';
    return `${Number(val).toFixed(decimals)}%`;
  },

  months(val) {
    if (isNaN(val) || val === null || val === undefined) return '0.0 mo';
    if (!isFinite(val)) return '12.0+ mo';
    return `${Math.min(99, Number(val)).toFixed(1)} mo`;
  }
};

// ============================================================================
// 3. FINANCIAL CALCULATION ENGINE
// ============================================================================

const FinanceEngine = {
  parseProfile(raw) {
    const cleanNum = (val) => Math.max(0, Number(val) || 0);

    return {
      takeHomeIncome: cleanNum(raw.takeHomeIncome),
      otherIncome: cleanNum(raw.otherIncome),
      housing: cleanNum(raw.housing),
      food: cleanNum(raw.food),
      transportation: cleanNum(raw.transportation),
      utilities: cleanNum(raw.utilities),
      insurance: cleanNum(raw.insurance),
      entertainment: cleanNum(raw.entertainment),
      otherExpenses: cleanNum(raw.otherExpenses),
      totalDebt: cleanNum(raw.totalDebt),
      emi: cleanNum(raw.emi),
      savings: cleanNum(raw.savings),
      investments: cleanNum(raw.investments)
    };
  },

  calculate(rawProfile) {
    const p = this.parseProfile(rawProfile);

    // 1. Total Monthly Income
    const totalMonthlyIncome = p.takeHomeIncome + p.otherIncome;

    // 2. Total Monthly Expenses
    const totalMonthlyExpenses = p.housing + p.food + p.transportation +
                                 p.utilities + p.insurance + p.entertainment + p.otherExpenses;

    // 3. Monthly EMI / Debt Payment
    const monthlyDebtPayment = p.emi;

    // 4. Monthly Cash Flow (Monthly Saved Balance)
    const monthlyCashFlow = totalMonthlyIncome - totalMonthlyExpenses - monthlyDebtPayment;

    // 5. Savings Rate (%)
    const savingsRate = totalMonthlyIncome > 0 ? (monthlyCashFlow / totalMonthlyIncome) * 100 : 0;

    // 6. Expense Ratio (%)
    const expenseRatio = totalMonthlyIncome > 0 ? (totalMonthlyExpenses / totalMonthlyIncome) * 100 : 0;

    // 7. Debt-to-Income (DTI) Ratio (%)
    const dti = totalMonthlyIncome > 0 ? (monthlyDebtPayment / totalMonthlyIncome) * 100 : 0;

    // 8. Emergency Fund Coverage (in months)
    let emergencyCoverage = 0;
    if (totalMonthlyExpenses > 0) {
      emergencyCoverage = p.savings / totalMonthlyExpenses;
    } else if (p.savings > 0) {
      emergencyCoverage = 12.0;
    }

    // 9. Annual Cash Flow / Savings Pace
    const annualCashFlow = monthlyCashFlow * 12;

    // 10. Net Worth
    const netWorth = p.savings + p.investments - p.totalDebt;

    // Fixed needs vs Discretionary
    const fixedNeeds = p.housing + p.food + p.transportation + p.utilities + p.insurance;
    const discretionary = p.entertainment + p.otherExpenses;

    // Spending limit benchmark (60% of income)
    const spendingLimit = totalMonthlyIncome * 0.60;
    const spendingLimitPct = spendingLimit > 0 ? (totalMonthlyExpenses / spendingLimit) * 100 : 0;

    return {
      profile: p,
      totalMonthlyIncome,
      totalMonthlyExpenses,
      monthlyDebtPayment,
      monthlyCashFlow,
      savingsRate,
      expenseRatio,
      dti,
      emergencyCoverage,
      annualCashFlow,
      netWorth,
      fixedNeeds,
      discretionary,
      spendingLimit,
      spendingLimitPct,
      categories: {
        housing: p.housing,
        food: p.food,
        transportation: p.transportation,
        utilities: p.utilities,
        insurance: p.insurance,
        entertainment: p.entertainment,
        otherExpenses: p.otherExpenses
      }
    };
  },

  /**
   * Transparent 100-point Health Score Model
   */
  calculateHealthScore(metrics) {
    const { savingsRate, dti, emergencyCoverage, monthlyCashFlow, totalMonthlyIncome } = metrics;

    // 1. Savings rate: 30 points
    // Below 0%: 0 pts | 0-10%: 5 pts | 10-20%: 12 pts | 20-30%: 20 pts | 30%+: 30 pts
    let savingsPts = 0;
    if (savingsRate >= 30) {
      savingsPts = 30;
    } else if (savingsRate >= 20) {
      savingsPts = 20;
    } else if (savingsRate >= 10) {
      savingsPts = 12;
    } else if (savingsRate >= 0) {
      savingsPts = 5;
    } else {
      savingsPts = 0;
    }

    // 2. Debt-to-income: 25 points
    // 10% or less: 25 pts | 10-20%: 20 pts | 20-30%: 12 pts | 30-40%: 6 pts | 40%+: 0 pts
    let dtiPts = 0;
    if (dti <= 10) {
      dtiPts = 25;
    } else if (dti <= 20) {
      dtiPts = 20;
    } else if (dti <= 30) {
      dtiPts = 12;
    } else if (dti <= 40) {
      dtiPts = 6;
    } else {
      dtiPts = 0;
    }

    // 3. Emergency fund: 25 points
    // Below 1 mo: 5 pts | 1-3 mo: 12 pts | 3-6 mo: 20 pts | 6 mo+: 25 pts
    let emgPts = 0;
    if (emergencyCoverage >= 6) {
      emgPts = 25;
    } else if (emergencyCoverage >= 3) {
      emgPts = 20;
    } else if (emergencyCoverage >= 1) {
      emgPts = 12;
    } else {
      emgPts = 5;
    }

    // 4. Cash flow: 20 points
    // Negative: 0 pts | 0-10%: 5 pts | 10-20%: 10 pts | 20-30%: 15 pts | 30%+: 20 pts
    let cfPts = 0;
    if (monthlyCashFlow < 0) {
      cfPts = 0;
    } else {
      const cfPct = totalMonthlyIncome > 0 ? (monthlyCashFlow / totalMonthlyIncome) * 100 : 0;
      if (cfPct >= 30) {
        cfPts = 20;
      } else if (cfPct >= 20) {
        cfPts = 15;
      } else if (cfPct >= 10) {
        cfPts = 10;
      } else {
        cfPts = 5;
      }
    }

    const totalScore = Math.min(100, Math.max(0, savingsPts + dtiPts + emgPts + cfPts));

    let tier = 'Critical';
    let tierColor = '#EF4444';
    let tierClass = 'status-warning';

    if (totalScore >= 80) {
      tier = 'Excellent';
      tierColor = '#84CC16';
      tierClass = 'status-excellent';
    } else if (totalScore >= 65) {
      tier = 'Good';
      tierColor = '#22C55E';
      tierClass = 'status-healthy';
    } else if (totalScore >= 50) {
      tier = 'Fair';
      tierColor = '#F59E0B';
      tierClass = 'status-warning';
    } else if (totalScore >= 30) {
      tier = 'Needs Attention';
      tierColor = '#F97316';
      tierClass = 'status-warning';
    }

    return {
      totalScore,
      tier,
      tierColor,
      tierClass,
      points: {
        savingsPts,
        dtiPts,
        emgPts,
        cfPts
      }
    };
  }
};

// ============================================================================
// 4. BUDGET OPTIMIZATION & RULE-BASED INSIGHTS ENGINE
// ============================================================================

const InsightsEngine = {
  generateTips(metrics) {
    const tips = [];
    const { savingsRate, dti, emergencyCoverage, monthlyCashFlow, expenseRatio, profile } = metrics;

    // 1. Cash Flow / Deficit Tip
    if (monthlyCashFlow < 0) {
      tips.push({
        type: 'warning',
        icon: 'fa-triangle-exclamation',
        title: 'Monthly Deficit Alert',
        text: `Your living costs & EMI exceed total income by ${Formatters.inr(Math.abs(monthlyCashFlow))}. Restructuring discretionary expenses or high-interest loans should be your top priority.`
      });
    } else if (savingsRate >= 30) {
      tips.push({
        type: 'healthy',
        icon: 'fa-circle-check',
        title: 'High Savings Velocity',
        text: `You are saving ${Formatters.percent(savingsRate)} of your income (${Formatters.inr(monthlyCashFlow)}/mo). Automating these funds into diversified SIPs will compound long-term wealth rapidly.`
      });
    }

    // 2. Spending Limit / Expense Ratio
    if (expenseRatio > 70) {
      tips.push({
        type: 'warning',
        icon: 'fa-chart-pie',
        title: 'Expenses Exceed 70% Ceiling',
        text: `Living expenses consume ${Formatters.percent(expenseRatio)} of income. Review your discretionary leisure (${Formatters.inr(profile.entertainment)}) and other overheads to free up cash.`
      });
    } else {
      tips.push({
        type: 'info',
        icon: 'fa-scale-balanced',
        title: 'Lean Living Expense Ratio',
        text: `Your core expenses absorb ${Formatters.percent(expenseRatio)} of earnings, well within the recommended 50–60% standard personal finance guideline.`
      });
    }

    // 3. Debt-to-Income Pressure
    if (dti > 35) {
      tips.push({
        type: 'warning',
        icon: 'fa-landmark',
        title: 'High Debt Repayment Pressure',
        text: `Monthly EMI obligations consume ${Formatters.percent(dti)} of earnings. Consider the debt avalanche method (paying highest APR first) to reduce long-term interest burden.`
      });
    } else if (dti <= 15) {
      tips.push({
        type: 'healthy',
        icon: 'fa-shield-halved',
        title: 'Low Debt Encumbrance',
        text: `At only ${Formatters.percent(dti)} of monthly earnings, debt payments are low, giving you maximum flexibility to invest and withstand sudden shocks.`
      });
    }

    // 4. Emergency Fund Cushion
    if (emergencyCoverage < 3) {
      tips.push({
        type: 'warning',
        icon: 'fa-piggy-bank',
        title: 'Build Emergency Buffer',
        text: `Your liquid reserves cover ${Formatters.months(emergencyCoverage)} of expenses. Work towards gradually building a 3 to 6-month safety net in high-yield liquid funds.`
      });
    } else {
      tips.push({
        type: 'healthy',
        icon: 'fa-vault',
        title: 'Solid Liquidity Reserve',
        text: `You have ${Formatters.months(emergencyCoverage)} of living costs safely banked, protecting you against unexpected life events without needing debt.`
      });
    }

    return tips.slice(0, 4);
  }
};

// ============================================================================
// 5. CHART.JS CONTROLLERS
// ============================================================================

const ChartControllers = {
  chartIncomeExpenses: null,
  chartHealthGauge: null,

  renderIncomeExpensesChart(metrics) {
    const canvas = document.getElementById('chart-income-expenses');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const income = metrics.totalMonthlyIncome;
    const expenses = metrics.totalMonthlyExpenses;
    const savings = Math.max(0, metrics.monthlyCashFlow);

    // Multi-month realistic progression
    const labels = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct (Current)'];
    const incomeData = [income * 0.94, income * 0.96, income * 0.98, income * 0.99, income];
    const savingsData = [savings * 0.88, savings * 0.92, savings * 0.95, savings * 0.96, savings];
    const expenseData = [expenses * 0.98, expenses * 0.95, expenses * 0.99, expenses * 1.02, expenses];

    if (this.chartIncomeExpenses) {
      this.chartIncomeExpenses.destroy();
    }

    this.chartIncomeExpenses = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Income',
            data: incomeData,
            backgroundColor: '#15803D', // Forest Green
            borderRadius: 6,
            barPercentage: 0.7,
            categoryPercentage: 0.75
          },
          {
            label: 'Savings',
            data: savingsData,
            backgroundColor: '#84CC16', // Lime Green
            borderRadius: 6,
            barPercentage: 0.7,
            categoryPercentage: 0.75
          },
          {
            label: 'Expenses',
            data: expenseData,
            backgroundColor: '#F97316', // Soft Orange
            borderRadius: 6,
            barPercentage: 0.7,
            categoryPercentage: 0.75
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#111827',
            titleFont: { family: "'Plus Jakarta Sans', sans-serif", size: 12, weight: '700' },
            bodyFont: { family: "'JetBrains Mono', monospace", size: 11 },
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label(context) {
                return ` ${context.dataset.label}: ${Formatters.inr(context.raw)}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: '#64748B',
              font: { family: "'Plus Jakarta Sans', sans-serif", size: 11, weight: '600' }
            }
          },
          y: {
            grid: { color: 'rgba(226, 232, 240, 0.7)', drawBorder: false },
            ticks: {
              color: '#94A3B8',
              font: { family: "'JetBrains Mono', monospace", size: 10 },
              callback: (val) => `₹${val / 1000}k`
            }
          }
        }
      }
    });
  },

  renderHealthGaugeChart(scoreObj) {
    const canvas = document.getElementById('chart-health-gauge');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const score = scoreObj.totalScore;
    const remaining = Math.max(0, 100 - score);

    if (this.chartHealthGauge) {
      this.chartHealthGauge.destroy();
    }

    this.chartHealthGauge = new Chart(ctx, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [score, remaining],
          backgroundColor: [
            scoreObj.tierColor,
            '#F1F5F9'
          ],
          borderWidth: 0,
          circumference: 240,
          rotation: 240
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '78%',
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        }
      }
    });
  }
};

// ============================================================================
// 6. DOM RENDERERS
// ============================================================================

const AppState = {
  profile: { ...DEFAULT_FINANCE_PROFILE },
  metrics: null,
  score: null
};

function renderDashboard(metrics, score) {
  AppState.metrics = metrics;
  AppState.score = score;

  // 1. Top Overview Net Worth & Summary Box
  document.getElementById('disp-net-worth').textContent = Formatters.inr(metrics.netWorth);
  document.getElementById('disp-monthly-income').textContent = Formatters.inr(metrics.totalMonthlyIncome);
  document.getElementById('disp-income-sub').textContent = `Take-home: ${Formatters.inr(metrics.profile.takeHomeIncome)} | Other: ${Formatters.inr(metrics.profile.otherIncome)}`;

  document.getElementById('disp-monthly-expenses').textContent = Formatters.inr(metrics.totalMonthlyExpenses);
  document.getElementById('disp-expense-ratio-sub').textContent = `${Formatters.percent(metrics.expenseRatio)} of total income`;

  document.getElementById('disp-monthly-saved').textContent = Formatters.inr(metrics.monthlyCashFlow);
  document.getElementById('disp-savings-rate-sub').textContent = `Savings Rate: ${Formatters.percent(metrics.savingsRate)} (${metrics.savingsRate >= 20 ? 'Healthy' : 'Needs Target'})`;

  // 2. Spending Limit Progress
  document.getElementById('disp-spent-current').textContent = Formatters.inr(metrics.totalMonthlyExpenses);
  document.getElementById('disp-spent-limit').textContent = Formatters.inr(metrics.spendingLimit);
  
  const limitFillPct = Math.min(100, metrics.spendingLimitPct);
  const progressBar = document.getElementById('progress-bar-spending');
  progressBar.style.width = `${limitFillPct}%`;
  document.getElementById('disp-limit-pct').textContent = `${metrics.spendingLimitPct.toFixed(1)}%`;

  const remaining = metrics.spendingLimit - metrics.totalMonthlyExpenses;
  const remainingEl = document.getElementById('disp-remaining-budget');
  const spendingBadge = document.getElementById('badge-spending-status');

  if (remaining >= 0) {
    remainingEl.innerHTML = `<i class="fa-solid fa-circle-check text-green"></i> ${Formatters.inr(remaining)} safe cushion remaining`;
    spendingBadge.textContent = 'On Track';
    spendingBadge.className = 'badge-status-pill status-healthy';
  } else {
    remainingEl.innerHTML = `<i class="fa-solid fa-triangle-exclamation text-orange"></i> ${Formatters.inr(Math.abs(remaining))} over 60% guideline`;
    spendingBadge.textContent = 'Over Limit';
    spendingBadge.className = 'badge-status-pill status-warning';
  }

  document.getElementById('disp-fixed-needs').textContent = Formatters.inr(metrics.fixedNeeds);
  document.getElementById('disp-discretionary').textContent = Formatters.inr(metrics.discretionary);
  document.getElementById('disp-emi-val').textContent = Formatters.inr(metrics.monthlyDebtPayment);

  // 3. Cost Analysis Segmented Bar & Legend
  renderCostAnalysis(metrics);

  // 4. Financial Health Score
  document.getElementById('disp-score-num').textContent = score.totalScore;
  document.getElementById('disp-score-tier').textContent = score.tier.toUpperCase();
  document.getElementById('disp-score-tier').style.backgroundColor = `${score.tierColor}25`;
  document.getElementById('disp-score-tier').style.color = score.tierColor;
  
  const gradeBadge = document.getElementById('badge-health-grade');
  gradeBadge.textContent = score.tier;
  gradeBadge.className = `badge-status-pill ${score.tierClass}`;

  // Breakdown bars
  const p = score.points;
  document.getElementById('score-pts-savings').textContent = `${p.savingsPts} / 30`;
  document.getElementById('bar-pts-savings').style.width = `${(p.savingsPts / 30) * 100}%`;

  document.getElementById('score-pts-debt').textContent = `${p.dtiPts} / 25`;
  document.getElementById('bar-pts-debt').style.width = `${(p.dtiPts / 25) * 100}%`;

  document.getElementById('score-pts-emg').textContent = `${p.emgPts} / 25`;
  document.getElementById('bar-pts-emg').style.width = `${(p.emgPts / 25) * 100}%`;

  document.getElementById('score-pts-cf').textContent = `${p.cfPts} / 20`;
  document.getElementById('bar-pts-cf').style.width = `${(p.cfPts / 20) * 100}%`;

  // 5. Goal Tracker Cards
  renderGoalTracker(metrics);

  // 6. Budget Tips
  renderBudgetTips(metrics);

  // 7. Charts
  ChartControllers.renderIncomeExpensesChart(metrics);
  ChartControllers.renderHealthGaugeChart(score);
}

function renderCostAnalysis(metrics) {
  const barContainer = document.getElementById('cost-segmented-bar');
  const legendContainer = document.getElementById('cost-legend-container');
  const total = metrics.totalMonthlyExpenses;

  document.getElementById('disp-cost-total').textContent = `${Formatters.inr(total)} / mo`;

  barContainer.innerHTML = '';
  legendContainer.innerHTML = '';

  const catNames = {
    housing: 'Housing & Rent',
    food: 'Food & Groceries',
    transportation: 'Transportation',
    utilities: 'Utilities & Bills',
    insurance: 'Insurance',
    entertainment: 'Entertainment',
    otherExpenses: 'Other Living'
  };

  Object.keys(metrics.categories).forEach((key) => {
    const val = metrics.categories[key];
    const pct = total > 0 ? (val / total) * 100 : 0;
    const color = CATEGORY_COLORS[key] || '#94A3B8';

    // Segment in bar
    if (pct > 0) {
      const seg = document.createElement('div');
      seg.className = 'segment-item';
      seg.style.width = `${pct}%`;
      seg.style.backgroundColor = color;
      seg.title = `${catNames[key]}: ${Formatters.inr(val)} (${pct.toFixed(1)}%)`;
      barContainer.appendChild(seg);
    }

    // Legend item
    const item = document.createElement('div');
    item.className = 'cost-legend-item';
    item.innerHTML = `
      <div class="cost-legend-left">
        <span class="cost-legend-dot" style="background-color: ${color}"></span>
        <span class="cost-legend-name">${catNames[key]}</span>
      </div>
      <span class="cost-legend-val">${Formatters.inr(val)} <span style="font-size:0.7rem; color:#94A3B8; font-weight:normal">(${pct.toFixed(0)}%)</span></span>
    `;
    legendContainer.appendChild(item);
  });
}

function renderGoalTracker(metrics) {
  // Goal 1: Emergency 6 Months
  const targetEmg = metrics.totalMonthlyExpenses * 6;
  const curEmg = metrics.profile.savings;
  const emgPct = targetEmg > 0 ? Math.min(100, (curEmg / targetEmg) * 100) : 100;
  
  document.getElementById('goal-emg-desc').textContent = `Covering ${metrics.emergencyCoverage.toFixed(1)} of 6.0 months (${Formatters.inr(curEmg)} / ${Formatters.inr(targetEmg)})`;
  document.getElementById('goal-emg-pct').textContent = `${emgPct.toFixed(1)}%`;
  document.getElementById('goal-emg-fill').style.width = `${emgPct}%`;

  // Goal 2: Annual Savings Target ₹5,00,000
  const targetAnnual = 500000;
  const annualSavings = Math.max(0, metrics.annualCashFlow);
  const annualPct = Math.min(100, (annualSavings / targetAnnual) * 100);

  document.getElementById('goal-annual-desc').textContent = `Pacing at ${Formatters.inr(annualSavings)} / year (${Formatters.inr(metrics.monthlyCashFlow)} / mo)`;
  document.getElementById('goal-annual-pct').textContent = `${annualPct.toFixed(1)}%`;
  document.getElementById('goal-annual-fill').style.width = `${annualPct}%`;

  // Goal 3: Investment Milestone Target ₹10,00,000
  const targetInvest = 1000000;
  const curInvest = metrics.profile.investments;
  const investPct = Math.min(100, (curInvest / targetInvest) * 100);

  document.getElementById('goal-invest-desc').textContent = `Current invested assets: ${Formatters.inr(curInvest)} of ${Formatters.inr(targetInvest)}`;
  document.getElementById('goal-invest-pct').textContent = `${investPct.toFixed(1)}%`;
  document.getElementById('goal-invest-fill').style.width = `${investPct}%`;
}

function renderBudgetTips(metrics) {
  const container = document.getElementById('budget-tips-list');
  container.innerHTML = '';
  const tips = InsightsEngine.generateTips(metrics);

  tips.forEach((tip) => {
    const card = document.createElement('div');
    card.className = `tip-card-item ${tip.type}`;
    card.innerHTML = `
      <div class="tip-icon"><i class="fa-solid ${tip.icon}"></i></div>
      <div class="tip-content">
        <strong>${tip.title}</strong>
        <p>${tip.text}</p>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderTransactionsList() {
  const list = document.getElementById('transaction-list-container');
  list.innerHTML = '';

  SAMPLE_TRANSACTIONS.forEach((tx) => {
    const item = document.createElement('div');
    item.className = 'trans-item';
    const isCredit = tx.type === 'credit';
    const sign = isCredit ? '+' : '';

    item.innerHTML = `
      <div class="trans-left">
        <div class="trans-icon-circle ${tx.colorClass}">
          <i class="fa-solid ${tx.icon}"></i>
        </div>
        <div>
          <span class="trans-title">${tx.name}</span>
          <span class="trans-cat-date">${tx.category} • ${tx.date}</span>
        </div>
      </div>
      <div class="trans-right">
        <span class="trans-amount ${isCredit ? 'credit' : 'debit'}">${sign}${Formatters.inr(tx.amount)}</span>
        <span class="trans-status-tag ${tx.status.toLowerCase()}">${tx.status}</span>
      </div>
    `;
    list.appendChild(item);
  });
}

// ============================================================================
// 7. TOAST NOTIFICATIONS
// ============================================================================

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast-item toast-${type}`;
  toast.innerHTML = `
    <i class="fa-solid ${type === 'success' ? 'fa-circle-check text-lime' : 'fa-circle-info text-sky'}"></i>
    <span>${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 250);
  }, 3200);
}

// ============================================================================
// 8. PROFILE MODAL CONTROLLER
// ============================================================================

const ProfileModal = {
  backdrop: null,

  init() {
    this.backdrop = document.getElementById('profile-modal-backdrop');

    // Open triggers
    document.getElementById('btn-open-profile-modal').addEventListener('click', () => this.open());
    document.getElementById('btn-quick-adjust-profile').addEventListener('click', () => this.open());

    // Close triggers
    document.getElementById('btn-close-profile-modal').addEventListener('click', () => this.close());
    document.getElementById('btn-modal-cancel').addEventListener('click', () => this.close());
    this.backdrop.addEventListener('click', (e) => {
      if (e.target === this.backdrop) this.close();
    });

    // Form submission
    const form = document.getElementById('financial-profile-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveAndRecalculate();
    });

    // Reset Defaults
    document.getElementById('btn-modal-reset-defaults').addEventListener('click', () => {
      this.populate(DEFAULT_FINANCE_PROFILE);
      showToast('Reset to standard benchmark profile');
    });

    // Clear All
    document.getElementById('btn-modal-clear-all').addEventListener('click', () => {
      const zeroes = {};
      Object.keys(DEFAULT_FINANCE_PROFILE).forEach(k => zeroes[k] = 0);
      this.populate(zeroes);
      showToast('Fields cleared to zero', 'info');
    });

    // Prevent negative numbers
    form.querySelectorAll('input[type="number"]').forEach((inp) => {
      inp.addEventListener('input', () => {
        if (inp.value < 0) inp.value = 0;
      });
    });
  },

  open() {
    this.populate(AppState.profile);
    this.backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  },

  close() {
    this.backdrop.classList.remove('open');
    document.body.style.overflow = '';
  },

  populate(p) {
    document.getElementById('input-take-home').value = p.takeHomeIncome;
    document.getElementById('input-other-income').value = p.otherIncome;
    document.getElementById('input-housing').value = p.housing;
    document.getElementById('input-food').value = p.food;
    document.getElementById('input-transport').value = p.transportation;
    document.getElementById('input-utilities').value = p.utilities;
    document.getElementById('input-insurance').value = p.insurance;
    document.getElementById('input-entertainment').value = p.entertainment;
    document.getElementById('input-other-exp').value = p.otherExpenses;
    document.getElementById('input-total-debt').value = p.totalDebt;
    document.getElementById('input-emi').value = p.emi;
    document.getElementById('input-savings').value = p.savings;
    document.getElementById('input-investments').value = p.investments;
  },

  read() {
    const val = (id) => Math.max(0, Number(document.getElementById(id).value) || 0);

    return {
      takeHomeIncome: val('input-take-home'),
      otherIncome: val('input-other-income'),
      housing: val('input-housing'),
      food: val('input-food'),
      transportation: val('input-transport'),
      utilities: val('input-utilities'),
      insurance: val('input-insurance'),
      entertainment: val('input-entertainment'),
      otherExpenses: val('input-other-exp'),
      totalDebt: val('input-total-debt'),
      emi: val('input-emi'),
      savings: val('input-savings'),
      investments: val('input-investments')
    };
  },

  saveAndRecalculate() {
    const newProfile = this.read();
    AppState.profile = newProfile;
    const metrics = FinanceEngine.calculate(newProfile);
    const score = FinanceEngine.calculateHealthScore(metrics);
    renderDashboard(metrics, score);
    this.close();
    showToast('Financial Health recalculated successfully!');
  }
};

// ============================================================================
// 9. INTERACTIONS & DEMO ACTION BINDINGS
// ============================================================================

function setupInteractions() {
  // Mobile Sidebar Toggle
  const sidebar = document.getElementById('acru-sidebar');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const closeSidebarBtn = document.getElementById('sidebar-close-btn');

  if (mobileMenuBtn && sidebar) {
    mobileMenuBtn.addEventListener('click', () => sidebar.classList.add('mobile-open'));
  }
  if (closeSidebarBtn && sidebar) {
    closeSidebarBtn.addEventListener('click', () => sidebar.classList.remove('mobile-open'));
  }

  // Collapse Sidebar Desktop
  const btnCollapse = document.getElementById('btn-collapse-sidebar');
  const container = document.querySelector('.acru-dashboard-container');
  if (btnCollapse && container) {
    btnCollapse.addEventListener('click', () => {
      container.classList.toggle('sidebar-collapsed');
    });
  }

  // Expandable Transactions Submenu
  const transItem = document.getElementById('nav-item-transactions');
  const btnTransSub = document.getElementById('btn-toggle-trans-submenu');
  if (btnTransSub && transItem) {
    btnTransSub.addEventListener('click', (e) => {
      e.preventDefault();
      transItem.classList.toggle('expanded');
    });
  }

  // Navigation Links Active States & Smooth Scrolls
  document.querySelectorAll('.nav-link:not(.submenu-trigger), .submenu-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
      link.closest('.nav-item')?.classList.add('active');

      const target = link.dataset.nav;
      if (target === 'dashboard') {
        document.querySelector('.main-body-scroll').scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        showToast(`Navigated to ${link.innerText.trim()} overview`, 'info');
      }

      if (window.innerWidth <= 1100 && sidebar) {
        sidebar.classList.remove('mobile-open');
      }
    });
  });

  // Date Range Dropdown
  const btnDateRange = document.getElementById('btn-date-range');
  const dateMenu = document.getElementById('date-dropdown-menu');
  const selectedDateTxt = document.getElementById('selected-date-range');

  if (btnDateRange && dateMenu) {
    btnDateRange.addEventListener('click', (e) => {
      e.stopPropagation();
      dateMenu.classList.toggle('show');
    });

    document.querySelectorAll('.date-option').forEach((opt) => {
      opt.addEventListener('click', () => {
        document.querySelectorAll('.date-option').forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        selectedDateTxt.textContent = opt.innerText;
        dateMenu.classList.remove('show');
        showToast(`Analytics updated for: ${opt.innerText}`, 'info');
      });
    });

    document.addEventListener('click', () => dateMenu.classList.remove('show'));
  }

  // Quick Action Buttons on Right Sidebar Card
  document.querySelectorAll('.quick-action-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      showToast(`${action} modal opened in demo mode`, 'info');
    });
  });

  // Contact Avatar Items (Send Again)
  document.querySelectorAll('.contact-avatar-item').forEach((avatar) => {
    avatar.addEventListener('click', () => {
      const name = avatar.dataset.name;
      showToast(`Quick Pay opened for ${name} (Demo)`, 'info');
    });
  });

  // Add Card & Add Contact Demos
  document.getElementById('btn-add-card-demo')?.addEventListener('click', () => {
    showToast('Add New Virtual Card requested (Demo sandbox)', 'info');
  });

  document.getElementById('btn-add-contact-demo')?.addEventListener('click', () => {
    showToast('Add New Payee dialog opened', 'info');
  });

  document.getElementById('btn-contacts-see-all')?.addEventListener('click', () => {
    showToast('All Payees Directory opened', 'info');
  });

  document.getElementById('btn-edit-goals')?.addEventListener('click', () => {
    ProfileModal.open();
    showToast('Update your savings & assets to change goal targets');
  });

  document.getElementById('btn-promo-action')?.addEventListener('click', () => {
    showToast('ACRU Pro feature demo: Scenario simulation unlocked', 'info');
  });

  document.getElementById('btn-header-notifs')?.addEventListener('click', () => {
    showToast('You have 2 new security & budget updates', 'info');
  });
}

// ============================================================================
// 10. APP INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initial calculation with prompt standard values
  const initMetrics = FinanceEngine.calculate(DEFAULT_FINANCE_PROFILE);
  const initScore = FinanceEngine.calculateHealthScore(initMetrics);

  // 2. Render all analytics, charts & sample transactions
  renderDashboard(initMetrics, initScore);
  renderTransactionsList();

  // 3. Initialize modal controller
  ProfileModal.init();

  // 4. Setup interaction event bindings
  setupInteractions();
});
