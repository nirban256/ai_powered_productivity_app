import { db } from "@/lib/db";
import { getCurrentUserOrThrow } from "@/lib/get-user";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const session = await getCurrentUserOrThrow();

        const { prompt } = await req.json();

        if (!prompt) return new NextResponse("Prompt is required", { status: 404 });

        const user = await db.user.findMany({ where: { email: session.email } });
        if (!user) {
            return new NextResponse("User does not exist!", { status: 404 });
        }

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "mistralai/mistral-7b-instruct:free",
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful assistant that provides suggestions to improve productivity tasks."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ]
            })
        });

        const data = await response.json();

        const messageContent = data.choices?.[0]?.message?.content;
        if (!messageContent) {
            console.error("Unexpected AI response:", JSON.stringify(data, null, 2));
            return new NextResponse("Error getting response" + JSON.stringify(data, null, 2), { status: 500 });
        }

        await db.suggestion.create({
            data: {
                suggestion: messageContent,
                prompt: prompt,
                createdAt: new Date(),
                userId: (await session).id
            }
        });

        return NextResponse.json(data);
    } catch (error) {
        console.error("Error generating ai response", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const session = await getCurrentUserOrThrow();

        if (session.email !== "nirban256@gmail.com") {
            return new NextResponse("You are unauthorized", { status: 401 });
        }

        const suggestions = await db.suggestion.findMany();

        return NextResponse.json(suggestions);
    } catch (error) {
        console.error("Error generating ai response", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}