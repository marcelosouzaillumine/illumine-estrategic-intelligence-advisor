import { FinancialRepository } from '../contracts/financial.repository';
import { OrganizationRepository } from '../contracts/organization.repository';
import { SnapshotRepository } from '../contracts/snapshot.repository';
import { FirestoreFinancialRepository } from '../repositories/firestore/firestore-financial.repository';
import { FirestoreOrganizationRepository } from '../repositories/firestore/firestore-organization.repository';
import { FirestoreSnapshotRepository } from '../repositories/firestore/firestore-snapshot.repository';

/**
 * Enterprise Repository Factory
 * Abstract access to repositories based on the active environment/provider.
 */
export class RepositoryFactory {
  private static activeDataSource: 'FIRESTORE' | 'POSTGRES' | 'MOCK' = 'FIRESTORE';

  static setDataSource(source: 'FIRESTORE' | 'POSTGRES' | 'MOCK') {
    this.activeDataSource = source;
  }

  static getFinancialRepository(): FinancialRepository {
    if (this.activeDataSource === 'FIRESTORE') {
      return new FirestoreFinancialRepository();
    }
    // Fallback or throw error if not implemented
    return new FirestoreFinancialRepository();
  }

  static getOrganizationRepository(): OrganizationRepository {
    if (this.activeDataSource === 'FIRESTORE') {
      return new FirestoreOrganizationRepository();
    }
    return new FirestoreOrganizationRepository();
  }

  static getSnapshotRepository(): SnapshotRepository {
    if (this.activeDataSource === 'FIRESTORE') {
      return new FirestoreSnapshotRepository();
    }
    return new FirestoreSnapshotRepository();
  }
}
