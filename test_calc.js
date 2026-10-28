// Automated verification script for Finance Health Dashboard calculations and scoring

function calculateFinancialMetrics(profile) {
  const takeHomeIncome = Math.max(0, Number(profile.takeHomeIncome) || 0);
  const otherIncome = Math.max(0, Number(profile.otherIncome) || 0);
  const monthlyIncome = takeHomeIncome + otherIncome;

  const housing = Math.max(0, Number(profile.housing) || 0);
  const food = Math.max(0, Number(profile.food) || 0);
  const transportation = Math.max(0, Number(profile.transportation) || 0);
  const utilities = Math.max(0, Number(profile.utilities) || 0);
  const insurance = Math.max(0, Number(profile.insurance) || 0);
  const entertainment = Math.max(0, Number(profile.entertainment) || 0);
  const otherExpenses = Math.max(0, Number(profile.otherExpenses) || 0);

  const monthlyExpenses = housing + food + transportation + utilities + insurance + entertainment + otherExpenses;
  const monthlyDebtPayment = Math.max(0, Number(profile.emi) || 0);
  const totalDebt = Math.max(0, Number(profile.totalDebt) || 0);
  const currentSavings = Math.max(0, Number(profile.savings) || 0);
  const currentInvestments = Math.max(0, Number(profile.investments) || 0);

  const monthlyCashFlow = monthlyIncome - monthlyExpenses - monthlyDebtPayment;
  const savingsRate = monthlyIncome > 0 ? (monthlyCashFlow / monthlyIncome) * 100 : 0;
  const expenseRatio = monthlyIncome > 0 ? (monthlyExpenses / monthlyIncome) * 100 : 0;
  const dti = monthlyIncome > 0 ? (monthlyDebtPayment / monthlyIncome) * 100 : 0;
  const emergencyFundCoverage = monthlyExpenses > 0 ? currentSavings / monthlyExpenses : (currentSavings > 0 ? 12 : 0);
  const annualSavings = monthlyCashFlow * 12;
  const netWorth = currentSavings + currentInvestments - totalDebt;

  return {
    monthlyIncome,
    monthlyExpenses,
    monthlyDebtPayment,
    monthlyCashFlow,
    savingsRate,
    expenseRatio,
    dti,
    emergencyFundCoverage,
    annualSavings,
    netWorth,
    expensesBreakdown: {
      housing,
      food,
      transportation,
      utilities,
      insurance,
      entertainment,
      otherExpenses
    }
  };
}

function calculateHealthScore(metrics) {
  const { savingsRate, dti, emergencyFundCoverage, monthlyCashFlow, monthlyIncome } = metrics;

  // 1. Savings Rate (30 pts)
  // 0-10% = 5, 10-20% = 12, 20-30% = 20, 30%+ = 30. (<0% = 0)
  let savingsPoints = 0;
  if (savingsRate >= 30) {
    savingsPoints = 30;
  } else if (savingsRate >= 20) {
    savingsPoints = 20;
  } else if (savingsRate >= 10) {
    savingsPoints = 12;
  } else if (savingsRate >= 0) {
    savingsPoints = 5;
  } else {
    savingsPoints = 0;
  }

  // 2. Debt-to-Income (25 pts)
  // 0-10% = 25, 10-20% = 20, 20-30% = 12, 30-40% = 6, 40%+ = 0
  let dtiPoints = 0;
  if (dti <= 10) {
    dtiPoints = 25;
  } else if (dti <= 20) {
    dtiPoints = 20;
  } else if (dti <= 30) {
    dtiPoints = 12;
  } else if (dti <= 40) {
    dtiPoints = 6;
  } else {
    dtiPoints = 0;
  }

  // 3. Emergency Fund (25 pts)
  // 0-1 month = 5, 1-3 months = 12, 3-6 months = 20, 6+ months = 25
  let emergencyPoints = 0;
  if (emergencyFundCoverage >= 6) {
    emergencyPoints = 25;
  } else if (emergencyFundCoverage >= 3) {
    emergencyPoints = 20;
  } else if (emergencyFundCoverage >= 1) {
    emergencyPoints = 12;
  } else {
    emergencyPoints = 5;
  }

  // 4. Cash Flow (20 pts)
  // Negative = 0, 0-10% = 5, 10-20% = 10, 20-30% = 15, 30%+ = 20
  let cashFlowPoints = 0;
  if (monthlyCashFlow < 0) {
    cashFlowPoints = 0;
  } else {
    const cashFlowPercent = monthlyIncome > 0 ? (monthlyCashFlow / monthlyIncome) * 100 : 0;
    if (cashFlowPercent >= 30) {
      cashFlowPoints = 20;
    } else if (cashFlowPercent >= 20) {
      cashFlowPoints = 15;
    } else if (cashFlowPercent >= 10) {
      cashFlowPoints = 10;
    } else {
      cashFlowPoints = 5;
    }
  }

  const totalScore = savingsPoints + dtiPoints + emergencyPoints + cashFlowPoints;

  let rating = 'Critical';
  let ratingColor = '#EF4444'; // Red
  if (totalScore >= 80) {
    rating = 'Excellent';
    ratingColor = '#10B981'; // Green
  } else if (totalScore >= 65) {
    rating = 'Good';
    ratingColor = '#14B8A6'; // Teal
  } else if (totalScore >= 50) {
    rating = 'Fair';
    ratingColor = '#F59E0B'; // Amber
  } else if (totalScore >= 30) {
    rating = 'Needs Attention';
    ratingColor = '#F97316'; // Orange
  } else {
    rating = 'Critical';
    ratingColor = '#EF4444'; // Red
  }

  return {
    totalScore,
    rating,
    ratingColor,
    breakdown: {
      savingsPoints,
      dtiPoints,
      emergencyPoints,
      cashFlowPoints
    }
  };
}

// Verification with sample data
const sampleProfile = {
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
};

const metrics = calculateFinancialMetrics(sampleProfile);
const score = calculateHealthScore(metrics);

console.log('--- TEST RESULTS: SAMPLE PROFILE ---');
console.log('Monthly Income:', metrics.monthlyIncome, 'Expected: 85000');
console.log('Monthly Expenses:', metrics.monthlyExpenses, 'Expected: 45000');
console.log('Monthly Cash Flow:', metrics.monthlyCashFlow, 'Expected: 32000');
console.log('Savings Rate:', metrics.savingsRate.toFixed(2) + '%', 'Expected: ~37.65%');
console.log('Expense Ratio:', metrics.expenseRatio.toFixed(2) + '%', 'Expected: ~52.94%');
console.log('DTI:', metrics.dti.toFixed(2) + '%', 'Expected: ~9.41%');
console.log('Emergency Fund Coverage:', metrics.emergencyFundCoverage.toFixed(2), 'months', 'Expected: 4.0');
console.log('Annual Savings:', metrics.annualSavings, 'Expected: 384000');
console.log('Net Worth:', metrics.netWorth, 'Expected: 30000');
console.log('Health Score:', score.totalScore, '/ 100', 'Expected: 95');
console.log('Rating:', score.rating, 'Expected: Excellent');
console.log('Breakdown:', score.breakdown);

// Edge Cases Test
console.log('\n--- TEST RESULTS: EDGE CASES ---');
const zeroProfile = {
  takeHomeIncome: 0,
  otherIncome: 0,
  housing: 0,
  food: 0,
  transportation: 0,
  utilities: 0,
  insurance: 0,
  entertainment: 0,
  otherExpenses: 0,
  totalDebt: 0,
  emi: 0,
  savings: 0,
  investments: 0
};
const zeroMetrics = calculateFinancialMetrics(zeroProfile);
const zeroScore = calculateHealthScore(zeroMetrics);
console.log('Zero Income/Expenses metrics handled without NaN:', !isNaN(zeroMetrics.savingsRate) && !isNaN(zeroMetrics.dti));
console.log('Zero Score:', zeroScore.totalScore, '/ 100');

const negativeCashFlowProfile = {
  takeHomeIncome: 50000,
  otherIncome: 0,
  housing: 30000,
  food: 15000,
  transportation: 5000,
  utilities: 5000,
  insurance: 2000,
  entertainment: 3000,
  otherExpenses: 5000,
  totalDebt: 800000,
  emi: 25000,
  savings: 20000,
  investments: 0
};
const negMetrics = calculateFinancialMetrics(negativeCashFlowProfile);
const negScore = calculateHealthScore(negMetrics);
console.log('Negative Cash Flow:', negMetrics.monthlyCashFlow);
console.log('Neg Score:', negScore.totalScore, 'Rating:', negScore.rating);
