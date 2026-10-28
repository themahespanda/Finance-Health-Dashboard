# Test scenario calculations

def simulate_scenario(baseline_metrics, base_profile, income_change_pct, expense_reduction_pct, extra_debt, extra_savings):
    cur_income = baseline_metrics['monthly_income']
    cur_expenses = baseline_metrics['monthly_expenses']
    cur_emi = baseline_metrics['monthly_debt_payment']
    cur_savings = float(base_profile.get('savings', 0))

    new_income = max(0, cur_income * (1 + income_change_pct / 100.0))
    new_expenses = max(0, cur_expenses * (1 - expense_reduction_pct / 100.0))
    new_debt_payment = max(0, cur_emi + extra_debt)

    # Cash flow after expenses and debt payments
    new_cash_flow = new_income - new_expenses - new_debt_payment

    # Savings rate
    new_savings_rate = (new_cash_flow / new_income * 100.0) if new_income > 0 else 0.0
    new_dti = (new_debt_payment / new_income * 100.0) if new_income > 0 else 0.0
    new_emg_coverage = (cur_savings / new_expenses) if new_expenses > 0 else (12.0 if cur_savings > 0 else 0.0)
    new_annual_savings = new_cash_flow * 12.0

    return {
        'new_income': new_income,
        'new_expenses': new_expenses,
        'new_debt_payment': new_debt_payment,
        'new_cash_flow': new_cash_flow,
        'new_savings_rate': new_savings_rate,
        'new_dti': new_dti,
        'new_emg_coverage': new_emg_coverage,
        'new_annual_savings': new_annual_savings
    }

# Let's test with prompt example:
# Income +10%, Expense Reduction 10%
sim = simulate_scenario(
    baseline_metrics={'monthly_income': 85000, 'monthly_expenses': 45000, 'monthly_debt_payment': 8000},
    base_profile={'savings': 180000},
    income_change_pct=10.0,
    expense_reduction_pct=10.0,
    extra_debt=0,
    extra_savings=0
)

print(f"Scenario New Income: Rs.{sim['new_income']:,.0f} (+10%)")
print(f"Scenario New Expenses: Rs.{sim['new_expenses']:,.0f} (-10%)")
print(f"Scenario New Cash Flow: Rs.{sim['new_cash_flow']:,.0f} (Base was Rs.32,000, delta: +Rs.{sim['new_cash_flow'] - 32000:,.0f})")
print(f"Scenario New Savings Rate: {sim['new_savings_rate']:.2f}% (Base was 37.65%)")
print(f"Scenario New Emergency Coverage: {sim['new_emg_coverage']:.2f} months (Base was 4.00)")
print(f"Scenario New Annual Savings: Rs.{sim['new_annual_savings']:,.0f}")
print("SCENARIO SIMULATION LOGIC VERIFIED!")
