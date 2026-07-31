import { Project, SourceFile } from 'ts-morph';
import path from 'path';

export class ASTScanner {
  private project: Project;

  constructor(basePath: string) {
    this.project = new Project();
    
    // Scan all packages and src
    this.project.addSourceFilesAtPaths([
      path.join(basePath, 'packages/**/*.ts'),
      path.join(basePath, 'packages/**/*.tsx'),
      path.join(basePath, 'src/**/*.ts'),
      path.join(basePath, 'src/**/*.tsx'),
      // Exclude node_modules explicitly if needed, though ts-morph skips them usually when using fast paths
    ]);
  }

  public getSourceFiles(): SourceFile[] {
    // Filter out node_modules and artifacts just in case
    return this.project.getSourceFiles().filter(file => {
      const p = file.getFilePath();
      return !p.includes('node_modules') && !p.includes('/artifacts/');
    });
  }

  public getProject(): Project {
    return this.project;
  }
}
