# Python verification of calculation engine and edge cases

def calculate_financial_metrics(profile):
    take_home = max(0, float(profile.get('takeHomeIncome', 0)))
    other_inc = max(0, float(profile.get('otherIncome', 0)))
    monthly_income = take_home + other_inc

    housing = max(0, float(profile.get('housing', 0)))
    food = max(0, float(profile.get('food', 0)))
    transport = max(0, float(profile.get('transportation', 0)))
    utilities = max(0, float(profile.get('utilities', 0)))
    insurance = max(0, float(profile.get('insurance', 0)))
    entertainment = max(0, float(profile.get('entertainment', 0)))
    other_exp = max(0, float(profile.get('otherExpenses', 0)))

    monthly_expenses = housing + food + transport + utilities + insurance + entertainment + other_exp
    emi = max(0, float(profile.get('emi', 0)))
    total_debt = max(0, float(profile.get('totalDebt', 0)))
    savings = max(0, float(profile.get('savings', 0)))
    investments = max(0, float(profile.get('investments', 0)))

    monthly_cash_flow = monthly_income - monthly_expenses - emi
    savings_rate = (monthly_cash_flow / monthly_income * 100) if monthly_income > 0 else 0.0
    expense_ratio = (monthly_expenses / monthly_income * 100) if monthly_income > 0 else 0.0
    dti = (emi / monthly_income * 100) if monthly_income > 0 else 0.0
    
    if monthly_expenses > 0:
        emergency_coverage = savings / monthly_expenses
    else:
        emergency_coverage = 12.0 if savings > 0 else 0.0

    annual_savings = monthly_cash_flow * 12
    net_worth = savings + investments - total_debt

    return {
        'monthly_income': monthly_income,
        'monthly_expenses': monthly_expenses,
        'monthly_debt_payment': emi,
        'monthly_cash_flow': monthly_cash_flow,
        'savings_rate': savings_rate,
        'expense_ratio': expense_ratio,
        'dti': dti,
        'emergency_coverage': emergency_coverage,
        'annual_savings': annual_savings,
        'net_worth': net_worth
    }

def calculate_health_score(metrics):
    sr = metrics['savings_rate']
    dti = metrics['dti']
    emg = metrics['emergency_coverage']
    cf = metrics['monthly_cash_flow']
    inc = metrics['monthly_income']

    # 1. Savings Rate (30 pts)
    if sr >= 30:
        savings_pts = 30
    elif sr >= 20:
        savings_pts = 20
    elif sr >= 10:
        savings_pts = 12
    elif sr >= 0:
        savings_pts = 5
    else:
        savings_pts = 0

    # 2. Debt-to-Income (25 pts)
    if dti <= 10:
        dti_pts = 25
    elif dti <= 20:
        dti_pts = 20
    elif dti <= 30:
        dti_pts = 12
    elif dti <= 40:
        dti_pts = 6
    else:
        dti_pts = 0

    # 3. Emergency Fund (25 pts)
    if emg >= 6:
        emg_pts = 25
    elif emg >= 3:
        emg_pts = 20
    elif emg >= 1:
        emg_pts = 12
    else:
        emg_pts = 5

    # 4. Cash Flow (20 pts)
    if cf < 0:
        cf_pts = 0
    else:
        cf_pct = (cf / inc * 100) if inc > 0 else 0.0
        if cf_pct >= 30:
            cf_pts = 20
        elif cf_pct >= 20:
            cf_pts = 15
        elif cf_pct >= 10:
            cf_pts = 10
        else:
            cf_pts = 5

    total = savings_pts + dti_pts + emg_pts + cf_pts
    if total >= 80:
        rating = 'Excellent'
    elif total >= 65:
        rating = 'Good'
    elif total >= 50:
        rating = 'Fair'
    elif total >= 30:
        rating = 'Needs Attention'
    else:
        rating = 'Critical'

    return {
        'total': total,
        'rating': rating,
        'pts': (savings_pts, dti_pts, emg_pts, cf_pts)
    }

sample = {
    'takeHomeIncome': 80000,
    'otherIncome': 5000,
    'housing': 20000,
    'food': 8000,
    'transportation': 4000,
    'utilities': 3000,
    'insurance': 2000,
    'entertainment': 3000,
    'otherExpenses': 5000,
    'totalDebt': 500000,
    'emi': 8000,
    'savings': 180000,
    'investments': 350000
}

m = calculate_financial_metrics(sample)
s = calculate_health_score(m)
print(f"Sample Income: Rs.{m['monthly_income']:,.0f}")
print(f"Sample Expenses: Rs.{m['monthly_expenses']:,.0f}")
print(f"Sample Cash Flow: Rs.{m['monthly_cash_flow']:,.0f}")
print(f"Sample Savings Rate: {m['savings_rate']:.2f}%")
print(f"Sample DTI: {m['dti']:.2f}%")
print(f"Sample Emergency Fund: {m['emergency_coverage']:.1f} months")
print(f"Sample Annual Savings: Rs.{m['annual_savings']:,.0f}")
print(f"Sample Net Worth: Rs.{m['net_worth']:,.0f}")
print(f"Sample Health Score: {s['total']}/100 ({s['rating']}) Points breakdown: {s['pts']}")

assert m['monthly_income'] == 85000
assert m['monthly_expenses'] == 45000
assert m['monthly_cash_flow'] == 32000
assert round(m['emergency_coverage'], 1) == 4.0
assert m['annual_savings'] == 384000
assert m['net_worth'] == 30000
assert s['total'] == 95
assert s['rating'] == 'Excellent'
print("ALL SAMPLE ASSERTIONS PASSED!")
