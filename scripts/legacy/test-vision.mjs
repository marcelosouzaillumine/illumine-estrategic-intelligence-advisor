import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }); // Make sure API key is available or use default
// If API key is not in env, we might not be able to use it.
// Let's check if GEMINI_API_KEY is in process.env
console.log("Has API Key?", !!process.env.GEMINI_API_KEY);
