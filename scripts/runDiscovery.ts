import { ASTScanner, KnowledgeGraphBuilder, CapabilityDetector, SnapshotGenerator, CapabilityBoundaryAnalyzer } from '../packages/architecture-governance-discovery/src';
import path from 'path';

console.log('Starting Architecture Discovery Engine (Wave G1.5)...');

const basePath = process.cwd();
const scanner = new ASTScanner(basePath);
const files = scanner.getSourceFiles();

console.log(`AST Scanner loaded ${files.length} source files.`);

const graphBuilder = new KnowledgeGraphBuilder();

// 1. Detect Boundaries (Manifest > Package > AST)
const boundaryAnalyzer = new CapabilityBoundaryAnalyzer(graphBuilder, basePath);
boundaryAnalyzer.run();

// 2. Detect Artifacts and Internal Relationships
const detector = new CapabilityDetector(graphBuilder);
detector.run(files);

// 3. Generate Snapshot with Enhanced Evidences and Metrics
const snapshotGen = new SnapshotGenerator(graphBuilder);
snapshotGen.generateSnapshot(basePath);

console.log('Architecture Knowledge Enrichment Complete.');
