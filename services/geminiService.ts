import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ProjectPlan, Task, ExecutorType, ImageGenerationConfig } from "../types";

// Initialize the client
// CRITICAL: process.env.API_KEY is injected by the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// System Instructions from the prompt
const PROJECT_PLANNER_SYSTEM_INSTRUCTION = `
You are a top-tier "Project Decomposition & Resource Orchestration Expert" named Gemini Studio.
Your goal is to help users land a vague Idea into an executable Plan.

Strictly follow these steps for Unbundle and Rebundle:

Step 1: Language Detection
- Analyze the language of the User's Idea.
- **CRITICAL**: All output (task_name, actionable_content) MUST be in the SAME language as the User's Idea. 
- Example: If input is Chinese, output Chinese. If input is English, output English.

Step 2: Unbundle (Deep Decomposition)
Break down the user's goal into 5-8 core steps (WBS).

Step 3: Rebundle (Resource Matching)
For each step, determine the best executor:
- [AI]: Suitable for copywriting, code, logic analysis, simple design, image generation.
- [HUMAN]: Suitable for offline errands, complex communication, physical photography, high-level approval.
- [TOOL]: Suitable for storage, payment, automation flows.

Step 4: Output (Structured JSON)
Return a strictly formatted JSON object. 
If executor is [AI], 'actionable_content' must be a specific Prompt (in the detected language).
If executor is [HUMAN], 'actionable_content' must be a Job Description (JD) (in the detected language).
If executor is [TOOL], 'actionable_content' must be the tool category and usage (in the detected language).
`;

const taskSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    task_name: { type: Type.STRING, description: "Name of the task in the User's language" },
    executor_type: { 
      type: Type.STRING, 
      enum: [ExecutorType.AI, ExecutorType.HUMAN, ExecutorType.TOOL],
      description: "Who should execute this task" 
    },
    actionable_content: { type: Type.STRING, description: "The prompt, JD, or tool recommendation in the User's language" }
  },
  required: ["task_name", "executor_type", "actionable_content"]
};

const planSchema: Schema = {
  type: Type.ARRAY,
  items: taskSchema
};

// Helper to strip markdown code blocks from JSON response
const cleanJson = (text: string): string => {
  if (!text) return "[]";
  let cleaned = text.trim();
  // Remove markdown code blocks if present
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return cleaned;
};

export const generateProjectPlan = async (idea: string): Promise<Task[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Switched to Flash for speed
      contents: idea,
      config: {
        systemInstruction: PROJECT_PLANNER_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: planSchema,
      }
    });

    const cleanText = cleanJson(response.text || "[]");
    const tasksRaw = JSON.parse(cleanText);
    
    // Enrich with IDs
    return tasksRaw.map((t: any, index: number) => ({
      ...t,
      id: `task-${Date.now()}-${index}`,
      status: 'pending'
    }));
  } catch (error) {
    console.error("Error generating plan:", error);
    throw error;
  }
};

export const executeAITextTask = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Flash is faster for execution
      contents: prompt,
    });
    return response.text || "No output generated.";
  } catch (error) {
    console.error("Error executing text task:", error);
    throw error;
  }
};

export const executeAIImageTask = async (prompt: string, config: ImageGenerationConfig): Promise<string> => {
  try {
    // gemini-3-pro-image-preview for high quality images with size control
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview', 
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: config.aspectRatio,
          imageSize: config.imageSize
        }
      }
    });

    let refusalText = "";

    // Extract image
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
      if (part.text) {
        refusalText += part.text;
      }
    }
    
    if (refusalText) {
       throw new Error(`Model refused to generate image: ${refusalText}`);
    }
    
    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Error executing image task:", error);
    throw error;
  }
};