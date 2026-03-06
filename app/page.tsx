'use client';

import { FormEvent, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { getToolName, isToolUIPart } from 'ai';

export default function Home() {
    const { messages, sendMessage } = useChat();
    const [input, setInput] = useState('');

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const text = input.trim();
        if (!text) return;

        setInput('');
        await sendMessage({ text });
    };

    return (
        <div className='bg-slate-100 flex items-center justify-center w-screen h-screen'>
            <div className="bg-white flex flex-col items-center w-full h-[90%] -mt-16 max-w-2xl  mx-auto stretch rounded-xl shadow-lg overflow-hidden">
                <div className=' w-full p-6 border-b border-gray-300 rounded-t-2xl shadow-md bg-sky-400'>
                    <h1 className="text-3xl text-white font-bold mb-4 text-shadow-lg">李嘉星的个人 AI Agent</h1>
                    <div className="text-white font-semibold">试试问问南京的天气怎么样？</div>
                    <div className="text-white font-semibold">在输入框输下问题吧！</div>
                </div>

                <div className='w-full flex-1 overflow-y-auto scrollbar-hide items-start px-4'>
                    <div className="flex-1 items-start w-full mb-4 mt-4">
                        {messages.map((m) => (
                            <div key={m.id} className={`flex items-start gap-2 mb-4 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {m.role !== 'user' && (
                                    <div className="w-10 h-10 rounded-full bg-sky-500 text-white text-lg font-semibold flex items-center justify-center shrink-0">
                                        AI
                                    </div>
                                )}

                                <div className={`whitespace-pre-wrap mt-2 p-3 rounded-b-2xl max-w-[65%] ${m.role === 'user' ? 'bg-slate-100 rounded-tl-2xl' : 'rounded-tr-2xl bg-sky-200'} shadow-md`}>
                                    {/* <strong className={`block text-sm ${m.role === 'user' ? 'text-blue-600' : 'text-white'}`}>{m.role === 'user' ? '你' : 'AI'}</strong> */}
                                    {m.parts.map((part, index) => {
                                        if (part.type === 'text') {
                                            return <div key={`${m.id}-${index}`}>{part.text}</div>;
                                        }

                                        if (isToolUIPart(part)) {
                                            const toolName = getToolName(part);
                                            const toolLabel = toolName === 'webSearch' ? '联网搜索' : '查询天气';

                                            if (part.state === 'output-available') {
                                                return (
                                                    <div key={part.toolCallId} className="text-xs text-emerald-700 italic my-2">
                                                        ✅ 技能已完成: {toolLabel}
                                                    </div>
                                                );
                                            }

                                            if (part.state === 'output-error' || part.state === 'output-denied') {
                                                return (
                                                    <div key={part.toolCallId} className="text-xs text-red-600 italic my-2">
                                                        ❌ 技能执行失败: {toolLabel}
                                                    </div>
                                                );
                                            }

                                            return (
                                                <div key={part.toolCallId} className="text-xs text-gray-500 italic my-2">
                                                    🔍 AI 正在尝试使用技能: {toolLabel}...
                                                </div>
                                            );
                                        }

                                        return null;
                                    })}
                                </div>

                                {m.role === 'user' && (
                                    <div className="w-10 h-10 rounded-full bg-amber-400 text-white text-lg font-semibold flex items-center justify-center shrink-0">
                                        星
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <div className='w-full bg-white h-16 items-start px-4 shadow-[0_-10px_28px_rgba(255,255,255,0.9)]'>
                </div>


                <form onSubmit={handleSubmit} className="fixed bg-gray-50 bottom-16 w-[28%] rounded-2xl p-2 mb-8 border-2 border-gray-200 shadow-xl">
                    <input
                        className="w-full p-1 outline-none"
                        value={input}
                        placeholder="问问南京的天气..."
                        onChange={(event) => setInput(event.target.value)}
                    />
                </form>
            </div>
        </div>

    );
}
