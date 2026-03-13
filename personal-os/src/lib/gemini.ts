import { GoogleGenerativeAI } from "@google/generative-ai";

// Available models — rotated per call to spread load
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MODELS = [
  "gemini-2.5-flash",
  "gemini-3-flash-preview",
  "gemini-flash-latest",       // alias → currently points to gemini-3-flash-preview
] as const;

export type GeminiModelName = (typeof MODELS)[number];

// Collect all GEMINI_API_KEY_* env vars
function getApiKeys(): string[] {
  const keys: string[] = [];
  for (let i = 1; i <= 100; i++) {
    const key = process.env[`GEMINI_API_KEY_${i}`];
    if (key) keys.push(key);
    else if (i > 1) break; // stop at first gap after key 1
  }
  if (keys.length === 0) {
    throw new Error("No GEMINI_API_KEY_* environment variables found. Add keys to .env.local");
  }
  return keys;
}

let callIndex = 0;

/**
 * Returns a Gemini GenerativeModel using round-robin key rotation.
 * Accepts an optional systemInstruction as a proper Content object.
 */
export function getGeminiModel(
  modelName: GeminiModelName = "gemini-2.5-flash",
  systemInstruction?: string,
) {
  const keys = getApiKeys();
  const idx = callIndex % keys.length;
  callIndex++;

  const genAI = new GoogleGenerativeAI(keys[idx]);
  return genAI.getGenerativeModel({
    model: modelName,
    ...(systemInstruction
      ? { systemInstruction: { role: "user" as const, parts: [{ text: systemInstruction }] } }
      : {}),
  });
}

export interface ChatHistoryMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

/**
 * Call Gemini with a system instruction, user prompt, and optional conversation history.
 * Defaults to gemini-2.5-flash for general use.
 */
export async function callGemini(
  systemPrompt: string,
  userMessage: string,
  modelName: GeminiModelName = "gemini-2.5-flash",
  history: ChatHistoryMessage[] = [],
): Promise<string> {
  const model = getGeminiModel(modelName, systemPrompt);
  const chat = model.startChat({
    history,
    generationConfig: { maxOutputTokens: 4096, temperature: 0.7 },
  });

  const result = await chat.sendMessage(userMessage);
  const response = result.response;
  return response.text();
}
