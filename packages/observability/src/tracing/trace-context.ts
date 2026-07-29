export interface Span {
  spanId: string;
  name: string;
  durationMs: number;
}

export class TraceContext {
  private spans: Span[] = [];

  public startSpan(name: string): (durationMs: number) => void {
    const spanId = `spn-${Math.random().toString(36).substring(2, 9)}`;
    return (durationMs: number) => {
      this.spans.push({ spanId, name, durationMs });
    };
  }

  public getSpans(): Span[] {
    return this.spans;
  }
}
