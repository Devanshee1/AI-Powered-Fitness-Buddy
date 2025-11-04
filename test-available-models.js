import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

async function listAvailableModels() {
  try {
    console.log("🔍 Fetching available Gemini models...\n");
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
    );
    
    const data = await response.json();
    
    if (data.error) {
      console.error("❌ Error:", data.error.message);
      return;
    }
    
    console.log("✅ Available models:\n");
    
    data.models.forEach(model => {
      const modelName = model.name.split('/')[1];
      const supportsGenerate = model.supportedGenerationMethods?.includes('generateContent');
      
      if (supportsGenerate) {
        console.log(`✓ ${modelName}`);
        console.log(`  Description: ${model.displayName}`);
        console.log(`  Methods: ${model.supportedGenerationMethods.join(', ')}`);
        console.log();
      }
    });
    
    // Also list just the model names for easy copy-paste
    console.log("\n📋 Model names (for generateContent):");
    const generateModels = data.models
      .filter(m => m.supportedGenerationMethods?.includes('generateContent'))
      .map(m => m.name.split('/')[1]);
    
    console.log(generateModels.join('\n'));
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

listAvailableModels();