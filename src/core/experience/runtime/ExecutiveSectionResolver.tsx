import React from 'react';
import { ExecutiveSectionSchema } from '../schema/ExecutiveSectionSchema';
import { ExperienceComponentRegistry } from '../registry/ExperienceComponentRegistry';
import { ExecutiveExperienceContext } from './ExecutiveExperienceContext';

export class ExecutiveSectionResolver {
  /**
   * Resolves an ExecutiveSectionSchema into an array of instantiated React components.
   * Injects the context into the resolved components.
   */
  static resolve(section: ExecutiveSectionSchema, context: ExecutiveExperienceContext, keyPrefix: string): React.ReactNode {
    return (
      <div key={keyPrefix} className="executive-section" data-section-type={section.type}>
        {section.components.map((componentId, index) => {
          try {
            const metadata = ExperienceComponentRegistry.getComponentMetadata(componentId);
            const Component = metadata.component;
            
            // Validate if the component is allowed in this section
            if (!metadata.allowedSections.includes(section.type)) {
              console.warn(`[Executive Runtime]: Component ${componentId} is not allowed in section ${section.type}`);
              // In strict mode we could throw, but we'll render a fallback or just log for now.
            }

            // Inject the full context for now. In the future, we can map `requiredData` strictly.
            return <Component key={`${keyPrefix}-comp-${index}`} context={context} />;
          } catch (e) {
            console.error(e);
            return (
              <div key={`${keyPrefix}-comp-${index}`} className="p-4 border border-critical bg-critical/10 text-critical rounded-lg">
                <strong>Component Violation:</strong> {componentId} could not be resolved.
              </div>
            );
          }
        })}
      </div>
    );
  }
}
