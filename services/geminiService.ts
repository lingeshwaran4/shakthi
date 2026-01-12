
import { GoogleGenAI, Type } from "@google/genai";
import { AppLanguage } from "../types";

/**
 * Generates a professional artisan portfolio using Gemini's multimodal capabilities.
 * It analyzes the artisan's text details AND the visual product photo.
 */
export const generatePortfolio = async (
  sellerData: { 
    name: string; 
    village: string; 
    craftType: string; 
    experience: string;
    productImageBase64?: string; // Optional base64 image string
  },
  targetLang: AppLanguage
) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("Critical: API Key is missing. Falling back to local generation.");
    return fallbackPortfolio(sellerData);
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const promptText = `
    Act as an elite curator for "Shakti Bridge". 
    Create a luxury-grade artisan portfolio.
    
    Artisan Context:
    - Name: ${sellerData.name}
    - Village: ${sellerData.village}
    - Craft Type: ${sellerData.craftType}
    - Experience: ${sellerData.experience}
    
    Instructions:
    1. If an image is provided, analyze the visual details (patterns, colors, complexity) and incorporate them into the description.
    2. "portfolioEn": A 100-word evocative story in English for high-end international buyers. Highlight the "human touch" and "heritage".
    3. "portfolioNative": A 100-word warm, empowering story in ${targetLang} for the artisan's family and community.
    4. "tags": 4 SEO-friendly keywords based on the craft and visual style.
    
    Tone: Sophisticated, heart-warming, and premium.
    Response must be JSON.
  `;

  try {
    const contents: any[] = [{ text: promptText }];

    // If an image is provided, add it to the multimodal request
    if (sellerData.productImageBase64) {
      const base64Data = sellerData.productImageBase64.split(',')[1];
      const mimeType = sellerData.productImageBase64.split(';')[0].split(':')[1];
      
      contents.push({
        inlineData: {
          data: base64Data,
          mimeType: mimeType
        }
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // Flash is excellent for multimodal vision tasks
      contents: { parts: contents },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            portfolioEn: { type: Type.STRING },
            portfolioNative: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["portfolioEn", "portfolioNative", "tags"]
        }
      }
    });

    const result = response.text;
    if (!result) throw new Error("Empty response from GenAI");
    return JSON.parse(result);
  } catch (error) {
    console.error("Gemini Multimodal Error:", error);
    return fallbackPortfolio(sellerData);
  }
};

const fallbackPortfolio = (sellerData: any) => ({
  portfolioEn: `Introducing ${sellerData.name}, a master of ${sellerData.craftType} from ${sellerData.village}. With ${sellerData.experience} of dedication, her work preserves the ancient soul of her community, bringing timeless Indian traditions to the modern home.`,
  portfolioNative: `${sellerData.name}, ${sellerData.village} की एक कुशल कलाकार हैं।`,
  tags: [sellerData.craftType, "Artisan Made", "Indian Heritage", "Sustainable"]
});
