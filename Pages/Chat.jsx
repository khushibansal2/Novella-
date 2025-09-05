import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatMessageItem from '../Components/chat/ChatMessageItem';
import ChatInput from '../Components/chat/ChatInput';
import ButterflyTypingIndicator from '../Components/chat/ButterflyTypingIndicator';
import { ChevronLeft, Info, Clock, Heart, Wand2 } from 'lucide-react';
import { InvokeLLM } from '@/integrations/Core';

const mockInitialMessages = [
    { 
        id: 1, 
        sender: "Lily", 
        content: "Hey! I had such a great time syncing hearts with you earlier 😊", 
        has_butterfly: true,
        timestamp: new Date(Date.now() - 300000) // 5 minutes ago
    },
    { 
        id: 2, 
        sender: "You", 
        content: "Me too! It felt so magical.", 
        has_butterfly: false,
        timestamp: new Date(Date.now() - 240000) // 4 minutes ago
    },
    { 
        id: 3, 
        sender: "Lily", 
        content: "Right? I've never experienced anything like it. My butterfly garden has a new species now!", 
        has_butterfly: true,
        timestamp: new Date(Date.now() - 180000) // 3 minutes ago
    },
];

const partnerActivity = {
    HESITATION: "hesitation",
    QUICK_REPLY: "quick_reply",
    THOUGHTFUL: "thoughtful",
    BACKSPACE: "backspace",
};

export default function Chat() {
    const [messages, setMessages] = useState(mockInitialMessages);
    const [isTyping, setIsTyping] = useState(false);
    const [showTooltip, setShowTooltip] = useState(null);
    const [showAmoraHelp, setShowAmoraHelp] = useState(false);
    const [hesitation, setHesitation] = useState({ percent: 0, caringScore: 0, isActive: false });
    const [responseTimings, setResponseTimings] = useState([]);
    const lastMessageTimestamps = useRef({});
    const chatEndRef = useRef(null);
    let hesitationTimer = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);
    
    const startHesitation = () => {
        stopHesitation(); // Clear any existing timer
        setHesitation(prev => ({ ...prev, isActive: true, percent: 0 }));
        hesitationTimer.current = setInterval(() => {
            setHesitation(prev => ({ ...prev, percent: Math.min(100, prev.percent + 8) }));
        }, 200);
    };

    const stopHesitation = () => {
        clearInterval(hesitationTimer.current);
        hesitationTimer.current = null;
        setTimeout(() => setHesitation(prev => ({ ...prev, percent: 0, isActive: false })), 300);
    };

    const handleMarkAsRead = (messageId) => {
        setMessages(prevMessages =>
            prevMessages.map(msg =>
                msg.id === messageId ? { ...msg, has_butterfly: false } : msg
            )
        );
    };

    const analyzeResponsePattern = (currentTime, sender) => {
        const otherUser = sender === "You" ? "Lily" : "You";
        const lastTime = lastMessageTimestamps.current[otherUser];
        
        if (lastTime) {
            const responseTime = currentTime - lastTime;
            const newTiming = { sender, responseTime, timestamp: currentTime };
            
            setResponseTimings(prev => [...prev.slice(-4), newTiming]); // Keep last 5 timings
            
            // Analyze patterns
            if (responseTime > 30000) { // More than 30 seconds
                setShowTooltip({ 
                    type: partnerActivity.HESITATION, 
                    text: 'They paused before sending… maybe choosing the right words.' 
                });
            } else if (responseTime < 5000) { // Less than 5 seconds
                setShowTooltip({ 
                    type: partnerActivity.QUICK_REPLY, 
                    text: 'Your replies are flowing in sync — like two wings beating together.' 
                });
            } else if (responseTime > 10000 && responseTime < 20000) { // 10-20 seconds
                setShowTooltip({ 
                    type: partnerActivity.THOUGHTFUL, 
                    text: 'A thoughtful pause… hearts sometimes need a moment to find the right rhythm.' 
                });
            }
            
            setTimeout(() => setShowTooltip(null), 4000);
        }
    };

    const handleSend = async (content) => {
        const now = Date.now();
        const newMessage = { 
            id: now, 
            sender: "You", 
            content, 
            has_butterfly: false,
            timestamp: new Date(now)
        };
        
        setMessages(prev => [...prev, newMessage]);
        analyzeResponsePattern(now, "You");
        lastMessageTimestamps.current["You"] = now;
        
        setIsTyping(true);
        startHesitation();

        // Simulate backspace and careful rephrasing from partner
        setTimeout(() => {
            setHesitation(prev => ({ ...prev, caringScore: prev.caringScore + 1 }));
            setShowTooltip({ type: partnerActivity.BACKSPACE, text: "Lily is rephrasing... showing extra care in her words." });
            setTimeout(() => setShowTooltip(null), 4000);
        }, 1500 + Math.random() * 2000);

        setTimeout(async () => {
            try {
                const conversationContext = messages
                    .slice(-5)
                    .map(msg => `${msg.sender}: ${msg.content}`)
                    .join('\n');

                const response = await InvokeLLM({
                    prompt: `You are Lily Chen, a 26-year-old woman in a romantic dating conversation on an app called Novella. You're warm, playful, and interested. The app uses themes of butterflies, heartbeats, and fleeting moments.

Previous conversation:
${conversationContext}

They just said: ${content}

Respond as Lily in a natural, romantic, and engaging way. Keep it conversational (1-2 sentences). Show genuine interest and personality. Reference the app themes occasionally when it feels natural.`,
                });
                
                stopHesitation();
                setIsTyping(false);
                const replyTime = Date.now();
                const partnerReply = { 
                    id: replyTime, 
                    sender: "Lily", 
                    content: response, 
                    has_butterfly: true,
                    timestamp: new Date(replyTime)
                };
                
                setMessages(prev => [...prev, partnerReply]);
                analyzeResponsePattern(replyTime, "Lily");
                lastMessageTimestamps.current["Lily"] = replyTime;
                
            } catch (error) {
                stopHesitation();
                setIsTyping(false);
                const fallbackReply = { 
                    id: Date.now(), 
                    sender: "Lily", 
                    content: "That's so sweet of you to say! ✨", 
                    has_butterfly: true,
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, fallbackReply]);
            }
        }, 3500 + Math.random() * 2000); // Realistic typing delay
    };

    const handleHesitationFromInput = () => {
        // This is for the USER's hesitation, can be used to send cues
        console.log("User is hesitating...");
    };
    
    const askAmora = () => {
        setShowAmoraHelp(true);
    };

    const formatTimeGap = (current, previous) => {
        const diff = current.getTime() - previous.getTime();
        const minutes = Math.floor(diff / 60000);
        if (minutes < 1) return null;
        if (minutes < 60) return `${minutes}m gap`;
        const hours = Math.floor(minutes / 60);
        return `${hours}h ${minutes % 60}m gap`;
    };

    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
            {/* Chat Header */}
            <header className="flex items-center justify-between p-4 bg-black/30 backdrop-blur-xl border-b border-purple-500/30">
                <ChevronLeft className="w-6 h-6 text-white" />
                <div className="text-center">
                    <h2 className="font-bold text-white text-lg italic">Lily Chen</h2>
                    <p className="text-sm text-green-400 italic">Active now</p>
                </div>
                <Info className="w-6 h-6 text-white" />
            </header>
            
            {/* Dynamic Tooltip / Hesitation Meter - Only show when actually hesitating */}
            <AnimatePresence>
                {(showTooltip || hesitation.isActive) && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="text-center p-3 bg-black/40 border-b border-purple-500/20"
                    >
                        {hesitation.isActive ? (
                             <div className="w-full bg-gray-600/50 rounded-full h-2.5 mb-2">
                                <motion.div 
                                    className="bg-gradient-to-r from-pink-500 to-purple-500 h-2.5 rounded-full" 
                                    style={{ width: `${hesitation.percent}%` }}
                                 />
                            </div>
                        ) : null}
                        
                        {showTooltip && (
                            <p className="text-sm italic text-cyan-300">{showTooltip.text}</p>
                        )}
                        
                        {hesitation.isActive && (
                            <p className="text-xs italic text-pink-300">Lily is thinking... {hesitation.percent}%</p>
                        )}
                        
                        {showTooltip?.type === partnerActivity.BACKSPACE && (
                             <div className="flex items-center justify-center gap-2 mt-2 text-sm text-pink-400 italic">
                                <Heart className="w-4 h-4" />
                                <span>Caring Score: {hesitation.caringScore}</span>
                             </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Messages with Timing */}
            <div className="flex-1 overflow-y-auto p-4">
                {messages.map((msg, index) => {
                    const prevMsg = messages[index - 1];
                    const timeGap = prevMsg ? formatTimeGap(msg.timestamp, prevMsg.timestamp) : null;
                    
                    return (
                        <div key={msg.id}>
                            {/* Time gap indicator */}
                            {timeGap && (
                                <div className="text-center my-3">
                                    <div className="inline-flex items-center gap-1 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-purple-300 italic">
                                        <Clock className="w-3 h-3" />
                                        {timeGap}
                                    </div>
                                </div>
                            )}
                            
                            <ChatMessageItem 
                                message={msg} 
                                onInView={handleMarkAsRead}
                                showTimestamp={true}
                            />
                        </div>
                    );
                })}
                
                {isTyping && <ButterflyTypingIndicator />}
                <div ref={chatEndRef} />
            </div>

            {/* Response Timing Analytics */}
            {responseTimings.length > 0 && (
                <div className="px-4 pb-2">
                    <div className="bg-black/20 backdrop-blur-sm rounded-lg p-3 border border-purple-500/20">
                        <h4 className="text-xs text-purple-300 italic mb-2">Conversation Rhythm</h4>
                        <div className="flex gap-2 text-xs">
                            {responseTimings.slice(-3).map((timing, index) => (
                                <div key={index} className="text-purple-200 italic">
                                    {timing.sender}: {Math.round(timing.responseTime / 1000)}s
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Chat Input */}
            <ChatInput onSend={handleSend} onHesitation={handleHesitationFromInput} onAskChatbot={askAmora} />
            
            {/* Amora Help Modal */}
            <AnimatePresence>
                {showAmoraHelp && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50"
                        onClick={() => setShowAmoraHelp(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-black/60 rounded-2xl p-6 border border-purple-500/50 max-w-sm w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-lg font-bold text-yellow-400 mb-4 italic flex items-center gap-2">
                                <Wand2 className="w-5 h-5" />
                                Amora's Suggestions
                            </h3>
                            <div className="space-y-3">
                                {[
                                    "Ask about the new butterfly in her garden",
                                    "Tell her how the heart sync made you feel",
                                    "Suggest exploring the AR garden together",
                                    "Ask what her favorite butterfly species is"
                                ].map((suggestion, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            handleSend(suggestion);
                                            setShowAmoraHelp(false);
                                        }}
                                        className="w-full text-left p-3 bg-white/10 rounded-lg hover:bg-white/20 text-purple-200 italic text-sm transition-colors"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}