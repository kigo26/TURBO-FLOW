import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize Gemini (lazy init)
  let ai: GoogleGenAI | null = null;
  function getAI() {
    if (!ai) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("GEMINI_API_KEY environment variable is required");
      ai = new GoogleGenAI({
        apiKey,
        httpOptions: { headers: { "User-Agent": "aistudio-build" } },
      });
    }
    return ai;
  }

  app.use(express.json({ limit: '10mb' }));

  // API routes
  app.post("/api/ai/analyze-screenshot", async (req, res) => {
    try {
      const { image, mimeType, prompt } = req.body;
      const aiClient = getAI();
      
      let lastError;
      for (let i = 0; i < 3; i++) {
        try {
          const response = await aiClient.models.generateContent({
            model: "gemini-3.5-flash",
            contents: {
              parts: [
                { inlineData: { data: image, mimeType } },
                { text: prompt || "Analyze this game screen and provide insights based on the visual data." }
              ]
            }
          });
          return res.json({ text: response.text });
        } catch (error: any) {
          lastError = error;
          if (error.status === 429) {
             await new Promise(resolve => setTimeout(resolve, 60000));
          } else {
             await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
          }
        }
      }
      throw lastError;
    } catch (error: any) {
      console.error(error);
      res.status(error.status || 500).json({ error: "Failed to analyze screenshot." });
    }
  });

  app.post("/api/ai/insights", async (req, res) => {
    try {
      const { prompt } = req.body;
      const aiClient = getAI();
      
      let lastError;
      for (let i = 0; i < 3; i++) {
        try {
          const response = await aiClient.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt,
          });
          return res.json({ text: response.text });
        } catch (error: any) {
          lastError = error;
          if (error.status === 429) {
             await new Promise(resolve => setTimeout(resolve, 60000));
          } else {
             await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
          }
        }
      }
      throw lastError;
    } catch (error: any) {
      console.error(error);
      res.status(error.status || 500).json({ error: "Failed to generate AI insights." });
    }
  });

  // Vite middleware
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
startServer();
