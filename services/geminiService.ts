import { GoogleGenAI, Type, Schema } from "@google/genai";
import { BabyProfile, PlanItem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const planSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    schedule: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Short title of activity, e.g. 'Breakfast', 'Vitamin D'" },
          time: { type: Type.STRING, description: "Time in HH:MM format (24h), e.g. 08:30" },
          type: { type: Type.STRING, enum: ["meal", "medicine", "sleep", "play"] },
          details: { type: Type.STRING, description: "Brief details or dosage info" }
        },
        required: ["title", "time", "type"]
      }
    }
  },
  required: ["schedule"]
};

export const suggestDailyRoutine = async (profile: BabyProfile): Promise<PlanItem[]> => {
  // Temporary fallback date for generation, re-assigned in App.tsx
  const fallbackDate = new Date().toISOString().split('T')[0];

  try {
    const birthDate = new Date(profile.birthDate);
    const now = new Date();
    const months = (now.getFullYear() - birthDate.getFullYear()) * 12 + (now.getMonth() - birthDate.getMonth());

    const prompt = `
      Create a healthy, realistic daily routine schedule for a baby.
      Baby Name: ${profile.name}
      Age: ${months} months old.
      Weight: ${profile.weight} kg.
      
      Include appropriate meal times, sleep schedules (naps), and generic vitamin/medicine slots if typical for this age (or just placeholders).
      Keep it simple, about 5-7 items total for the day.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: planSchema,
        systemInstruction: "You are an expert pediatrician and baby sleep consultant. Generate specific, age-appropriate schedules."
      }
    });

    const text = response.text;
    if (!text) return [];

    const data = JSON.parse(text);
    
    // Transform to PlanItem
    return data.schedule.map((item: any, index: number) => ({
      id: `ai-${Date.now()}-${index}`,
      type: item.type as any,
      title: item.title,
      time: item.time,
      details: item.details,
      isCompleted: false,
      date: fallbackDate
    }));

  } catch (error) {
    console.error("Failed to generate plan:", error);
    // Return a fallback plan if AI fails
    return [
      { id: 'fb-1', type: 'meal', title: 'Breakfast', time: '08:00', details: 'Cereal or Milk', isCompleted: false, date: fallbackDate },
      { id: 'fb-2', type: 'sleep', title: 'Morning Nap', time: '10:00', details: '1 hour', isCompleted: false, date: fallbackDate },
      { id: 'fb-3', type: 'meal', title: 'Lunch', time: '12:30', details: 'Pureed veggies', isCompleted: false, date: fallbackDate },
    ];
  }
};