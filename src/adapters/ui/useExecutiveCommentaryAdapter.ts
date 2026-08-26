import { useState, useCallback } from 'react';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../../lib/firebase';

export function useExecutiveCommentaryAdapter(clientId: string, reportType: string, year: number, month: number) {
  const [loading, setLoading] = useState(false);

  const fetchNote = useCallback(async () => {
    if (!clientId) return null;
    try {
      const q = query(
        collection(db, 'report_notes'),
        where('clientId', '==', clientId),
        where('reportType', '==', reportType),
        where('year', '==', year),
        where('month', '==', month)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs[0].data().note || '';
      }
      return '';
    } catch (error) {
      console.error("Error fetching note:", error);
      handleFirestoreError(error, OperationType.GET, 'report_notes');
      return '';
    }
  }, [clientId, reportType, year, month]);

  const deleteNote = useCallback(async () => {
    if (!clientId) return false;
    setLoading(true);
    try {
      const q = query(
        collection(db, 'report_notes'),
        where('clientId', '==', clientId),
        where('reportType', '==', reportType),
        where('year', '==', year),
        where('month', '==', month)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        (()=>{throw new Error("Phase 7.2 Architecture Violation: Firestore Writes are BLOCKED. Migrated to PostgreSQL.");})(); // updateDoc(doc(db, 'report_notes', snap.docs[0].id), {
          note: '',
          updatedAt: serverTimestamp(),
          updatedBy: auth.currentUser?.uid || 'anonymous'
        });
      }
      return true;
    } catch (error) {
      console.error("Error deleting note:", error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [clientId, reportType, year, month]);

  const saveNote = useCallback(async (note: string) => {
    if (!clientId) return false;
    setLoading(true);
    try {
      const q = query(
        collection(db, 'report_notes'),
        where('clientId', '==', clientId),
        where('reportType', '==', reportType),
        where('year', '==', year),
        where('month', '==', month)
      );
      const snap = await getDocs(q);
      
      if (!snap.empty) {
        (()=>{throw new Error("Phase 7.2 Architecture Violation: Firestore Writes are BLOCKED. Migrated to PostgreSQL.");})(); // updateDoc(doc(db, 'report_notes', snap.docs[0].id), {
          note,
          updatedAt: serverTimestamp(),
          updatedBy: auth.currentUser?.uid || 'anonymous'
        });
      } else {
        (()=>{throw new Error("Phase 7.2 Architecture Violation: Firestore Writes are BLOCKED. Migrated to PostgreSQL.");})(); // addDoc(collection(db, 'report_notes'), {
          clientId,
          reportType,
          year,
          month,
          note,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          createdBy: auth.currentUser?.uid || 'anonymous'
        });
      }
      return true;
    } catch (error) {
      console.error("Error saving note:", error);
      handleFirestoreError(error, OperationType.WRITE, 'report_notes');
      return false;
    } finally {
      setLoading(false);
    }
  }, [clientId, reportType, year, month]);

  return {
    loading,
    fetchNote,
    deleteNote,
    saveNote
  };
}
