export interface FirestoreFailure {
  failureId: string;
  timestamp: string;
  tenantId: string;
  collectionName: string;
  operationType: 'READ' | 'WRITE' | 'QUERY';
  errorMessage: string;
  isFatal: boolean;
}

export class FirestoreFailureReporter {
  private static failures: FirestoreFailure[] = [];
  private static isDegradedStateActive = false;

  public static reportFailure(failure: Omit<FirestoreFailure, 'failureId' | 'timestamp'>): FirestoreFailure {
    const fullFailure: FirestoreFailure = {
      ...failure,
      failureId: `fail-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };
    this.failures.push(fullFailure);

    if (this.failures.length > 100) {
      this.failures.shift();
    }

    console.error(`[FirestoreFailureReporter] DB Failure on collection ${failure.collectionName} during ${failure.operationType}: ${failure.errorMessage}`);

    // Auto trigger degraded mode if we get multiple failures in a row
    const recentFailures = this.failures.filter(f => Date.now() - new Date(f.timestamp).getTime() < 30000);
    if (recentFailures.length >= 3) {
      this.isDegradedStateActive = true;
      console.warn('[FirestoreFailureReporter] ⚠️ SYSTEM DEGRADED MODE ACTIVE: Multiple Firestore errors detected within 30 seconds.');
    }

    return fullFailure;
  }

  public static isSystemDegraded(): boolean {
    return this.isDegradedStateActive;
  }

  public static resetDegradedState() {
    this.isDegradedStateActive = false;
  }

  public static getFailures(): FirestoreFailure[] {
    return this.failures;
  }
}
