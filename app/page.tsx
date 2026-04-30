'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { getToolName, isToolUIPart } from 'ai';

export default function Home() {
    const [deepThinkingEnabled, setDeepThinkingEnabled] = useState(true);
    const [webSearchEnabled, setWebSearchEnabled] = useState(true);
    const { messages, sendMessage } = useChat();
    const [input, setInput] = useState('');
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const activeModel = deepThinkingEnabled ? 'deepseek-reasoner' : 'deepseek-chat';

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;
        container.scrollTop = container.scrollHeight;
    }, [messages]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const text = input.trim();
        if (!text) return;

        setInput('');
        await sendMessage({
            text,
        }, {
            body: {
                model: activeModel,
                webSearchEnabled,
                deepThinkingEnabled,
            },
        });
    };

    return (
        <div className="h-screen bg-slate-100 px-4 py-4 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
            <div className="mx-auto grid h-[calc(100vh-2rem)] w-full max-w-7xl gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
                <section className="flex min-h-[calc(100vh-2rem)] flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-2xl backdrop-blur dark:border-slate-700/60 dark:bg-slate-900/92">
                    <div className="w-full border-b border-white/20 bg-linear-to-r from-sky-500 via-cyan-500 to-sky-400 px-6 py-5 text-white  dark:from-sky-500 dark:via-cyan-400 dark:to-cyan-500 dark:shadow-[0_16px_40px_rgba(2,132,199,0.22)]">
                        <h1 className="mb-2 text-3xl font-bold tracking-tight">
                            李嘉星的个人 AI Agent
                        </h1>
                        <div className="text-sm font-medium text-white/90">试试询问他南京的天气怎么样？</div>
                        <div className="text-sm font-medium text-white/90">在输入框中输下问题吧！</div>
                    </div>

                    <div ref={scrollContainerRef} className="flex-1 overflow-y-auto scrollbar-hide px-4 py-5">
                        {messages.length === 0 ? (
                            <div className="mt-4 flex items-center justify-center text-sm text-slate-400 dark:text-slate-500">
                                向我提问吧！😊
                            </div>
                        ) : null}

                        <div className="flex w-full flex-1 flex-col gap-4">
                            {messages.map((m) => (
                                <div key={m.id} className={`flex items-start gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    {m.role !== 'user' && (
                                        <div className="mt-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-500 text-lg font-semibold text-white shadow-lg shadow-sky-500/25">
                                            AI
                                        </div>
                                    )}

                                    <div className={`mt-2 max-w-[78%] whitespace-pre-wrap rounded-3xl px-4 py-3 shadow-lg ${m.role === 'user' ? 'rounded-tl-2xl rounded-br-md bg-slate-100 text-slate-900 dark:bg-slate-700/80 dark:text-slate-100' : 'rounded-tr-2xl rounded-bl-md bg-sky-200 text-slate-900 dark:bg-sky-950/60 dark:text-slate-100'}`}>
                                        {m.parts.some((part) => isToolUIPart(part)) ? (
                                            <div className="mb-2 flex flex-wrap gap-2 border-b border-sky-200/70 pb-2 text-[11px] font-semibold text-sky-700 dark:border-sky-500/20 dark:text-sky-300">
                                                {m.parts.map((part) => {
                                                    if (!isToolUIPart(part)) {
                                                        return null;
                                                    }

                                                    const toolName = getToolName(part);
                                                    const toolLabel = toolName === 'webSearch' ? '联网搜索' : '查询天气';

                                                    if (part.state === 'output-available') {
                                                        return (
                                                            <span key={part.toolCallId} className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-1 text-emerald-700 dark:text-emerald-300">
                                                                ✅ 已完成 {toolLabel}
                                                            </span>
                                                        );
                                                    }

                                                    if (part.state === 'output-error' || part.state === 'output-denied') {
                                                        return (
                                                            <span key={part.toolCallId} className="inline-flex items-center rounded-full bg-red-500/10 px-2.5 py-1 text-red-700 dark:text-red-300">
                                                                ❌ 失败 {toolLabel}
                                                            </span>
                                                        );
                                                    }

                                                    return (
                                                        <span key={part.toolCallId} className="inline-flex items-center rounded-full bg-sky-500/10 px-2.5 py-1 text-sky-700 dark:text-sky-300">
                                                            🔍 正在使用 {toolLabel}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        ) : null}

                                        {m.parts.map((part, index) => {
                                            if (part.type === 'text') {
                                                return <div key={`${m.id}-${index}`}>{part.text}</div>;
                                            }

                                            if (isToolUIPart(part)) {
                                                return null;
                                            }

                                            return null;
                                        })}
                                    </div>

                                    {m.role === 'user' && (
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-400 text-lg font-semibold text-white shadow-lg shadow-amber-400/25">
                                            星
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className=" bg-white/90 px-6 pb-4 backdrop-blur-md dark:border-slate-700/70 dark:bg-slate-900/90">
                        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200/80 bg-white/95 px-4 py-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-md dark:border-slate-700/70 dark:bg-slate-900/90">
                            <div className="mb-3 flex flex-wrap items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setDeepThinkingEnabled((current) => !current)}
                                    className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold transition ${deepThinkingEnabled ? 'border-sky-500 bg-sky-500/10 text-sky-700 dark:border-sky-400 dark:bg-sky-500/20 dark:text-sky-200' : 'border-slate-200 bg-white text-slate-500 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-400'}`}
                                    aria-pressed={deepThinkingEnabled}
                                    aria-label="切换深度思考"
                                >
                                    <span className={`h-2.5 w-2.5 rounded-full ${deepThinkingEnabled ? 'bg-sky-500 dark:bg-sky-400' : 'bg-slate-300 dark:bg-slate-600'}`} />
                                    深度思考
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setWebSearchEnabled((current) => !current)}
                                    className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold transition ${webSearchEnabled ? 'border-sky-500 bg-sky-500/10 text-sky-700 dark:border-sky-400 dark:bg-sky-500/20 dark:text-sky-200' : 'border-slate-200 bg-white text-slate-500 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-400'}`}
                                    aria-pressed={webSearchEnabled}
                                    aria-label="切换联网搜索"
                                >
                                    <span className={`h-2.5 w-2.5 rounded-full ${webSearchEnabled ? 'bg-sky-500 dark:bg-sky-400' : 'bg-slate-300 dark:bg-slate-600'}`} />
                                    联网搜索
                                </button>

                                <div className="ml-auto text-xs font-medium text-slate-400 dark:text-slate-500">
                                    当前模型: {deepThinkingEnabled ? activeModel : 'deepseek-chat'}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 rounded-[22px] border border-slate-200/90 bg-white/95 px-4 py-2 dark:border-slate-700/70 dark:bg-slate-800">
                                <input
                                    className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                    value={input}
                                    placeholder="问问南京的天气..."
                                    onChange={(event) => setInput(event.target.value)}
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim()}
                                    className="shrink-0 rounded-2xl border border-sky-600 bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-sky-500 dark:bg-sky-500 dark:hover:bg-sky-400"
                                    aria-label="发送"
                                    title="发送"
                                >
                                    发送↵
                                </button>
                            </div>
                        </form>
                    </div>
                </section>

                <aside className="flex min-h-60 flex-col gap-4 rounded-4xl border border-slate-200/80 bg-white/95 p-5 shadow-xl backdrop-blur dark:border-slate-700/60 dark:bg-slate-900/88">
                    <div>
                        <div className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-500 dark:text-sky-400">Control Panel</div>
                        <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">模型控制</h2>
                        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                            这里先作为右侧控制区，后续可以接入更多运行参数和调试信息。
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/70">
                        <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">当前模型</div>
                        <div className="mt-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
                            {activeModel === 'deepseek-reasoner' ? 'DeepSeek Reasoner' : 'DeepSeek Chat'}
                        </div>
                    </div>

                    <div className="grid gap-3">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/70">
                            <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">面板说明</div>
                            <div className="mt-3 space-y-3 text-sm text-slate-500 dark:text-slate-400">
                                <div className="flex items-center justify-between">
                                    <span>切换模型</span>
                                    <span>可用</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>工具调用</span>
                                    <span>开启</span>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-dashed border-sky-200 bg-sky-50 p-4 text-sm text-sky-700 dark:border-sky-400/30 dark:bg-sky-500/10 dark:text-sky-300">
                            后续可以在这里接入更多模型选项、开关按钮和调试信息。
                        </div>
                    </div>
                </aside>
            </div>
        </div>

    );
}
