const fs = require('fs');
const file = 'src/components/pages/board/BoardModeDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

// Remove existing imports
content = content.replace(/import \{ BoardIntelligenceInput \} from '\.\.\/\.\.\/\.\.\/core\/runtime\/board\/BoardIntelligenceAdapter';\n/, '');
content = content.replace(/import \{ assessFiduciaryRisks \} from '\.\.\/\.\.\/\.\.\/core\/runtime\/board\/FiduciaryRiskEngine';\n/, '');
content = content.replace(/import \{ generateAttentionItems \} from '\.\.\/\.\.\/\.\.\/core\/runtime\/board\/BoardAttentionEngine';\n/, '');
content = content.replace(/import \{ generateBoardResolutions \} from '\.\.\/\.\.\/\.\.\/core\/runtime\/board\/BoardResolutionLayer';\n/, '');
content = content.replace(/import \{ generateBoardAgenda \} from '\.\.\/\.\.\/\.\.\/core\/runtime\/board\/BoardAgendaGenerator';\n/, '');

// Import the hook
content = content.replace(
  `import { AlertTriangle,`,
  `import { useBoardMode, BoardModeViewModel } from '../../../hooks/useBoardMode';\nimport { BoardIntelligenceInput } from '../../../services/BoardRuntimeAdapter';\nimport { AlertTriangle,`
);

// Replace component props and body
content = content.replace(
  /export function BoardModeDashboard\(\{\ input\ \}: BoardModeDashboardProps\) \{\n  const risks = assessFiduciaryRisks\(input\);\n  const attentionItems = generateAttentionItems\(input\);\n  const resolutions = generateBoardResolutions\(input, attentionItems\);\n  const agenda = generateBoardAgenda\(input, attentionItems, risks, resolutions\);/,
  `export function BoardModeDashboard({ input }: BoardModeDashboardProps) {
  const viewModel = useBoardMode(input);
  if (!viewModel) return null;
  const { risks, attentionItems, resolutions, agenda } = viewModel;`
);

fs.writeFileSync(file, content);
console.log("Updated BoardModeDashboard");
