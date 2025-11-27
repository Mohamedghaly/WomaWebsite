import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateProductDescription = async (
  name: string,
  category: string,
  keywords: string
): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "AI Service Unavailable (Missing API Key)";

  try {
    const prompt = `
      Write a catchy, edgy, and short streetwear product description for a product named "${name}".
      Category: ${category}.
      Keywords/Vibe: ${keywords}.
      Tone: Cool, modern, minimalist, high-fashion, hypebeast.
      Limit to 2-3 sentences. Do not use emojis.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error generating description:", error);
    return "Could not generate description at this time.";
  }
};
