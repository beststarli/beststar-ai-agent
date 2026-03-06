// app/api/chat/route.ts
import { createOpenAI } from '@ai-sdk/openai';
import { convertToModelMessages, stepCountIs, streamText, UIMessage } from 'ai';
import { createSearchTool, weatherTool } from '@/lib/skills';

export async function POST(req: Request) {
    const deepseekApiKey = process.env.DEEPSEEK_API_KEY;
    const tavilyApiKey = process.env.TAVILY_API_KEY;

    if (!deepseekApiKey) {
        return new Response('DEEPSEEK_API_KEY 未配置', { status: 500 });
    }

    const deepseek = createOpenAI({
        baseURL: 'https://api.deepseek.com/v1',
        apiKey: deepseekApiKey,
    });

    const { messages }: { messages: UIMessage[] } = await req.json();
    const searchTool = createSearchTool(tavilyApiKey);

    const tools = {
        getWeather: weatherTool,
        webSearch: searchTool,
    };

    const result = streamText({
        model: deepseek.chat('deepseek-chat'),
        messages: await convertToModelMessages(messages, { tools }),
        tools,
        stopWhen: stepCountIs(5),
    });

    return result.toUIMessageStreamResponse();
}