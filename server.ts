import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

let genAIInstance: GoogleGenAI | null = null;

function getGenAI() {
  if (!genAIInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    genAIInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return genAIInstance;
}

// AI Coach Endpoint
app.post("/api/coach", async (req, res) => {
  try {
    const { message, userData, history } = req.body;
    const genAI = getGenAI();

    const systemPrompt = `You are the Climora AI Climate Coach. Your mission is to help individuals reduce their carbon footprint through behavioral science and personalized insights.
    User context: ${JSON.stringify(userData)}

    CRITICAL INSTRUCTIONS:
    1. Respond ONLY in JSON format: { "text": "your motivating message", "options": ["Option 1 with icon", "Option 2 with icon", ...] }
    2. The "text" field should contain your conversational response.
    3. The "options" field should ALWAYS contain exactly 5 distinct, short actionable items (max 6 words each).
    4. Each option MUST start with a relevant emoji.
    5. Formatting: Use clean Markdown in the "text" field. Avoid excessive asterisks.
    6. Tone: Motivating, professional, and specific.`;

    const historyItems = (history || []).map((m: any) => ({
      role: m.role === 'model' || m.role === 'assistant' ? 'model' : 'user',
      parts: m.parts || [{ text: m.content }]
    }));

    const chat = genAI.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
      history: [
        { role: 'user', parts: [{ text: "Starting session." }] },
        { role: 'model', parts: [{ text: JSON.stringify({ text: "Hello! I'm your Climora AI Climate Coach. Let's start reducing your footprint.", options: ["🚲 Commute", "🥗 Diet", "💡 Energy", "♻️ Waste", "📱 Digital"] }) }] },
        ...historyItems
      ],
    });

    const result = await chat.sendMessage({ message });
    const responseText = result.text;
    
    try {
      res.json(JSON.parse(responseText));
    } catch (e) {
      res.json({ text: responseText, options: [] });
    }
  } catch (error: any) {
    console.error("AI Coach Error:", error);
    
    // Check for quota exhaustion (RESOURCE_EXHAUSTED)
    if (error.message?.includes("RESOURCE_EXHAUSTED") || error.status === "RESOURCE_EXHAUSTED") {
      return res.status(429).json({ 
        error: "Our AI coach is currently taking a short breather (quota reached). Please try again in a few minutes when it's back in action!" 
      });
    }

    res.status(500).json({ error: error.message || "Failed to get AI response" });
  }
});

// Impact Insights Endpoint
app.post("/api/insights", async (req, res) => {
  try {
    const { activityLogs } = req.body;
    const genAI = getGenAI();

    const prompt = `Analyze these activities: ${JSON.stringify(activityLogs)}. 
    Provide 3 punchy, actionable insights for reducing emissions this week. 
    Format as a JSON array of objects with { title, impact, description }.`;

    const result = await genAI.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    res.json(JSON.parse(result.text));
  } catch (error: any) {
    console.error("Insights Error:", error);
    if (error.message?.includes("RESOURCE_EXHAUSTED") || error.status === "RESOURCE_EXHAUSTED") {
      return res.status(429).json({ 
        error: "Eco insights are briefly unavailable due to high demand. Check back in a bit!" 
      });
    }
    res.status(500).json({ error: error.message || "Failed to generate insights" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Climora server running on http://localhost:${PORT}`);
  });
}

startServer();
