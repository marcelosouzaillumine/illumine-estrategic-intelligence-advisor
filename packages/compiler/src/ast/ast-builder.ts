export interface IntelligenceBindingConfig {
  knowledge?: { enabled: boolean };
  digitalTwin?: { enabled: boolean };
  recommendation?: { enabled: boolean };
  audit?: { enabled: boolean };
}

export interface SemanticASTNode {
  kind: 'Page' | 'Layout' | 'Primitive' | 'Section';
  name: string;
  props: Record<string, any>;
  intelligenceBinding?: IntelligenceBindingConfig;
  children: SemanticASTNode[];
}

export class ASTBuilder {
  public static buildSemanticAST(manifestRaw: Record<string, any>): SemanticASTNode {
    const pageId = manifestRaw.page?.id || manifestRaw.id || 'AnonymousPage';
    const template = manifestRaw.layout?.template || manifestRaw.layout || 'ExecutivePageTemplate';
    const intelligenceBinding = manifestRaw.intelligenceBinding || manifestRaw.intelligence;

    const children: SemanticASTNode[] = (manifestRaw.sections || manifestRaw.widgets || []).map((sec: any) => {
      if (typeof sec === 'string') {
        return {
          kind: 'Primitive',
          name: sec,
          props: {},
          children: []
        };
      }
      return {
        kind: 'Section',
        name: sec.component || sec.id,
        props: {
          governanceLevel: sec.governanceLevel || 'EXECUTIVE',
          ...(sec.props || {})
        },
        children: []
      };
    });

    return {
      kind: 'Page',
      name: pageId,
      props: { architecture: manifestRaw.page?.architecture || 'EAA', certificationLevel: 'L4' },
      intelligenceBinding,
      children: [
        {
          kind: 'Layout',
          name: template,
          props: {},
          children
        }
      ]
    };
  }
}
