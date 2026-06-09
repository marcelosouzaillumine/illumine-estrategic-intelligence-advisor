import { logger } from "../services/logging/InstitutionalLogger";
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const serviceAccount = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'serviceAccountKey.json'), 'utf-8'));

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function run() {
  console.log('--- Iniciando auditoria de Balanço Patrimonial e DFC ---');
  
  const entriesRef = db.collection('financial_entries');
  const snap = await entriesRef.where('type', 'in', ['BP', 'Balanço Patrimonial', 'DFC']).get();

  console.log(`Encontrados ${snap.size} documentos totais.`);

  const docs = snap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];

  // Agrupar por clientId e year
  const grouped: Record<string, any[]> = {};
  for (const doc of docs) {
    const key = `${doc.clientId}_${doc.year}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(doc);
  }

  for (const [key, clientDocs] of Object.entries(grouped)) {
    const bps = clientDocs.filter(d => (d.type === 'BP' || d.type === 'Balanço Patrimonial') && d.status !== 'archived');
    
    for (const bp of bps) {
      // Check if this BP is actually a DFC
      const isActuallyDfc = Array.isArray(bp.data) && bp.data.some((r: any) => 
        ['despesas', 'receitas', 'atividade operacional', 'atividade de financiamento', 'atividade de investimento'].includes((r.type || r.tipo || '').toLowerCase())
      );

      if (isActuallyDfc) {
        logger.warn('Corrupted BP Document', { documentId: bp.id, key });
        
        // Arquivar o documento incorreto
        logger.audit('Archiving Corrupted BP', { documentId: bp.id });
        await entriesRef.doc(bp.id).update({
          status: 'archived',
          notes: 'Arquivado automaticamente por corrupção com DFC'
        });

        // Procurar o último BP verdadeiro que foi arquivado para restaurar
        const archivedBPs = clientDocs.filter(d => 
          (d.type === 'BP' || d.type === 'Balanço Patrimonial') && 
          d.status === 'archived' && 
          d.id !== bp.id
        );

        // Sort by archivedAt or createdAt desc
        archivedBPs.sort((a, b) => {
          const tA = a.archivedAt?._seconds || a.createdAt?._seconds || 0;
          const tB = b.archivedAt?._seconds || b.createdAt?._seconds || 0;
          return tB - tA;
        });

        let restored = false;
        for (const arch of archivedBPs) {
          const archIsDfc = Array.isArray(arch.data) && arch.data.some((r: any) => 
            ['despesas', 'receitas', 'atividade operacional'].includes((r.type || r.tipo || '').toLowerCase())
          );
          
          if (!archIsDfc) {
            logger.audit('Restoring Authentic BP', { documentId: arch.id });
            await entriesRef.doc(arch.id).update({
              status: 'approved',
              notes: 'Restaurado automaticamente'
            });
            restored = true;
            break;
          }
        }
        
        if (!restored) {
          logger.error('Failed to find Authentic BP', { key });
        }
      }
    }
  }

  console.log('--- Auditoria concluída ---');
}

run().catch(console.error);
