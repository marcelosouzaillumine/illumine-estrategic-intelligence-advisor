import os

def replace_in_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    content = content.replace('ctx.businessStage', 'ctx.institutionalMaturity.code')
    content = content.replace('ctx.economicModel', 'ctx.operationalModel.code')
    content = content.replace('ctx.historicalDensity', 'ctx.institutionalMaturity.historicalSupportLevel')
    content = content.replace('ctx.liabilityProfile', 'ctx.financialProfile.drivers')
    content = content.replace('ctx.operationalProfile', 'ctx.legacy?.operationalProfile')

    with open(filepath, 'w') as f:
        f.write(content)

for root, _, files in os.walk('tests'):
    for file in files:
        if file.endswith('.ts') or file.endswith('.tsx'):
            replace_in_file(os.path.join(root, file))
