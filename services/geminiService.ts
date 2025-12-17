import { GoogleGenAI, Type } from "@google/genai";
import { FoodItem } from "../types";

// Ensure API Key is available
const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("API_KEY is missing via process.env.API_KEY");
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

export const analyzeFoodImage = async (base64Image: string): Promise<Omit<FoodItem, 'id'>[]> => {
  // Remove data URL prefix if present for the API call
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Data
            }
          },
          {
            text: `Bạn là chuyên gia dinh dưỡng am hiểu món ăn Việt Nam. Hãy phân tích hình ảnh này và liệt kê các thành phần món ăn. 
            Nếu là món ăn phức hợp (ví dụ: Cơm tấm), hãy tách riêng các thành phần (Cơm, Sườn, Chả, v.v.).
            Ước lượng khối lượng (gam) và thành phần dinh dưỡng.
            Trả về kết quả dưới dạng JSON.`
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
              name: { type: Type.STRING, description: "Tên món ăn (Tiếng Việt)" },
              weight: { type: Type.NUMBER, description: "Khối lượng ước tính (g)" },
              calories: { type: Type.NUMBER, description: "Số calo (kcal)" },
              protein: { type: Type.NUMBER, description: "Chất đạm (g)" },
              fat: { type: Type.NUMBER, description: "Chất béo (g)" },
              carbs: { type: Type.NUMBER, description: "Đường bột (g)" }
            },
            required: ["name", "weight", "calories", "protein", "fat", "carbs"]
          }
        }
      }
    });

    if (response.text) {
      const items = JSON.parse(response.text);
      return items;
    }
    return [];
  } catch (error) {
    console.error("Lỗi khi phân tích ảnh:", error);
    throw new Error("Không thể phân tích ảnh. Vui lòng thử lại.");
  }
};
