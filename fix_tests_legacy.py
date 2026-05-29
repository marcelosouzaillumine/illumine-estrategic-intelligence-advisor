import os

def fix_tests(filepath):
    with open(filepath, 'r') as f:
        lines = f.readlines()
    
    with open(filepath, 'w') as f:
        for line in lines:
            if 'legacy?.operationalProfile' not in line:
                f.write(line)

for root, _, files in os.walk('tests'):
    for file in files:
        if file.endswith('.ts') or file.endswith('.tsx'):
            fix_tests(os.path.join(root, file))
