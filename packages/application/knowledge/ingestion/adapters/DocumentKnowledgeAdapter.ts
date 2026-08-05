import { KnowledgeIngestionRequest } from '@/core/knowledge/ingestion/KnowledgeIngestionRequest';

export class DocumentKnowledgeAdapter {
  // Translates structured or unstructured document data (e.g., from PDF parsers or OCR)
  adapt(documentPayload: any, tenantId: string, uploaderId: string): KnowledgeIngestionRequest {
    return {
      tenantId,
      source: "document",
      payload: {
        title: documentPayload.title,
        content: documentPayload.parsedText,
        originalUrl: documentPayload.storageUrl
      },
      metadata: {
        createdBy: uploaderId,
        createdAt: new Date(),
        classification: documentPayload.isConfidential ? "confidential" : "internal"
      }
    };
  }
}
