import { SourceFile } from 'ts-morph';
import { KnowledgeGraphBuilder } from '../graph/KnowledgeGraphBuilder';
import { ArchitectureArtifactType, ArchitectureRelationshipType } from '../contracts/GraphModels';
import path from 'path';

export class CapabilityDetector {
  constructor(private graph: KnowledgeGraphBuilder) {}

  public run(files: SourceFile[]) {
    this.detectElements(files);
    this.detectRelationships(files);
  }

  private detectElements(files: SourceFile[]) {
    files.forEach(file => {
      const filePath = file.getFilePath();
      const fileName = file.getBaseName();
      
      // CONFIGURATION
      if (fileName === 'package.json' || fileName === 'tsconfig.json' || fileName.includes('vite.config')) {
        this.graph.addArtifact(ArchitectureArtifactType.CONFIGURATION, fileName, filePath, 'HIGH');
      }

      // TEST_ARTIFACT
      if (fileName.includes('.test.') || fileName.includes('.spec.')) {
        this.graph.addArtifact(ArchitectureArtifactType.TEST, fileName, filePath, 'HIGH');
      }

      // ROUTE
      if (filePath.includes('routes') || fileName.includes('Route') || fileName.includes('Page')) {
        this.graph.addArtifact(ArchitectureArtifactType.ROUTE, fileName, filePath, 'MEDIUM');
      }

      // AST Analysis for classes and interfaces
      const classes = file.getClasses();
      classes.forEach(cls => {
        const name = cls.getName();
        if (!name) return;
        const isExported = cls.isExported();
        
        let type = ArchitectureArtifactType.COMPONENT;
        if (name.endsWith('Engine')) type = ArchitectureArtifactType.ENGINE;
        if (name.endsWith('Contract')) type = ArchitectureArtifactType.CONTRACT;
        
        if (isExported) {
          this.graph.addArtifact(type, name, filePath, 'HIGH');
        }
      });

      const interfaces = file.getInterfaces();
      interfaces.forEach(iface => {
        const name = iface.getName();
        const isExported = iface.isExported();
        
        let type = ArchitectureArtifactType.CONTRACT; // CONTRACT_INTERFACE mapped as CONTRACT in G1.5 (or could add CONTRACT_INTERFACE back if wanted, but using CONTRACT)

        if (isExported) {
          this.graph.addArtifact(type, name, filePath, 'HIGH');
        }
      });
    });
  }

  private detectRelationships(files: SourceFile[]) {
    files.forEach(file => {
      const filePath = file.getFilePath();
      const fileName = file.getBaseName();
      const imports = file.getImportDeclarations();

      const localArtifacts = this.graph.getArtifacts().filter(n => n.path === filePath);

      for (const imp of imports) {
        const mod = imp.getModuleSpecifierValue();
        let targetId: string | null = null;
        
        if (mod.startsWith('@illumine/')) {
          const pkgName = mod.split('@illumine/')[1].split('/')[0];
          const targetNode = this.graph.getArtifacts().find(n => n.type === ArchitectureArtifactType.PACKAGE && n.name === pkgName);
          if (targetNode) targetId = targetNode.id;
        }

        if (targetId) {
          localArtifacts.forEach(src => {
            this.graph.addRelationship(src.id, targetId!, ArchitectureRelationshipType.DEPENDS_ON, 'HIGH', 'AST_IMPORT_SCANNER');
          });
        }
      }

      // Tests relationship
      if (fileName.includes('.test.')) {
        const baseName = fileName.split('.test.')[0];
        const testedNode = this.graph.getArtifacts().find(n => n.name === baseName || n.name === baseName + 'Engine' || n.name === baseName + 'Contract');
        const testNode = localArtifacts.find(n => n.type === ArchitectureArtifactType.TEST);
        
        if (testedNode && testNode) {
          this.graph.addRelationship(testNode.id, testedNode.id, ArchitectureRelationshipType.TESTS, 'HIGH', 'NAME_HEURISTIC');
        }
      }
    });
  }
}
