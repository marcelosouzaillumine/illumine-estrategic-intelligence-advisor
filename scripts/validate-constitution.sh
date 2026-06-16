#!/bin/bash

# validate-constitution.sh
# Verifica violações da Constituição Visual Executiva v6.0
# MODO: Gatekeeper Progressivo

echo "============================================================"
echo "🛡️ EXECUTIVE CONSTITUTIONAL TEST (v6.0)"
echo "Mode: Progressive Gatekeeper"
echo "============================================================"

# Padrão de Regex para encontrar violações tipográficas em Tailwind
REGEX_PATTERN='className="[^"]*(text-(xs|sm|md|lg|xl|[2-9]xl|\[[0-9]+px\])|font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)|tracking-(tighter|tight|normal|wide|wider|widest|\[[0-9\.\-]+em\])|leading-(none|tight|snug|normal|relaxed|loose|\[[0-9\.]+\]))[^"]*"'

# Lista de arquivos Canônicos e Certificados (Bloqueiam o build se houver violação)
STRICT_FILES=(
    "src/components/ui/executive-metric-card.tsx"
    "src/components/ui/executive-health-summary-card.tsx"
    "src/components/ui/executive-insight-card.tsx"
    "src/components/ui/executive-info-card.tsx"
    "src/components/ui/executive-narrative.tsx"
    "src/components/ui/executive-decision-summary.tsx"
    "src/components/ui/executive-execution-plan.tsx"
    "src/components/ui/executive-section-header.tsx"
    "src/components/pages/BalanceSheetPage.tsx"
)

# Adicionar todos os arquivos do balance-sheet ao STRICT MODE
for file in src/components/pages/balance-sheet/*.tsx; do
    if [ -f "$file" ]; then
        STRICT_FILES+=("$file")
    fi
done

# 1. Checagem Estrita
echo "🔍 Checking Canonical & Certified Components (STRICT MODE)..."
STRICT_VIOLATIONS=0

for file in "${STRICT_FILES[@]}"; do
    if [ -f "$file" ]; then
        FOUND=$(grep -E "$REGEX_PATTERN" "$file")
        if [ ! -z "$FOUND" ]; then
            echo "   ❌ VIOLAÇÃO CANÔNICA EM: $file"
            echo "$FOUND" | while read -r line; do
                echo "       $line"
            done
            STRICT_VIOLATIONS=$((STRICT_VIOLATIONS + 1))
        fi
    fi
done

if [ "$STRICT_VIOLATIONS" -gt 0 ]; then
    echo ""
    echo "🚨 GATEKEEPER BLOQUEADO: Foram encontradas violações em arquivos CERTIFICADOS (STRICT MODE)."
    echo "Estes componentes devem utilizar apenas a Constituição Visual v6.0 (ExecutiveHeading/ExecutiveText/ExecutiveMetric)."
    exit 1
else
    echo "✅ Componentes Certificados aprovados e protegidos."
fi

echo ""

# 2. Checagem em Report-Only nos demais componentes e páginas executivas
echo "🔍 Checking Legacy/WIP Components and Pages (REPORT ONLY)..."
# Criação de um padrão grep para excluir os arquivos estritos e o registry
EXCLUDE_PATTERN="executive-typography.tsx|executive-heading.tsx"
for f in "${STRICT_FILES[@]}"; do
    base=$(basename "$f")
    EXCLUDE_PATTERN="$EXCLUDE_PATTERN|$base"
done

# Buscar em ui e pages
VIOLATIONS=$(grep -r -E "$REGEX_PATTERN" src/components/ui/executive-*.tsx src/components/pages/ 2>/dev/null | grep -v -E "$EXCLUDE_PATTERN")

if [ -z "$VIOLATIONS" ]; then
    echo "✅ Excelente! Nenhuma tipografia arbitrária encontrada nos demais componentes."
else
    echo "⚠️ INVENTÁRIO (Report-Only): As seguintes linhas contêm tipografia local (Hardcoded) em componentes ainda não certificados."
    echo ""
    echo "$VIOLATIONS" | while read -r line; do
        file=$(echo "$line" | cut -d':' -f1)
        content=$(echo "$line" | cut -d':' -f2-)
        echo "   [!] $file"
        echo "       $content"
    done
fi

echo ""
echo ""
echo "============================================================"
echo "Gatekeeper Check Complete. (exit 0)"
echo "============================================================"

# 3. Checagem Estrita de Componentes Legados (STRICT MODE)
echo "🔍 Checking for Legacy Card usages in Certified Components (STRICT MODE)..."
LEGACY_CARDS_PATTERN="(KpiCard|KpiCardModeling|KPICard|KpiValue)"
STRICT_LEGACY_VIOLATIONS=0

for file in "${STRICT_FILES[@]}"; do
    if [ -f "$file" ]; then
        FOUND=$(grep -E "$LEGACY_CARDS_PATTERN" "$file")
        if [ ! -z "$FOUND" ]; then
            echo "   ❌ USO DE CARD LEGADO EM: $file"
            echo "$FOUND" | while read -r line; do
                echo "       $line"
            done
            STRICT_LEGACY_VIOLATIONS=$((STRICT_LEGACY_VIOLATIONS + 1))
        fi
    fi
done

if [ "$STRICT_LEGACY_VIOLATIONS" -gt 0 ]; then
    echo ""
    echo "🚨 GATEKEEPER BLOQUEADO: Foram encontrados usos de cards legados em arquivos CERTIFICADOS."
    echo "Os componentes KpiCard, KpiCardModeling, KPICard e KpiValue foram descontinuados."
    echo "Utilize o componente canônico ExecutiveMetricCard."
    exit 1
else
    echo "✅ Componentes Certificados livres de cards legados."
fi

echo ""

# 4. Checagem em Report-Only de Componentes Legados
echo "🔍 Checking for Legacy Card usages in Legacy/WIP Components (REPORT ONLY)..."
EXCLUDE_LEGACY_PATTERN="Base.tsx|index.tsx"
for f in "${STRICT_FILES[@]}"; do
    base=$(basename "$f")
    EXCLUDE_LEGACY_PATTERN="$EXCLUDE_LEGACY_PATTERN|$base"
done

LEGACY_VIOLATIONS=$(grep -r -E "$LEGACY_CARDS_PATTERN" src/components/ 2>/dev/null | grep -v -E "$EXCLUDE_LEGACY_PATTERN")

if [ ! -z "$LEGACY_VIOLATIONS" ]; then
    echo "⚠️ INVENTÁRIO (Report-Only): As seguintes linhas contêm usos de cards legados em componentes ainda não certificados."
    echo ""
    echo "$LEGACY_VIOLATIONS" | while read -r line; do
        echo "   [!] $line"
    done
else
    echo "✅ Excelente! Nenhum uso de card legado encontrado nos demais componentes."
fi

exit 0
