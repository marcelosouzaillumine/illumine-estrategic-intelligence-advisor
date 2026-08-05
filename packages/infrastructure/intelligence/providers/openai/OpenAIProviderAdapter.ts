import { AIProviderPort } from '@/core/intelligence/providers/AIProviderPort';
import { IntelligenceInput } from '@/core/intelligence/providers/IntelligenceInput';
import { AIContext } from '@/core/intelligence/providers/AIContext';
import { InferenceResult } from '@/core/intelligence/providers/InferenceResult';
import { OpenAIClientFactory } from './OpenAIClientFactory';

export class OpenAIProviderAdapter implements AIProviderPort {
  providerId = "openai";
  capabilities = ["reasoning", "classification", "summarization", "extraction"];

  constructor(private clientFactory: OpenAIClientFactory) {}

  async analyze(input: IntelligenceInput, context: AIContext): Promise<InferenceResult> {
    const client = this.clientFactory.createClient(context.tenantId);
    
    // Abstracting the OpenAI specific call
    const start = Date.now();
    const response = await client.chat.completions.create({
      model: "gpt-4-enterprise",
      messages: [{ role: "user", content: input.content }]
    });
    const latency = Date.now() - start;

    const resultData = JSON.parse(response.choices[0].message.content);

    return {
      provider: this.providerId,
      model: "gpt-4-enterprise",
      version: "api-v1",
      explanation: resultData.explanation,
      extractedSignals: resultData.signals.map((s: any) => ({ type: "ai-signal", description: s })),
      confidence: {
        score: resultData.confidence,
        dimensions: { evidence: 80, dataQuality: 90, reasoning: 85, historicalAccuracy: 75 },
        explanation: "AI Confidence score based on internal heuristics",
        uncertaintyFactors: []
      },
      generatedAt: new Date(),
      metadata: {
        latency,
        tokenUsage: response.usage?.total_tokens
      }
    };
  }
}
