import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();

// 🌱 CORS must come BEFORE other middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Body parser must come BEFORE routes
app.use(express.json());

// 🧠 Log all requests
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url}`);
  next();
});

// Use the latest stable Gemini model
const GEMINI_MODEL = "gemini-2.5-flash";

// Simple rate limiting (for free tier: 2 requests per minute)
const requestQueue = [];
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 2; // Free tier limit

function checkRateLimit() {
  const now = Date.now();
  
  // Remove requests older than 1 minute
  while (requestQueue.length > 0 && now - requestQueue[0] > RATE_LIMIT_WINDOW) {
    requestQueue.shift();
  }
  
  // Check if we've hit the limit
  if (requestQueue.length >= MAX_REQUESTS_PER_WINDOW) {
    const oldestRequest = requestQueue[0];
    const waitTime = Math.ceil((RATE_LIMIT_WINDOW - (now - oldestRequest)) / 1000);
    return { allowed: false, waitTime };
  }
  
  // Add current request
  requestQueue.push(now);
  return { allowed: true };
}

// ✅ Health check route
app.get("/", (req, res) => {
  console.log("✅ Health check requested");
  res.json({
    status: "✅ Server is running!",
    apiKeySet: !!process.env.GEMINI_API_KEY,
    usingGemini: true,
    model: GEMINI_MODEL
  });
});

// 🧩 Universal AI Chat Endpoint (using Gemini with v1beta)
app.post("/api/chat", async (req, res) => {
  console.log("🎯 /api/chat endpoint hit!");
  
  // Check rate limit
  const rateLimitCheck = checkRateLimit();
  if (!rateLimitCheck.allowed) {
    console.log(`⏳ Rate limit: wait ${rateLimitCheck.waitTime}s`);
    return res.status(429).json({ 
      error: `Rate limit: Please wait ${rateLimitCheck.waitTime} seconds before trying again.`,
      waitTime: rateLimitCheck.waitTime
    });
  }
  
  const { prompt } = req.body;

  if (!prompt) {
    console.log("❌ Missing prompt in request");
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    console.log("📤 Sending prompt to Gemini:", prompt.slice(0, 80) + "...");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 4096,
          }
        }),
      }
    );

    const data = await response.json();
    console.log("🧠 Gemini response status:", response.status);
    console.log("🔍 Full response:", JSON.stringify(data, null, 2));

    if (data.error) {
      console.error("❌ Gemini API Error:", data.error);
      return res.status(400).json({ error: data.error.message });
    }

    // ✅ FIXED: Proper response parsing based on actual structure
    if (!data.candidates || !data.candidates[0]) {
      console.error("❌ No candidates in response:", data);
      return res.status(500).json({ error: "No response from AI" });
    }

    const candidate = data.candidates[0];
    console.log("🔍 Candidate:", JSON.stringify(candidate, null, 2));
    
    // Check if response was cut off
    if (candidate.finishReason === "MAX_TOKENS") {
      console.warn("⚠️ Response truncated due to MAX_TOKENS");
      return res.status(500).json({ 
        error: "Response was too long. Try a simpler question or request."
      });
    }
    
    const reply = candidate.content && candidate.content.parts && candidate.content.parts[0] && candidate.content.parts[0].text;

    if (!reply) {
      console.error("❌ No text in response. Candidate structure:", JSON.stringify(candidate, null, 2));
      return res.status(500).json({ 
        error: "Empty response from AI",
        debug: candidate 
      });
    }

    console.log("✅ AI Response Ready:", reply.slice(0, 100) + "...");
    return res.json({ reply });

  } catch (error) {
    console.error("❌ Backend Error:", error.message);
    return res.status(500).json({ error: "Failed to connect to Gemini: " + error.message });
  }
});

// ✅ Workout generation endpoint
app.post("/api/generate-workout", async (req, res) => {
  console.log("🎯 /api/generate-workout endpoint hit!");
  
  // Check rate limit
  const rateLimitCheck = checkRateLimit();
  if (!rateLimitCheck.allowed) {
    console.log(`⏳ Rate limit: wait ${rateLimitCheck.waitTime}s`);
    return res.status(429).json({ 
      error: `Rate limit: Please wait ${rateLimitCheck.waitTime} seconds before trying again.`,
      waitTime: rateLimitCheck.waitTime
    });
  }
  
  const { userProfile } = req.body;

  if (!userProfile) {
    console.log("❌ No userProfile provided");
    return res.status(400).json({ error: "userProfile is required" });
  }

  const prompt = `Create 3 workout plans for: ${userProfile.fitnessLevel} level, goal: ${userProfile.goal}.

Format as JSON only (no markdown):
{"workouts":[{"name":"Name","type":"cardio/strength/mixed","duration":30,"calories":200,"exercises":["Ex1 - 3x10","Ex2 - 2x15"]}]}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 4096,
          }
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      console.error("❌ Gemini Error:", data.error);
      return res.status(400).json({ error: data.error.message });
    }

    // ✅ FIXED: Proper response parsing
    const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    
    const cleanedContent = textContent
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    console.log("✅ Workout data sent successfully!");
    
    return res.json({
      choices: [{
        message: {
          content: cleanedContent
        }
      }]
    });

  } catch (error) {
    console.error("❌ Backend Error:", error.message);
    return res.status(500).json({ error: "Failed to connect to Gemini: " + error.message });
  }
});

// ✅ Coach advice endpoint
app.post("/api/coach-advice", async (req, res) => {
  console.log("🎯 /api/coach-advice endpoint hit!");
  
  // Check rate limit
  const rateLimitCheck = checkRateLimit();
  if (!rateLimitCheck.allowed) {
    console.log(`⏳ Rate limit: wait ${rateLimitCheck.waitTime}s`);
    return res.status(429).json({ 
      error: `Rate limit: Please wait ${rateLimitCheck.waitTime} seconds before trying again.`,
      waitTime: rateLimitCheck.waitTime
    });
  }
  
  const { question, userProfile } = req.body;

  if (!question || !userProfile) {
    console.log("❌ Missing question or userProfile");
    return res.status(400).json({ error: "question and userProfile are required" });
  }

  try {
    const prompt = `You are a helpful fitness coach. User is ${userProfile.fitnessLevel} level with goal: ${userProfile.goal}.

Question: ${question}

Give practical advice in 2-4 short paragraphs. Be specific and encouraging. Keep it under 150 words.`;
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          }
        }),
      }
    );

    const data = await response.json();
    
    if (data.error) {
      console.error("❌ Gemini Error:", data.error);
      return res.status(400).json({ error: data.error.message });
    }

    // ✅ FIXED: Proper response parsing
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";

    console.log("✅ Coach advice sent successfully!");
    
    return res.json({
      choices: [{
        message: {
          content: reply
        }
      }]
    });

  } catch (error) {
    console.error("❌ Backend Error:", error.message);
    return res.status(500).json({ error: "Failed to get coach advice: " + error.message });
  }
});

// 🧩 404 Handler - MUST BE LAST!
app.use((req, res) => {
  console.log("❌ 404 Not Found:", req.method, req.url);
  res.status(404).json({ error: "Endpoint not found" });
});

// ✅ Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`\n✅ Server running on http://localhost:${PORT}`);
  console.log(`✅ Gemini API Key set: ${!!process.env.GEMINI_API_KEY}`);
  console.log(`✅ Using model: ${GEMINI_MODEL}`);
  console.log(`\n📍 Available endpoints:`);
  console.log(`   GET  http://localhost:${PORT}/`);
  console.log(`   POST http://localhost:${PORT}/api/chat`);
  console.log(`   POST http://localhost:${PORT}/api/generate-workout`);
  console.log(`   POST http://localhost:${PORT}/api/coach-advice\n`);
});