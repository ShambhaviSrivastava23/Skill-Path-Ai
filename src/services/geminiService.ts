import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export const geminiService = {
  async generateRoadmap(role: string, gaps: string[]) {
    const prompt = `Generate a 4-week learning roadmap for a student aiming for a ${role} position. Their current skill gaps are: ${gaps.join(', ')}. Provide weekly milestones and project suggestions.`;
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text;
  },

  async analyzeResume(resumeText: string) {
    const prompt = `Analyze this resume and provide 3 improvement suggestions for an ATS-friendly format: ${resumeText}`;
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text;
  },

  async tuneResume(content: any) {
    const prompt = `Rewrite this resume content to be more impactful and professional for a ${content.role} role. 
    Focus on using strong action verbs and industry keywords. 
    Content to rewrite:
    Summary: ${content.summary}
    Experience: ${content.experience[0].desc}
    
    Return the response in JSON format with "summary" and "experience_desc" keys.`;
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    
    try {
      // Clean up the response in case it includes markdown code blocks
      const cleanJson = response.text.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (e) {
      console.error("Failed to parse Gemini response as JSON", e);
      return null;
    }
  }
};
