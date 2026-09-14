export function sanitizeExecutiveClasses(className?: string): string {
  if (!className) return '';

  const structuralPatterns = [
    /^w-(full|auto|\d+|\[.*?\])$/,
    /^(min|max)-w-(full|auto|\d+|\[.*?\])$/,
    /^flex-1$/,
    /^grow$/,
    /^shrink-0$/,
    /^m[lr]-auto$/,
    /^self-(start|end|center|stretch|baseline)$/,
    /^justify-self-(start|end|center|stretch)$/,
    /^hidden$/,
    /^block$/,
    /^inline-flex$/,
    /^col-span-\d+$/,
    /^order-\d+$/
  ];

  // Also match structural patterns with any tailwind modifiers like md:, hover:, group-hover:, etc.
  const isStructural = (cls: string) => {
    // Strip all tailwind modifiers (e.g. "md:hover:w-full" -> "w-full")
    const baseClass = cls.split(':').pop() || '';
    
    return structuralPatterns.some(pattern => pattern.test(baseClass));
  };

  const tokens = className.split(/\s+/).filter(Boolean);
  const preserved: string[] = [];
  const removed: string[] = [];

  for (const token of tokens) {
    if (isStructural(token)) {
      preserved.push(token);
    } else {
      removed.push(token);
    }
  }

  if (removed.length > 0 && process.env.NODE_ENV !== 'production') {
    console.warn('[ExecutiveAction] Constitutional class overrides were removed:', removed);
  }

  return preserved.join(' ');
}
