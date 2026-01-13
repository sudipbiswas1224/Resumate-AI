import { GoogleGenAI } from '@google/genai'
// import OpenAI from "openai";

// const ai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY,
//     baseURL: process.env.OPENAI_BASE_URL,
//     defaultHeaders: {
//         'Content-Type': 'application/json'
//     }
// });

// export default ai;



const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
})

const getAIResponse = async (userContent, systemPrompt) => {

    const response = await ai.models.generateContent({
        model: process.env.GEMINI_MODEL,
        contents: userContent,
        config: {
            systemInstruction: systemPrompt,
        },

    });
    // console.log(response.text)
    return (response.text);

}

export default getAIResponse;

