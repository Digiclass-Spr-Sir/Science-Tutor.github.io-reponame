import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";
import { v4 as uuidv4 } from 'uuid';

const getClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API_KEY is missing");
    }
    return new GoogleGenAI({ apiKey });
};

export const parseQuestionsFromText = async (text: string): Promise<Question[]> => {
    try {
        const ai = getClient();
        
        // Define the schema for the expected output
        const responseSchema = {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    text: { type: Type.STRING, description: "The question text in English or Bengali" },
                    options: { 
                        type: Type.ARRAY, 
                        items: { type: Type.STRING },
                        description: "An array of 4 possible answers"
                    },
                    correctAnswer: { 
                        type: Type.INTEGER, 
                        description: "The index (0-3) of the correct answer in the options array" 
                    }
                },
                required: ["text", "options", "correctAnswer"]
            }
        };

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Parse the following text and extract multiple choice questions. 
            The text may contain questions in English or Bengali. 
            Ensure strictly 4 options per question. 
            If the correct answer isn't explicitly marked, infer the most logical one.
            
            Text to parse:
            ${text}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });

        const rawQuestions = JSON.parse(response.text || "[]");

        // Map to internal Question type with UUIDs
        return rawQuestions.map((q: any) => ({
            id: uuidv4(),
            text: q.text,
            options: q.options,
            correctAnswer: q.correctAnswer,
        }));

    } catch (error) {
        console.error("Error parsing questions with Gemini:", error);
        throw error;
    }
};