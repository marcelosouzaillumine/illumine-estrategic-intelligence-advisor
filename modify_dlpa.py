import re

with open('src/components/pages/DLPAPage.tsx', 'r') as f:
    content = f.read()

# 1. Add state and useEffect
state_hook_find = """  const [showImportModal, setShowImportModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);

  useEffect(() => {
    if (selectedYear) setFilterYear(selectedYear);
  }, [selectedYear]);"""

state_hook_replace = """  const [showImportModal, setShowImportModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [showElsaPanel, setShowElsaPanel] = useState(false);

  useEffect(() => {
    if (selectedYear) setFilterYear(selectedYear);
  }, [selectedYear]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'e') {
        setShowElsaPanel(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);"""

content = content.replace(state_hook_find, state_hook_replace)

# 2. Modify ELSA panel condition
elsa_find = """      {/* Temporário: Auditoria de Propagação ELSA */}
      {(featureFlags.showSemanticAudit || process.env.NODE_ENV !== 'production') && (capitalGov as any)?.lifecycleAudit && ("""
elsa_replace = """      {/* Temporário: Auditoria de Propagação ELSA (Atalho: Ctrl+Shift+E) */}
      {showElsaPanel && (featureFlags.showSemanticAudit || process.env.NODE_ENV !== 'production') && (capitalGov as any)?.lifecycleAudit && ("""

content = content.replace(elsa_find, elsa_replace)

# 3. Swap the Narrative and KPI sections
# Let's split by the comments
parts1 = content.split("          {/* ── Narrative + Maturity Board ─────────────────────────────────── */}")
before_narrative = parts1[0]
after_narrative_and_more = parts1[1]

parts2 = after_narrative_and_more.split("          {/* ── KPIs de Governança DLPA ────────────────────────────────────── */}")
narrative_block = parts2[0]
after_kpi_and_more = parts2[1]

parts3 = after_kpi_and_more.split("          {/* ── Gráficos ─────────────────────────────────────────────────── */}")
kpi_block = parts3[0]
after_graphics = parts3[1]

# Now reconstruct in the new order: KPIs first, then Narrative
new_content = (
    before_narrative +
    "          {/* ── KPIs de Governança DLPA ────────────────────────────────────── */}" +
    kpi_block.replace('mb-10', 'mb-6') + # adjust margin bottom for KPI
    "          {/* ── Narrative + Maturity Board ─────────────────────────────────── */}" +
    narrative_block.replace('mb-2', 'mb-10') + # adjust margin bottom for Narrative
    "          {/* ── Gráficos ─────────────────────────────────────────────────── */}" +
    after_graphics
)

with open('src/components/pages/DLPAPage.tsx', 'w') as f:
    f.write(new_content)

print("Modification done!")
