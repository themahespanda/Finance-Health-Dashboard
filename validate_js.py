import sys

with open('script.js', 'r', encoding='utf-8') as f:
    code = f.read()

# Verify no obvious syntax traps
assert 'DEFAULT_PROFILE' in code
assert 'FinanceEngine' in code
assert 'calculateMetrics' in code
assert 'calculateHealthScore' in code
assert 'InsightsEngine' in code
assert 'ChartControllers' in code
assert 'updateSimulator' in code

print("All required core symbols are present in script.js!")
print(f"File size: {len(code)} characters, {len(code.splitlines())} lines.")
