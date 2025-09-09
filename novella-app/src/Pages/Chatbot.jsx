import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InvokeLLM } from "@/integrations/Core";
import RealisticButterfly from "../components/dating/RealisticButterfly";

export default function Chatbot() {
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: "amora",
            content: "Hello! I'm Amora, your guide in this garden of connections 🦋. I'm here to help your story unfold. What's on your heart today?",
            timestamp: new Date()
        }
    ]);
    const [inputText, setInputText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (!inputText.trim()) return;

        const userMessage = {
            id: Date.now(),
            sender: "user",
            content: inputText,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText("");
        setIsLoading(true);

        try {
            const conversationContext = messages
                .slice(-6)
                .map(msg => `${msg.sender === 'user' ? 'User' : 'Amora'}: ${msg.content}`)
                .join('\n');

            const response = await InvokeLLM({
                prompt: `You are Amora, a wise, empathetic AI companion for a romantic dating app called Novella. You help users with dating advice, emotional support, and relationship guidance. You're warm, understanding, and use gentle butterfly and storytelling metaphors naturally. Be supportive and insightful.

Previous conversation:
${conversationContext}

User just said: ${inputText}

Respond as their caring companion who understands the complexities of modern romance. Keep responses conversational and supportive (2-3 sentences max).`,
            });

            const amoraMessage = {
                id: Date.now() + 1,
                sender: "amora",
                content: response,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, amoraMessage]);
        } catch (error) {
            console.error('Error getting Amora response:', error);
            const errorMessage = {
                id: Date.now() + 1,
                sender: "amora", 
                content: "I'm having trouble connecting right now, but I'm still here for you. Sometimes even butterflies need a moment to rest their wings. 💙",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        }

        setIsLoading(false);
    };

    const quickTopics = [
        "I'm nervous about messaging someone",
        "How do I start a good conversation?", 
        "I'm feeling lonely lately",
        "What if they don't like me back?",
        "I need confidence tips"
    ];

    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
            {/* Header */}
            <header className="p-4 bg-black/30 backdrop-blur-xl border-b border-purple-500/30">
                <div className="text-center">
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <RealisticButterfly size="small" bpm={70} species="morpho" />
                        <h1 className="text-xl font-bold text-white italic">Amora</h1>
                        <RealisticButterfly size="small" bpm={75} species="swallowtail" />
                    </div>
                    <p className="text-purple-300 text-sm italic">Your wise friend for matters of the heart</p>
                </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                            <div
                                className={`px-4 py-3 rounded-2xl shadow-lg ${
                                    message.sender === 'user'
                                        ? 'bg-purple-600 text-white rounded-br-sm'
                                        : 'bg-white/10 backdrop-blur-sm text-purple-100 rounded-bl-sm border border-purple-300/20'
                                }`}
                            >
                                <p className="italic leading-relaxed">{message.content}</p>
                                <p className={`text-xs mt-2 opacity-70 ${message.sender === 'user' ? 'text-purple-200' : 'text-purple-300'}`}>
                                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                        
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${message.sender === 'user' ? 'order-1 ml-3' : 'order-2 mr-3'}`}>
                            {message.sender === 'user' ? (
                                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-sm italic">You</span>
                                </div>
                            ) : (
                                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
                
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl rounded-bl-sm px-4 py-3 border border-purple-300/20">
                                <div className="flex gap-1">
                                    {[0, 1, 2].map((i) => (
                                        <motion.div
                                            key={i}
                                            className="w-2 h-2 bg-purple-400 rounded-full"
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{
                                                duration: 0.6,
                                                repeat: Infinity,
                                                delay: i * 0.2
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
                
                <div ref={messagesEndRef} />
            </div>

            {/* Quick Topics */}
            {messages.length <= 1 && (
                <div className="px-4 pb-2">
                    <p className="text-purple-300 text-sm mb-3 italic">Quick topics to explore:</p>
                    <div className="flex flex-wrap gap-2">
                        {quickTopics.map((topic, index) => (
                            <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                onClick={() => setInputText(topic)}
                                className="bg-white/5 border-purple-400/30 text-purple-200 hover:bg-white/10 text-xs italic"
                            >
                                {topic}
                            </Button>
                        ))}
                    </div>
                </div>
            )}

            {/* Input */}
            <div className="p-4 bg-black/30 backdrop-blur-xl border-t border-purple-500/30">
                <div className="flex items-center gap-3">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Share what's in your heart..."
                        className="flex-1 bg-transparent border-none outline-none text-white italic placeholder-purple-300"
                        disabled={isLoading}
                    />
                    <motion.button
                        onClick={handleSend}
                        disabled={!inputText.trim() || isLoading}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-3 rounded-full bg-gradient-to-r from-yellow-500 to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-5 h-5 text-white" />
                    </motion.button>
                </div>
            </div>
        </div>
    );
}