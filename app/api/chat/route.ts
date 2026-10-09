// app/api/chat/route.ts
import { NextResponse } from "next/server";
import { agentGraph } from "../../../lib/agent/graph"; // Adjust path if needed!

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    // 1. Set up the exact same initial memory array
    const initialState = {
      messages: [
        {
          role: "system",
          content:
            "You are WicketWise, an AI cricket fantasy assistant. Use the tools provided to answer.",
        },
        { role: "user", content: message },
      ],
    };

    // 2. We trigger our State Graph!
    // It will loop automatically in the background until the LLM returns text.
    const finalState = await agentGraph.invoke(initialState);

    // 3. Grab the very last message in the array (the final text answer)
    const finalMessage = finalState.messages[finalState.messages.length - 1];

    return NextResponse.json({ reply: finalMessage.content });
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
