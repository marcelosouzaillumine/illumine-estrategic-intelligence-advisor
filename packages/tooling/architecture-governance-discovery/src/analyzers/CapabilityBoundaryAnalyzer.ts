import { KnowledgeGraphBuilder } from '../graph/KnowledgeGraphBuilder';
import { ArchitectureArtifactType, ArchitectureRelationshipType } from '../contracts/GraphModels';
import fs from 'fs';
import path from 'path';

export class CapabilityBoundaryAnalyzer {
  constructor(private graph: KnowledgeGraphBuilder, private basePath: string) {}

  public run() {
    this.detectManifestBoundaries();
    this.detectPackageBoundaries();
    this.bindArtifactsToBoundaries();
  }

  private detectManifestBoundaries() {
    // 1. Explicit Manifest: Ler capability.yaml nas raízes dos pacotes
    const packagesPath = path.join(this.basePath, 'packages');
    if (!fs.existsSync(packagesPath)) return;
    
    const dirs = fs.readdirSync(packagesPath);
    dirs.forEach(dir => {
      const pkgPath = path.join(packagesPath, dir);
      if (fs.statSync(pkgPath).isDirectory()) {
        const manifestPath = path.join(pkgPath, 'capability.yaml');
        if (fs.existsSync(manifestPath)) {
          this.graph.addArtifact(ArchitectureArtifactType.CAPABILITY, dir, manifestPath, 'HIGH');
        }
      }
    });
  }

  private detectPackageBoundaries() {
    // 2. Package Boundary: Se não houver manifesto, infere pela pasta e cria um pacote.
    const packagesPath = path.join(this.basePath, 'packages');
    if (!fs.existsSync(packagesPath)) return;
    
    const dirs = fs.readdirSync(packagesPath);
    dirs.forEach(dir => {
      // Check if capability is not already registered via manifest
      const existing = this.graph.getArtifacts().find(a => a.type === ArchitectureArtifactType.CAPABILITY && a.name === dir);
      if (!existing) {
        this.graph.addArtifact(ArchitectureArtifactType.PACKAGE, dir, path.join('packages', dir), 'MEDIUM');
      }
    });
  }

  private bindArtifactsToBoundaries() {
    // 3. Associar (BELONGS_TO) os elementos internos aos seus Boundaries
    const artifacts = this.graph.getArtifacts();
    const boundaries = artifacts.filter(a => a.type === ArchitectureArtifactType.CAPABILITY || a.type === ArchitectureArtifactType.PACKAGE);

    artifacts.forEach(artifact => {
      if (artifact.type === ArchitectureArtifactType.CAPABILITY || artifact.type === ArchitectureArtifactType.PACKAGE) return;
      if (!artifact.path) return;

      // Se o arquivo estiver dentro de packages/alguma-coisa, pertence àquele boundary
      const match = artifact.path.match(/\/packages\/([^\/]+)/);
      if (match && match[1]) {
        const boundaryName = match[1];
        const boundary = boundaries.find(b => b.name === boundaryName);
        if (boundary) {
          this.graph.addRelationship(artifact.id, boundary.id, ArchitectureRelationshipType.BELONGS_TO, 'HIGH', 'BOUNDARY_ANALYZER');
        }
      }
    });
  }
}
