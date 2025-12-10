import { GoogleGenAI, Type } from "@google/genai";
import { LevelData, GameConcept, MarketingData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateLevelData = async (levelNumber: number): Promise<LevelData> => {
  const model = "gemini-2.5-flash";
  
  // Increase difficulty slightly by grid size based on level
  const gridSize = levelNumber <= 2 ? 3 : 4; 

  const response = await ai.models.generateContent({
    model,
    contents: `Generate a creative theme for a casual puzzle game level (Level ${levelNumber}).
    Language: Russian.
    Also provide a palette of 4 hex color codes that match the theme.
    Also provide a short "Fun Fact" or "Positive Affirmation" in Russian related to the theme as a reward for solving it.
    The theme should be relaxing (e.g., "Forest Rain", "Space Walk", "Cat Cafe").`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          theme: { type: Type.STRING, description: "Title of the level theme in Russian" },
          colors: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Array of 4 hex color strings" 
          },
          funFact: { type: Type.STRING, description: "A rewarding fun fact or message in Russian" }
        },
        required: ["theme", "colors", "funFact"]
      }
    }
  });

  if (response.text) {
    const data = JSON.parse(response.text);
    return {
      id: levelNumber,
      gridSize,
      ...data
    };
  }
  
  // Fallback if AI fails
  return {
    id: levelNumber,
    theme: "Уютный вечер",
    colors: ["#FFD166", "#06D6A0", "#118AB2", "#EF476F"],
    funFact: "Пазлы помогают снизить уровень стресса!",
    gridSize: 3
  };
};

export const generateGameConcept = async (theme: string): Promise<GameConcept> => {
  const model = "gemini-2.5-flash";
  const response = await ai.models.generateContent({
    model,
    contents: `Generate a casual puzzle game concept based on the theme: "${theme}".
    Language: Russian.
    Provide a catchy title, a tagline, a description of the fun factor, the core mechanic, and the visual style.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          tagline: { type: Type.STRING },
          funFactor: { type: Type.STRING },
          coreMechanic: { type: Type.STRING },
          visualStyle: { type: Type.STRING },
        },
        required: ["title", "tagline", "funFactor", "coreMechanic", "visualStyle"]
      }
    }
  });

  if (response.text) {
    return JSON.parse(response.text) as GameConcept;
  }

  throw new Error("Failed to generate concept");
};

export const generateMarketingStrategy = async (concept: GameConcept): Promise<MarketingData> => {
  const model = "gemini-2.5-flash";
  const response = await ai.models.generateContent({
    model,
    contents: `Generate a marketing strategy for a mobile game.
    Game Title: ${concept.title}
    Description: ${concept.coreMechanic}
    Language: Russian.
    Provide an ad headline, a social media post text, target audience description, and monetization strategy.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          headline: { type: Type.STRING },
          socialPost: { type: Type.STRING },
          targetAudience: { type: Type.STRING },
          monetizationStrategy: { type: Type.STRING },
        },
        required: ["headline", "socialPost", "targetAudience", "monetizationStrategy"]
      }
    }
  });

  if (response.text) {
    return JSON.parse(response.text) as MarketingData;
  }
  
  throw new Error("Failed to generate marketing data");
};
