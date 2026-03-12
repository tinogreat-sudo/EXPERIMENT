import { NextRequest, NextResponse } from "next/server";
import { callGemini } from "@/lib/gemini";
import { buildContextPacketFromData, getSystemPrompt } from "@/lib/ai-context";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type = "day", context: clientContext } = body as {
      type: "day" | "week";
      context: Parameters<typeof buildContextPacketFromData>[0];
    };

    const contextPacket = buildContextPacketFromData(clientContext);
    const systemPrompt = getSystemPrompt("review", contextPacket);
    const userMessage = type === "day"
      ? "Summarize my day so far. What went well, what didn't, and what should I focus on next?"
      : "Summarize my week. Identify patterns, wins, areas for improvement, and suggest priorities for next week.";

    const response = await callGemini(systemPrompt, userMessage);
    return NextResponse.json({ summary: response, type });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "AI summary failed";
    console.error("AI Summary error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
