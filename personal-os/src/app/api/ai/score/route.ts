import { NextRequest, NextResponse } from "next/server";
import { callGemini } from "@/lib/gemini";
import { buildContextPacketFromData, buildScoringPacket, getScoringSystemPrompt } from "@/lib/ai-context";
import type { ScoreBreakdown } from "@/lib/scoring";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { breakdown, journalEntry = null, context: clientContext } = body as {
      breakdown: ScoreBreakdown;
      journalEntry: { content: string; wentWell: string | null; wentWrong: string | null } | null;
      context: Parameters<typeof buildContextPacketFromData>[0];
    };

    const contextPacket = buildContextPacketFromData(clientContext);
    const scoringPacket = buildScoringPacket(contextPacket, breakdown, journalEntry as never);
    const systemPrompt = getScoringSystemPrompt();
    const userMessage = JSON.stringify(scoringPacket);

    const rawResponse = await callGemini(systemPrompt, userMessage);

    // Parse JSON from response (handle markdown code fences)
    let parsed;
    try {
      const cleaned = rawResponse.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = {
        aiScore: breakdown.rawScore,
        confidence: 0.5,
        verdict: rawResponse.slice(0, 200),
        positives: [],
        negatives: [],
        tomorrowActions: [],
      };
    }

    return NextResponse.json({
      aiScore: parsed.aiScore,
      confidence: parsed.confidence,
      verdict: parsed.verdict,
      positives: parsed.positives,
      negatives: parsed.negatives,
      tomorrowActions: parsed.tomorrowActions,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "AI scoring failed";
    console.error("AI Score error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
