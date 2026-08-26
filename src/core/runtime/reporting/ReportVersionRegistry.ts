import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { ExecutiveBoardPack, FiduciarySnapshot, ReportVersionRecord } from './ReportingTypes';
import { GovernedRepositoryWrapper } from '../../security/governed-repository';
import { DataAccessContext } from '../../security/data-access-context';
import { blockedFirestoreWrite } from '../../../lib/blockedFirestoreWrite';

export class ReportVersionRegistry {
  /**
   * Persiste o pacote executivo e o snapshot em coleções "Append-Only".
   */
  static async publishBoardPack(context: DataAccessContext, pack: ExecutiveBoardPack, snapshot: FiduciarySnapshot): Promise<void> {
    try {
      // 1. Salva o Snapshot Imutável
      const snapshotContext: DataAccessContext = {
        ...context,
        requestedAction: 'CREATE_SNAPSHOT',
        resourceType: 'Snapshot',
        lineageHash: snapshot.lineage.lineageHash,
        inputHash: snapshot.lineage.inputHash
      };
      await GovernedRepositoryWrapper.execute(snapshotContext, async () => {
        blockedFirestoreWrite(); // setDoc(doc(db, 'fiduciary_snapshots', snapshot.snapshotId), snapshot);
      });

      // 2. Salva o Dossiê Formal
      const packContext: DataAccessContext = {
        ...context,
        requestedAction: 'CREATE_BOARD_PACK',
        resourceType: 'BoardPack',
        lineageHash: pack.executiveReport.lineage.lineageHash
      };
      await GovernedRepositoryWrapper.execute(packContext, async () => {
        blockedFirestoreWrite(); // setDoc(doc(db, 'board_packs', pack.packId), pack);
      });

      // 3. Registra a Versão na Timeline de Relatórios
      const versionRecord: ReportVersionRecord = {
        packId: pack.packId,
        groupId: pack.groupId,
        version: pack.version,
        timestamp: pack.timestamp,
        executionId: pack.executiveReport.lineage.executionId,
        lineageHash: pack.executiveReport.lineage.lineageHash
      };
      
      const versionId = `${pack.groupId}_v${pack.version}`;
      
      const versionContext: DataAccessContext = {
        ...context,
        requestedAction: 'CREATE_REPORT',
        resourceType: 'ReportVersion',
        lineageHash: pack.executiveReport.lineage.lineageHash
      };
      await GovernedRepositoryWrapper.execute(versionContext, async () => {
        blockedFirestoreWrite(); // setDoc(doc(db, 'report_versions', versionId), versionRecord);
      });

    } catch (err) {
      console.error('[ReportVersionRegistry] Error publishing Board Pack:', err);
      throw err; // Fail-fast on Fiduciary layer
    }
  }
}
