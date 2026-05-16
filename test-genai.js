import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const ai = new GoogleGenAI({ apiKey: process.env.VITE_GEMINI_API_KEY });
const financialStatementSchema = {
  type: Type.OBJECT,
  properties: {
    documents: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING },
          year: { type: Type.NUMBER },
          month: { type: Type.NUMBER },
          entries: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                value: { type: Type.NUMBER }
              },
              required: ["category", "value"]
            }
          }
        },
        required: ["type", "year", "month", "entries"]
      }
    }
  },
  required: ["documents"]
};

async function run() {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: "here is a text",
      config: {
        responseMimeType: 'application/json',
        responseSchema: financialStatementSchema,
      }
    });
    console.log(response.text);
  } catch (e) {
    console.error(e);
  }
}
run();
