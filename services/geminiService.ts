import { GoogleGenAI, Schema, Type } from "@google/genai";
import { Interaction, Deal, TurningPointPrediction, AiReflection } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Task 1: "The Critic" (AI 毒舌复盘)
 * Analyzes a single interaction log with a ruthless, critical persona.
 */
export const getCriticalReflection = async (
  logContent: string,
  logType: string,
  dealContext: { clientName: string; stage: string; value: number }
): Promise<AiReflection> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
        Context:
        Client: ${dealContext.clientName}
        Stage: ${dealContext.stage}
        Deal Value: $${dealContext.value}
        
        New Interaction (${logType}):
        "${logContent}"
      `,
      config: {
        systemInstruction: `
          You are "The Critic" - a ruthless, world-class Sales Director with 20 years of experience. 
          You are NOT a helpful assistant. You are a strict mentor.
          
          Your Task:
          Analyze the user's sales log. You must find the flaws.
          1. Did they ignore the client's subtext?
          2. Did they reveal their hand (leverage) too early before getting a budget commitment?
          3. Is their next step passive (e.g., "waiting to hear back")?
          
          Output Requirements:
          - critical_score: 1-10. (1 = You are fired, 10 = Perfection). Be harsh. Most logs are 4-6.
          - mistakes: A list of specific tactical errors.
          - immediate_action: ONE concrete thing to do RIGHT NOW to fix this.
        `,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            critical_score: { type: Type.INTEGER, description: "Score from 1-10 indicating quality of execution" },
            mistakes: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of tactical errors or missed subtext" 
            },
            immediate_action: { type: Type.STRING, description: "The single most important next step to recover leverage" },
          },
          required: ["critical_score", "mistakes", "immediate_action"],
        },
      },
    });
    
    if (!response.text) throw new Error("No response from Gemini");
    return JSON.parse(response.text) as AiReflection;

  } catch (error) {
    console.error("Error getting critical reflection:", error);
    return {
      critical_score: 5,
      mistakes: ["AI service temporarily unavailable.", "Could not analyze leverage."],
      immediate_action: "Check internet connection and retry."
    };
  }
};

/**
 * Task 2: "The Oracle" (转折点雷达)
 * Analyzes the history to predict the 'Make or Break' moment.
 */
export const predictTurningPoint = async (
  deal: Deal,
  history: Interaction[]
): Promise<TurningPointPrediction> => {
  try {
    // Sort history by date
    const sortedHistory = [...history].sort((a, b) => a.createdAt - b.createdAt);
    
    const historyText = sortedHistory.map(h => 
      `[Date: ${h.date}] [Type: ${h.type}] Content: ${h.content}`
    ).join("\n\n");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: `
        Client Profile:
        Name: ${deal.clientName}
        Current Stage: ${deal.stage}
        Value: $${deal.value}
        
        Interaction History (Timeline):
        ${historyText}
      `,
      config: {
        systemInstruction: `
          You are "The Oracle" - an AI specialized in predicting sales outcomes based on behavioral patterns.
          
          Your Task:
          Analyze the interaction timeline for specific signals:
          1. **Velocity Delta**: Is the time between responses increasing (bad) or decreasing (good)?
          2. **Stakeholder Depth**: Are we moving from technicians to decision-makers?
          3. **Tone Shift**: Are questions becoming more technical (stalling) or contractual (buying)?
          
          Predict the "Turning Point":
          This is NOT the close date. It is the date of the next "Deal Breaker" or "Deal Maker" event (e.g., Budget Committee Review, Legal Redline).
          
          Output logic:
          - If communication is slowing down + low stakeholder seniority = Low Probability.
          - If technical objections are resolved + legal is involved = High Probability.
        `,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            turning_point_date: { type: Type.STRING, description: "YYYY-MM-DD. The specific date the next major pivot will occur." },
            win_probability: { type: Type.INTEGER, description: "0-100" },
            reasoning: { type: Type.STRING, description: "Concise analysis of velocity, stakeholders, and tone." },
            risk_factors: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Top 2-3 hidden risks."
            },
          },
          required: ["turning_point_date", "win_probability", "reasoning", "risk_factors"],
        },
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("Empty response from AI");

    return JSON.parse(jsonText) as TurningPointPrediction;
  } catch (error) {
    console.error("Error predicting turning point:", error);
    return {
      win_probability: 50,
      turning_point_date: new Date().toISOString().split('T')[0],
      reasoning: "Insufficient data or API error for trajectory analysis.",
      risk_factors: ["Data connectivity lost"]
    };
  }
};