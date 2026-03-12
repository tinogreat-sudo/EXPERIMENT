import { NextRequest, NextResponse } from "next/server";
import { callGemini, type ChatHistoryMessage } from "@/lib/gemini";
import { buildContextPacketFromData, getSystemPrompt } from "@/lib/ai-context";
import type { AIChatMode } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      message,
      mode = "general",
      context: clientContext,
      history: clientHistory = [],
    } = body as {
      message: string;
      mode: AIChatMode;
      context: Parameters<typeof buildContextPacketFromData>[0];
      history?: { role: "user" | "assistant"; content: string }[];
    };

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const contextPacket = buildContextPacketFromData(clientContext);
    const systemPrompt = getSystemPrompt(mode, contextPacket);

    // Convert client history to Gemini format (user → user, assistant → model)
    const geminiHistory: ChatHistoryMessage[] = clientHistory.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const response = await callGemini(systemPrompt, message, undefined, geminiHistory);

    return NextResponse.json({ response, mode });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "AI request failed";
    console.error("AI Chat error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
