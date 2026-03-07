import { jsonSchema, tool } from 'ai';

export function createSearchTool(tavilyApiKey?: string) {
    return tool({
        description: '搜索互联网以获取最新的新闻、实时信息或详细的百科知识。',
        inputSchema: jsonSchema<{ query: string }>({
            type: 'object',
            properties: {
                query: {
                    type: 'string',
                    description: '搜索关键词',
                },
            },
            required: ['query'],
            additionalProperties: false,
        }),
        execute: async ({ query }) => {
            console.log(`正在为用户搜索: ${query}...`);

            if (!tavilyApiKey) {
                throw new Error('TAVILY_API_KEY 未配置');
            }

            const response = await fetch('https://api.tavily.com/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    api_key: tavilyApiKey,
                    query,
                    search_depth: 'basic',
                    max_results: 5,
                }),
            });

            if (!response.ok) {
                throw new Error(`Tavily 请求失败: ${response.status}`);
            }

            const data = (await response.json()) as {
                results?: Array<{
                    title?: string;
                    url?: string;
                    content?: string;
                }>;
            };

            return (data.results ?? []).map((item) => ({
                title: item.title,
                url: item.url,
                content: item.content,
            }));
        },
    });
}