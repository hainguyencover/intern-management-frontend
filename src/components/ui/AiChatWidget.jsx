import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, Sparkles } from "lucide-react";
import aiApi from "@/api/aiApi";
import { toast } from "sonner";
import { clsx } from "clsx";

const AiChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: "assistant", content: "Chào bạn! Tôi là DevMind AI. Tôi có thể giúp gì được cho bạn về quy trình thực tập hoặc chính sách công ty không?" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = { role: "user", content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await aiApi.chat(input);
            const botMsg = { role: "assistant", content: response.data.data };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error("Chat error:", error);
            toast.error("AI Assistant đang gặp sự cố, vui lòng thử lại sau.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 flex h-[500px] w-[380px] flex-col overflow-hidden rounded-2xl border border-white/20 bg-white/80 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-300">
                    {/* Header */}
                    <div className="flex items-center justify-between bg-gradient-to-r from-indigo-600 to-violet-600 p-4 text-white">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                                <Bot size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold leading-none">DevMind Assistant</h3>
                                <span className="text-[10px] opacity-80 uppercase tracking-wider">AI Powered Agent</span>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="rounded-full p-1 hover:bg-white/20"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages Body */}
                    <div 
                        ref={scrollRef}
                        className="flex-1 space-y-4 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-indigo-200"
                    >
                        {messages.map((msg, i) => (
                            <div 
                                key={i} 
                                className={clsx(
                                    "flex w-full animate-in fade-in duration-500",
                                    msg.role === "user" ? "justify-end" : "justify-start"
                                )}
                            >
                                <div className={clsx(
                                    "flex max-w-[85%] gap-2",
                                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                                )}>
                                    <div className={clsx(
                                        "mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px]",
                                        msg.role === "user" ? "bg-indigo-100 text-indigo-600" : "bg-violet-100 text-violet-600"
                                    )}>
                                        {msg.role === "user" ? <User size={14} /> : <Sparkles size={14} />}
                                    </div>
                                    <div className={clsx(
                                        "rounded-2xl px-4 py-2 text-sm shadow-sm",
                                        msg.role === "user" 
                                            ? "bg-indigo-600 text-white rounded-tr-none" 
                                            : "bg-slate-100 text-slate-800 rounded-tl-none"
                                    )}>
                                        {msg.content}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start animate-pulse">
                                <div className="flex max-w-[85%] gap-2">
                                     <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                                        <Bot size={14} />
                                     </div>
                                     <div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm text-slate-500 rounded-tl-none">
                                        Đang suy nghĩ...
                                     </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer Input */}
                    <div className="border-t bg-slate-50 p-4">
                        <div className="flex gap-2">
                            <input 
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                placeholder="Hỏi tôi về chính sách công ty..."
                                className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                            />
                            <button 
                                onClick={handleSend}
                                disabled={isLoading || !input.trim()}
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg transition-transform hover:scale-110 active:scale-95 disabled:opacity-50"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={clsx(
                    "flex h-14 w-14 items-center justify-center rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95",
                    isOpen ? "bg-white text-indigo-600" : "bg-indigo-600 text-white"
                )}
            >
                {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex h-4 w-4 rounded-full bg-indigo-500"></span>
                    </span>
                )}
            </button>
        </div>
    );
};

export default AiChatWidget;
