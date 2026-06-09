const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.join(__dirname, '../../');
const auditJsonPath = path.join(PROJECT_ROOT, 'docs', 'architecture', 'type-safety-audit.json');

if (!fs.existsSync(auditJsonPath)) {
  console.error("Audit JSON not found!");
  process.exit(1);
}

const auditData = JSON.parse(fs.readFileSync(auditJsonPath, 'utf8'));
const occurrences = auditData.occurrences;

function extractDomain(filePath) {
  const parts = filePath.split('/');
  if (parts[0] !== 'src') return 'outros';
  
  if (parts[1] === 'core' && parts[2] === 'runtime') {
    return 'core/runtime/' + (parts[3] || 'base');
  } else if (parts[1] === 'core') {
    return 'core/' + (parts[2] || 'base');
  } else if (parts[1] === 'services') {
    return 'services/' + (parts[2] || 'base');
  } else if (parts[1] === 'adapters') {
    return 'adapters/' + (parts[2] || 'base');
  } else if (parts[1] === 'components' || parts[1] === 'pages' || parts[1] === 'hooks' || parts[1] === 'context') {
    return 'ui/' + parts[1];
  }
  return parts[1] || 'outros';
}

const domainsMap = {};

occurrences.forEach(o => {
  const domain = extractDomain(o.file);
  if (!domainsMap[domain]) {
    domainsMap[domain] = {
      name: domain,
      total: 0,
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      isCore: domain.startsWith('core/'),
      isService: domain.startsWith('services/')
    };
  }
  domainsMap[domain].total++;
  
  if (o.risk === 'CRITICAL') domainsMap[domain].critical++;
  else if (o.risk === 'HIGH') domainsMap[domain].high++;
  else if (o.risk === 'MEDIUM') domainsMap[domain].medium++;
  else if (o.risk === 'LOW') domainsMap[domain].low++;
});

const domains = Object.values(domainsMap);

// Ranking by quantity
const rankingByTotal = [...domains].sort((a, b) => b.total - a.total);

// Ranking by criticality
const rankingByCriticality = [...domains].sort((a, b) => {
  if (b.critical !== a.critical) return b.critical - a.critical;
  if (b.high !== a.high) return b.high - a.high;
  return b.total - a.total;
});

// Generate Markdown
let md = `# Type Safety Domain Segmentation

**Objetivo:** Transição de uma correção massiva para um programa progressivo de tipagem por domínio, mitigando o risco de regressões em engines fiduciárias.

---

## Ranking por Criticidade (Foco Primário)

| Domínio | CRITICAL | HIGH | MEDIUM | LOW | Total | Observação |
|---|---|---|---|---|---|---|
`;

rankingByCriticality.forEach(d => {
  if (d.total > 0) {
    let obs = '';
    if (d.name.includes('security') || d.name.includes('logging')) obs = '✅ Fase 1 (Aprovado)';
    else if (d.name.includes('core/runtime')) obs = '🔒 Isolado (Requer Micro-sprint própria)';
    md += `| \`${d.name}\` | ${d.critical} | ${d.high} | ${d.medium} | ${d.low} | **${d.total}** | ${obs} |\n`;
  }
});

md += `

## Ranking por Volume Bruto (Todas as Classificações)

| Posição | Domínio | Total de Ocorrências (Qualquer Risco) |
|---|---|---|
`;

rankingByTotal.forEach((d, i) => {
  if (d.total > 0) {
    md += `| ${i+1} | \`${d.name}\` | ${d.total} |\n`;
  }
});

md += `

## Recomendação de Ordem de Ataque (Programa Progressivo)

Devido ao risco sistêmico das engines fiduciárias, a estratégia de refatoração deve começar pela base de serviços e orquestração lateral, avançando camada por camada até o núcleo.

### Fase 1: Serviços de Borda (Aprovada e em andamento)
- **Escopo:** \`services/security\` e \`services/logging\`
- **Motivo:** Escopo controlado, impacto direto na confiabilidade das auditorias, baixo risco funcional e financeiro.

### Fase 2: Serviços Compartilhados e Adapters
- **Escopo:** Outros módulos em \`services/\` e \`adapters/\`
- **Motivo:** Preparam o terreno para fornecer payloads fortemente tipados para os motores principais.

### Fase 3: Camada Fiduciária Primária (Engines Determinísticas)
- **Escopo:** \`core/runtime/bp\`, \`core/runtime/dre\`, \`core/runtime/treasury-intelligence\`
- **Motivo:** Motores de cálculo estático. Exigem validação matemática rigorosa após qualquer alteração de tipo.

### Fase 4: Camada Estratégica e Orquestração
- **Escopo:** \`core/runtime/executive\`, \`core/runtime/governance-orchestration\`
- **Motivo:** Consomem dados das camadas anteriores; se a base já for estrita, a orquestração será naturalmente estrita.

### Fase 5: Cenários e Simulação (Alta Complexidade)
- **Escopo:** \`core/runtime/scenario\`, \`core/runtime/scenario-simulation\`
- **Motivo:** Altíssimo acoplamento e criticidade. É a camada final.

---
`;

const outputPath = path.join(PROJECT_ROOT, 'docs', 'architecture', 'Type_Safety_Domain_Segmentation.md');
fs.writeFileSync(outputPath, md);
console.log('Markdown generated successfully.');
