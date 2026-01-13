import OpenAI from "openai";
import 'dotenv/config'

const openai = new OpenAI({
    apiKey: "AIzaSyDhekcn0aWnEEd4v7OXd-rQ4nGT-9wajzo",
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

const response = await openai.chat.completions.create({
    model: "gemini-2.5-flash",
    messages: [
        {   role: "system",
            content: "You are a helpful assistant." 
        },
        {
            role: "user",
            content: "Explain to me how AI works",
        },
    ],
});

console.log(response.choices[0].message);