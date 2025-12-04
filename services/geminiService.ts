import { GoogleGenAI } from "@google/genai";
import { AspectRatio, ImageSize } from "../types";

const MODEL_NAME = 'gemini-3-pro-image-preview';

export const generateImage = async (
  prompt: string,
  aspectRatio: AspectRatio,
  imageSize: ImageSize
): Promise<string[]> => {
  // We must create a new instance each call to ensure we pick up the latest selected API key
  // if the user had to re-select it.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
          imageSize: imageSize,
        },
      },
    });

    const imageUrls: string[] = [];

    if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          const base64EncodeString = part.inlineData.data;
          // The mimeType is usually image/png or image/jpeg from the API
          const mimeType = part.inlineData.mimeType || 'image/png';
          const imageUrl = `data:${mimeType};base64,${base64EncodeString}`;
          imageUrls.push(imageUrl);
        }
      }
    }

    if (imageUrls.length === 0) {
      throw new Error("No image data found in response");
    }

    return imageUrls;
  } catch (error) {
    console.error("Gemini Image Generation Error:", error);
    throw error;
  }
};
