import { IOpportunityRepository } from '@application/revenue/deal-room/ports/IOpportunityRepository';
import { Opportunity } from '@domain/revenue/opportunity/Opportunity';
import { LeadSource } from '@domain/revenue/opportunity/value-objects/LeadSource';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc, collection, writeBatch } from 'firebase/firestore';

export class FirebaseOpportunityRepository implements IOpportunityRepository {
  
  async save(opportunity: Opportunity): Promise<void> {
    const oppRef = doc(db, 'tenants', opportunity.tenantId, 'executive-offices', 'revenue', 'opportunities', opportunity.id);
    
    // Create a batch so we save the Opportunity and its Events atomically
    const batch = writeBatch(db);

    const oppData = {
      id: opportunity.id,
      tenantId: opportunity.tenantId,
      company: opportunity.company,
      sponsor: opportunity.sponsor,
      source: opportunity.source,
      partnerReference: opportunity.partnerReference,
      estimatedARR: opportunity.estimatedARR,
      currentStage: opportunity.currentStage,
      createdBy: opportunity.createdBy,
      createdAt: opportunity.createdAt.toISOString(),
      insights: opportunity.insights,
      recommendations: opportunity.recommendations,
      riskSignals: opportunity.riskSignals,
    };

    batch.set(oppRef, oppData);

    // Event Sourcing prep: Save events to subcollection
    const eventsColl = collection(oppRef, 'events');
    
    opportunity.domainEvents.forEach((event, index) => {
      // Simulate sequential ID (000001) for this batch using timestamp and index for uniqueness if needed,
      // but to match the canonical "000001" strictly we pad the version.
      // Assuming version 1 for creation for now (could be dynamic).
      const version = index + 1;
      const eventId = String(version).padStart(6, '0');
      const eventRef = doc(eventsColl, eventId);
      
      batch.set(eventRef, {
        eventId: eventId,
        aggregateId: opportunity.id,
        aggregateType: 'Opportunity',
        eventType: event.eventName || event.constructor.name,
        occurredAt: event.occurredAt ? new Date(event.occurredAt).toISOString() : new Date().toISOString(),
        performedBy: opportunity.createdBy,
        payload: event.data || event,
        metadata: {
          tenantId: opportunity.tenantId,
          source: opportunity.source
        },
        version: version
      });
    });

    await batch.commit();

    console.log(`[FirebaseOpportunityRepository] Saved Opportunity ${opportunity.id} to Firestore`);
  }

  async findById(opportunityId: string, tenantId: string): Promise<Opportunity | null> {
    const oppRef = doc(db, 'tenants', tenantId, 'executive-offices', 'revenue', 'opportunities', opportunityId);
    const snap = await getDoc(oppRef);
    
    if (!snap.exists()) return null;

    const data = snap.data();

    return new Opportunity(
      data.id,
      data.tenantId,
      data.company,
      data.sponsor,
      data.source as LeadSource,
      data.partnerReference,
      data.estimatedARR,
      data.currentStage,
      data.createdBy,
      new Date(data.createdAt),
      data.insights,
      data.recommendations,
      data.riskSignals
    );
  }
}
