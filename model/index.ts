import { ModelOption } from "./types";

export const modelOptions: ModelOption[] = [
    // {
    //     id: 'deepseek',
    //     name: 'DeepSeek'
    // },
    {
        id: 'deepseek-v4',
        name: 'DeepSeek-v4',
        tiers: [
            { id: 'flash', name: 'Flash' },
            { id: 'pro', name: 'Pro' },
        ],
    },
];

export function getActiveModel(
    modelId: string,
    // deepThinkingEnabled: boolean,
    v4Tier: string,
): string {
    if (modelId === 'deepseek-v4') {
        return v4Tier === 'pro' ? 'deepseek-v4-pro' : 'deepseek-v4-flash';
    }

    return modelId;
}
