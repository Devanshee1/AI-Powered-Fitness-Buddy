// Helper function to wait
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Generate personalized workout plan
export const generateWorkout = async (userProfile) => {
  try {
    const prompt = `Create 3 personalized workout plans for a ${userProfile.fitnessLevel} person with goal: ${userProfile.goal}.

IMPORTANT: Return ONLY valid JSON with no markdown, no explanation, no extra text. Format:
{"workouts":[{"name":"Workout Name","type":"cardio","duration":30,"calories":250,"exercises":["Exercise 1 - 3x10","Exercise 2 - 2x15"]}]}`;

    const res = await fetch("http://localhost:5001/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();

    // Handle rate limit (HTTP 429)
    if (res.status === 429 && data.waitTime) {
      console.log(`⏳ Rate limited. Waiting ${data.waitTime} seconds...`);
      alert(`Please wait ${data.waitTime} seconds. The app is using the free API tier with rate limits.`);
      await wait(data.waitTime * 1000);
      // Retry after waiting
      return generateWorkout(userProfile);
    }

    // Handle general API errors
    if (data.error) {
      console.error("❌ API Error:", data.error);
      alert(`Error: ${data.error}`);
      return [];
    }

    const content = data.reply || "{}";

    // Remove Markdown-style JSON wrappers
    const cleanContent = content
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    // Parse JSON safely
    let workouts;
    try {
      workouts = JSON.parse(cleanContent);
    } catch (e) {
      console.error("❌ JSON Parse Error:", e, "\nResponse was:", cleanContent);
      
      // Try to extract JSON from text if parsing fails
      const jsonMatch = cleanContent.match(/\{[\s\S]*"workouts"[\s\S]*\}/);
      if (jsonMatch) {
        try {
          workouts = JSON.parse(jsonMatch[0]);
        } catch (e2) {
          console.error("❌ Could not extract JSON");
          return [];
        }
      } else {
        return [];
      }
    }

    return workouts.workouts || [];
  } catch (error) {
    console.error("AI Error:", error);
    return [];
  }
};

// Get AI-based coach advice with better formatting
export const getAICoachAdvice = async (question, userProfile) => {
  try {
    const prompt = `You are a fitness coach. User profile: ${userProfile.fitnessLevel} level, goal: ${userProfile.goal}.

Question: ${question}

Give concise, practical advice in 3-5 short paragraphs. Be encouraging and specific. Max 200 words.`;

    const res = await fetch("http://localhost:5001/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();

    // Handle rate limit
    if (res.status === 429 && data.waitTime) {
      console.log(`⏳ Rate limited. Waiting ${data.waitTime} seconds...`);
      return `⏳ Please wait ${data.waitTime} seconds before asking another question. (Free API tier has rate limits)`;
    }

    // Handle errors
    if (data.error) {
      console.error("❌ API Error:", data.error);
      return "I'm having trouble connecting. Please try again in a moment.";
    }

    let reply = data.reply || "No response from AI.";
    
    // Clean up the response - remove excessive formatting
    reply = reply
      .replace(/\*\*\*/g, '') // Remove triple asterisks
      .replace(/\*\*/g, '') // Remove double asterisks (bold)
      .replace(/###\s*/g, '') // Remove heading markers
      .replace(/---+/g, '') // Remove horizontal rules
      .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with double
      .trim();

    return reply;
  } catch (error) {
    console.error("AI Error:", error);
    return "I'm having trouble connecting. Please try again.";
  }
};