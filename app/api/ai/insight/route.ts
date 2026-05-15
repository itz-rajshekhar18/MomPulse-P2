import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { stage, insightType, contextData } = await request.json();

    const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenRouter API key not configured' },
        { status: 500 }
      );
    }

    // Create system prompt based on insight type
    const systemPrompt = `You are a compassionate, expert AI assistant for MomPulse, specializing in maternal health and wellness.
    You are generating a short, supportive insight for a user in the "${stage}" stage.
    The type of insight requested is: "${insightType}".
    
    Here is the user's latest context data (use this to make the insight highly personalized):
    ${JSON.stringify(contextData)}
    
    CRITICAL INSTRUCTIONS:
    1. Be warm, supportive, and empathetic.
    2. Keep the insight very concise (2-3 short sentences max).
    3. Make it highly personalized based on their context data (e.g. if they are low energy, suggest rest; if they are week 24, mention baby development).
    4. You MUST respond with ONLY a valid JSON object in the exact following format, with no markdown formatting around it:
    {
      "title": "A short, catchy title (e.g. 'You're doing great!' or 'Time to rest')",
      "message": "Your 2-3 sentence personalized insight.",
      "icon": "A single relevant emoji (e.g. 💜 or ⚡ or 🥑)"
    }`;

    // Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'MomPulse AI Insights',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini', // Reliable, cost-effective, good at JSON
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: "Generate my personalized insight."
          }
        ],
        temperature: 0.7,
        max_tokens: 150,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenRouter API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to generate AI insight' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const contentString = data.choices[0]?.message?.content;
    
    if (!contentString) {
      throw new Error("No content received from AI");
    }

    // Parse the JSON response
    const insightData = JSON.parse(contentString);

    return NextResponse.json({ 
      title: insightData.title || "Your Daily Insight",
      message: insightData.message || "Take a moment to breathe and focus on your wellness today.",
      icon: insightData.icon || "✨"
    });

  } catch (error) {
    console.error('Insight Generation API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
