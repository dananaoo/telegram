import { GoogleGenAI } from "@google/genai";

export async function askGemini(prompt: string): Promise<string> {
  const ai = new GoogleGenAI(import.meta.env.VITE_GEMINI_API_KEY);
  const result = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
  });
  // result.text может быть undefined, поэтому возвращаем запасной вариант
  return result.text || "🤖 Ответа нет";
} 