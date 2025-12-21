
import { GoogleGenAI, Type } from "@google/genai";
import { FoodItem } from "../types";

const apiKey = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || '' });

export const analyzeFoodImage = async (base64Image: string): Promise<Omit<FoodItem, 'id'>[]> => {
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Data
            }
          },
          {
            text: `Bạn là chuyên gia dinh dưỡng hàng đầu Việt Nam. Phân tích ảnh món ăn này:
            1. Liệt kê các thành phần chính (ví dụ: Phở bò thì có Bánh phở, Thịt bò, Nước dùng).
            2. Ước lượng khối lượng (gam) và calo/dinh dưỡng cho từng phần.
            3. Trả về mảng JSON chính xác theo schema.`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "Tên món (Tiếng Việt)" },
              weight: { type: Type.NUMBER, description: "Khối lượng (g)" },
              calories: { type: Type.NUMBER, description: "Calo (kcal)" },
              protein: { type: Type.NUMBER, description: "Đạm (g)" },
              fat: { type: Type.NUMBER, description: "Béo (g)" },
              carbs: { type: Type.NUMBER, description: "Đường bột (g)" }
            },
            required: ["name", "weight", "calories", "protein", "fat", "carbs"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return [];
  } catch (error) {
    console.error("Analysis Error:", error);
    throw new Error("AI đang bận, vui lòng thử lại sau giây lát.");
  }
};
