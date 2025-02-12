import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { question } = await req.json();
    
    console.log("Mottatt spørsmål:", question);  // 🔍 Debug

    if (!question) {
      return NextResponse.json({ error: "No question provided" }, { status: 400 });
    }

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4-turbo",
        messages: [{ role: "user", content: question }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Gemini API-svar:", response.data);  // 🔍 Debug

    return NextResponse.json({ answer: response.data.choices[0].message.content });

  } catch (error: any) {
    console.error("Feil i API-kallet:", error.response?.data || error.message);  // 🔍 Debug
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
