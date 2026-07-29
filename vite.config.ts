import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true,
      chunkSizeWarningLimit: 3000,
    },
    esbuild: {
      pure: ['console.log', 'console.info', 'console.debug'],
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@illumine/core-primitives': path.resolve(__dirname, './packages/domain/core-primitives/src'),
        '@illumine/semantic-model': path.resolve(__dirname, './packages/domain/semantic-model/src'),
        '@illumine/executive-contracts': path.resolve(__dirname, './packages/domain/executive-contracts/src'),
        '@illumine/executive-domain': path.resolve(__dirname, './packages/domain/executive-domain/src'),
        '@illumine/architecture-registry': path.resolve(__dirname, './packages/platform/architecture-registry/src'),
        '@illumine/capabilities': path.resolve(__dirname, './packages/capabilities/src'),
        '@illumine/intelligence-kernel': path.resolve(__dirname, './packages/intelligence/intelligence-kernel/src'),
        '@illumine/organizational-memory': path.resolve(__dirname, './packages/intelligence/organizational-memory/src'),
        '@illumine/knowledge-graph': path.resolve(__dirname, './packages/intelligence/knowledge-graph/src'),
        '@illumine/executive-orchestrator': path.resolve(__dirname, './packages/intelligence/executive-orchestrator/src'),
        '@illumine/predictive-engine': path.resolve(__dirname, './packages/intelligence/predictive-engine/src'),
        '@illumine/decision-learning': path.resolve(__dirname, './packages/intelligence/decision-learning/src'),
        '@illumine/intelligence-certification': path.resolve(__dirname, './packages/intelligence/intelligence-certification/src'),
        '@illumine/enterprise-knowledge-fabric': path.resolve(__dirname, './packages/intelligence/enterprise-knowledge-fabric/src'),
        '@illumine/organizational-intelligence-graph': path.resolve(__dirname, './packages/intelligence/organizational-intelligence-graph/src'),
        '@illumine/cross-domain-intelligence': path.resolve(__dirname, './packages/intelligence/cross-domain-intelligence/src'),
        '@illumine/benchmark-intelligence': path.resolve(__dirname, './packages/intelligence/benchmark-intelligence/src'),
        '@illumine/executive-network': path.resolve(__dirname, './packages/intelligence/executive-network/src'),
        '@illumine/enterprise-certification': path.resolve(__dirname, './packages/intelligence/enterprise-certification/src'),
        '@illumine/agent-runtime': path.resolve(__dirname, './packages/intelligence/agent-runtime/src'),
        '@illumine/human-governance-gateway': path.resolve(__dirname, './packages/intelligence/human-governance-gateway/src'),
        '@illumine/agent-impact-engine': path.resolve(__dirname, './packages/intelligence/agent-impact-engine/src'),
        '@illumine/executive-simulation-engine': path.resolve(__dirname, './packages/intelligence/executive-simulation-engine/src'),
        '@illumine/advisory-governance': path.resolve(__dirname, './packages/intelligence/advisory-governance/src'),
        '@illumine/advisory-workflow-engine': path.resolve(__dirname, './packages/intelligence/advisory-workflow-engine/src'),
        '@illumine/continuous-intelligence-monitor': path.resolve(__dirname, './packages/intelligence/continuous-intelligence-monitor/src'),
        '@illumine/advisory-trigger-engine': path.resolve(__dirname, './packages/intelligence/advisory-trigger-engine/src'),
        '@illumine/executive-insight-engine': path.resolve(__dirname, './packages/intelligence/executive-insight-engine/src'),
        '@illumine/executive-priority-engine': path.resolve(__dirname, './packages/intelligence/executive-priority-engine/src'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
