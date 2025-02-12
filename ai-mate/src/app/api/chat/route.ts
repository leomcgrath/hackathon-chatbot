import { NextResponse } from "next/server";
import axios from "axios";

const WEAVIATE_URL = "https://atlefruxq9spq9c64mtlq.c0.europe-west3.gcp.weaviate.cloud/v1/graphql";
const API_KEY = "kbyDJzpwm2K9VDTKhpL51aFxV6iV242XqfT";

export async function POST(req: Request) {
    try {
        const { message } = await req.json();

        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        const query = {
            query: `
            {
              Get {
                Abakus(
                  nearText: { concepts: ["${message}"] }
                  limit: 1
                ) {
                  name
                  description
                }
              }
            }`,
        };

        const response = await axios.post(WEAVIATE_URL, query, {
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
            },
        });

        const results = response.data.data.Get.Abakus;

        if (!results || results.length === 0) {
            return NextResponse.json({ reply: "Beklager, jeg fant ingen relevante svar." });
        }

        return NextResponse.json({ reply: results[0].description });

    } catch (error) {
        console.error("Feil i Weaviate-forespørsel:", error);
        return NextResponse.json({ error: "Noe gikk galt, prøv igjen senere." }, { status: 500 });
    }
}
