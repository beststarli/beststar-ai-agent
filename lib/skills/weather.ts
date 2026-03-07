import { jsonSchema, tool } from 'ai';

export const weatherTool = tool({
    description: '查询指定城市的实时天气', 
    inputSchema: jsonSchema<{ city: string }>({
        type: 'object',
        properties: {
            city: {
                type: 'string',
                description: '城市名称，例如：北京、上海',
            },
        },
        required: ['city'],
        additionalProperties: false,
    }),
    execute: async ({ city }) => {
        console.log(`正在为用户查询 ${city} 的天气...`);

        const mockTemp = Math.floor(Math.random() * 30);
        return {
            location: city,
            temperature: mockTemp,
            unit: '摄氏度',
            condition: '晴朗',
        };
    },
});