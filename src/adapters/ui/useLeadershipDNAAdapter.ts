import { useState, useEffect } from 'react';
import { db, auth } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy } from 'firebase/firestore';
import { blockedFirestoreWrite } from '../../lib/blockedFirestoreWrite';

export function useLeadershipDNAAdapter(clientId: string) {
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clientId) return;
    const fetchAssessments = async () => {
      try {
        const q = query(
          collection(db, 'leadership_dna_assessments'),
          where('clientId', '==', clientId),
          orderBy('createdAt', 'desc')
        );
        const snap = await getDocs(q);
        setAssessments(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Erro ao buscar avaliações de liderança:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssessments();
  }, [clientId]);

  const saveAssessment = async (payload: any) => {
    const fullPayload = {
      ...payload,
      createdAt: serverTimestamp(),
      createdBy: auth.currentUser?.email || 'unknown'
    };
    
    const docRef: any = blockedFirestoreWrite(); // addDoc(collection(db, 'leadership_dna_assessments'), fullPayload);
    
    // Update local state optimizing for fast feedback
    setAssessments(prev => [{ id: docRef.id, ...fullPayload, createdAt: new Date() }, ...prev]);
    return docRef.id;
  };

  const [teamProfiles, setTeamProfiles] = useState<any[]>([]);

  useEffect(() => {
    if (!clientId) return;
    const fetchTeamData = async () => {
      try {
        const q = query(
          collection(db, 'leadership_profiles'),
          where('clientId', '==', clientId),
          where('type', '==', 'governance_assessment'),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        setTeamProfiles(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching team data:", error);
      }
    };
    fetchTeamData();
  }, [clientId]);

  const saveProfile = async (resultsData: any) => {
    if (!auth.currentUser) throw new Error("Unauthenticated");
    const payload = {
      ...resultsData,
      clientId,
      userId: auth.currentUser.uid,
      userName: auth.currentUser.displayName,
      createdAt: serverTimestamp(),
      type: 'governance_assessment'
    };
    blockedFirestoreWrite(); // addDoc(collection(db, 'leadership_profiles'), payload);
  };

  return {
    assessments,
    loading,
    saveAssessment,
    teamProfiles,
    saveProfile,
    currentUser: auth.currentUser
  };
}
