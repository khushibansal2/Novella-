
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Send, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Glimpse() {
    const [activeGlimpse, setActiveGlimpse] = useState(null);
    const [glimpseTimer, setGlimpseTimer] = useState(0);
    const [showReplyBox, setShowReplyBox] = useState(null);
    const [replyText, setReplyText] = useState("");
    const [glimpses, setGlimpses] = useState([
        {
            id: 1,
            sender: "Lily Chen",
            imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
            caption: "You glimpsed my smile during sunset... 🌅",
            timestamp: "2 minutes ago",
            isUnlocked: true,
            isViewed: false,
            duration: 5
        },
        {
            id: 2,
            sender: "Sofia Luna", 
            imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
            caption: "Caught me dancing in the kitchen 💃",
            timestamp: "1 hour ago",
            isUnlocked: true,
            isViewed: true,
            duration: 3
        },
        {
            id: 3,
            sender: "Zara Moon",
            imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400", 
            caption: "My yoga morning glow ✨",
            timestamp: "3 hours ago",
            isUnlocked: false,
            isViewed: false,
            duration: 4
        }
    ]);

    useEffect(() => {
        let interval;
        if (activeGlimpse && glimpseTimer > 0) {
            interval = setInterval(() => {
                setGlimpseTimer(prev => {
                    if (prev <= 1) {
                        // Mark as viewed and show reply box
                        setGlimpses(currentGlimpses => 
                            currentGlimpses.map(g => 
                                g.id === activeGlimpse.id ? { ...g, isViewed: true } : g
                            )
                        );
                        setActiveGlimpse(null);
                        setShowReplyBox(activeGlimpse);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [activeGlimpse, glimpseTimer]);

    const openGlimpse = (glimpse) => {
        if (glimpse.isUnlocked && !glimpse.isViewed) {
            setActiveGlimpse(glimpse);
            setGlimpseTimer(glimpse.duration);
            setShowReplyBox(null);
        }
    };

    const sendReply = () => {
        if (replyText.trim()) {
            console.log(`Reply sent to ${showReplyBox.sender}: ${replyText}`);
            // In real app, this would send the message
            setShowReplyBox(null);
            setReplyText("");
        }
    };

    return (
        <div className="min-h-screen p-4 pt-16">
            {/* Header */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
            >
                <h1 className="text-3xl font-bold satoshi text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500 mb-2 italic">
                    Ghost Glimpse
                </h1>
                <p className="text-purple-300 italic">Fleeting moments that fade away</p>
            </motion.div>

            {/* Glimpse Grid */}
            <div className="space-y-4 mb-8">
                {glimpses.map((glimpse, index) => (
                    <motion.div
                        key={glimpse.id}
                        initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2 }}
                        className={`bg-black/20 backdrop-blur-xl rounded-3xl overflow-hidden border ${
                            glimpse.isViewed ? 'border-gray-600/30' : 'border-purple-500/30'
                        } ${glimpse.isUnlocked && !glimpse.isViewed ? 'cursor-pointer' : 'cursor-default'}`}
                        onClick={() => openGlimpse(glimpse)}
                    >
                        <div className="relative">
                            <div className="h-48 relative overflow-hidden">
                                {/* Realistic blurred preview instead of black screen */}
                                <img 
                                    src={glimpse.imageUrl}
                                    alt="Glimpse"
                                    className={`w-full h-full object-cover transition-all duration-500 ${
                                        glimpse.isViewed
                                            ? 'grayscale filter blur-md brightness-50' // Updated for better viewed visibility
                                            : glimpse.isUnlocked
                                            ? 'filter-none'
                                            : 'filter blur-lg brightness-60 contrast-125' // Updated for better locked visibility
                                    }`}
                                />
                                
                                {/* Overlay effects */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
                                
                                {/* Status icon */}
                                <div className="absolute top-4 right-4">
                                    {glimpse.isViewed ? (
                                        <EyeOff className="w-6 h-6 text-gray-500" />
                                    ) : glimpse.isUnlocked ? (
                                        <Eye className="w-6 h-6 text-cyan-400 animate-pulse" />
                                    ) : (
                                        <EyeOff className="w-6 h-6 text-gray-400" />
                                    )}
                                </div>
                                
                                {/* Sender info */}
                                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-lg rounded-full px-3 py-1">
                                    <span className="text-white font-medium text-sm italic">{glimpse.sender}</span>
                                </div>
                                
                                {/* Timestamp */}
                                <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-lg rounded-full px-3 py-1">
                                    <span className="text-purple-200 text-xs italic">{glimpse.timestamp}</span>
                                </div>
                            </div>
                            
                            {/* Caption */}
                            <div className="p-4">
                                <p className={`italic ${
                                    glimpse.isViewed
                                        ? 'text-gray-500'
                                        : glimpse.isUnlocked
                                        ? 'text-purple-200'
                                        : 'text-gray-400'
                                }`}>
                                    {glimpse.isViewed
                                        ? "This moment has faded into memory..."
                                        : glimpse.isUnlocked
                                        ? glimpse.caption
                                        : "A blurred glimpse awaits... reply to unlock"}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* How it Works */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-black/20 backdrop-blur-xl rounded-3xl p-6 border border-purple-500/30"
            >
                <h2 className="text-xl font-semibold text-white mb-4 italic">How Ghost Glimpse Works</h2>
                
                <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                        <p className="text-purple-200 italic">
                            Send spontaneous photos that disappear after viewing once
                        </p>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-pink-400 rounded-full mt-2 flex-shrink-0" />
                        <p className="text-purple-200 italic">
                            Blurred previews tease the moment - reply to unlock the clear image
                        </p>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                        <p className="text-purple-200 italic">
                            Once viewed, the glimpse fades forever, creating precious fleeting intimacy
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Full Screen Glimpse Modal */}
            <AnimatePresence>
                {activeGlimpse && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="relative max-w-sm w-full mx-4"
                        >
                            {/* Timer */}
                            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
                                <div className="bg-black/70 backdrop-blur-lg rounded-full px-4 py-2 flex items-center gap-2">
                                    <Timer className="w-4 h-4 text-cyan-400" />
                                    <span className="text-white font-bold italic">{glimpseTimer}s</span>
                                </div>
                            </div>
                            
                            {/* Progress bar */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800 z-10">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-cyan-400 to-pink-500"
                                    animate={{ 
                                        width: `${(glimpseTimer / activeGlimpse.duration) * 100}%` 
                                    }}
                                    transition={{ duration: 1, ease: "linear" }}
                                />
                            </div>

                            {/* Image */}
                            <div className="rounded-3xl overflow-hidden">
                                <img 
                                    src={activeGlimpse.imageUrl}
                                    alt="Glimpse"
                                    className="w-full h-96 object-cover"
                                />
                                
                                {/* Caption overlay */}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                                    <p className="text-white italic text-lg text-center">
                                        {activeGlimpse.caption}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Reply Box Modal */}
            <AnimatePresence>
                {showReplyBox && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center p-4 z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="bg-black/60 backdrop-blur-xl rounded-3xl p-6 border border-purple-500/50 max-w-sm w-full"
                        >
                            <motion.div
                                className="text-6xl mb-4 text-center"
                                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            >
                                🦋
                            </motion.div>
                            <h3 className="text-2xl font-bold satoshi text-white mb-4 text-center italic">
                                Glimpse Captured
                            </h3>
                            <p className="text-purple-200 italic mb-6 text-center">
                                The moment has fluttered away... but you can reply to {showReplyBox.sender} right now!
                            </p>
                            
                            {/* Integrated Reply Box */}
                            <div className="space-y-4">
                                <textarea
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Flutter your thoughts..."
                                    className="w-full bg-white/10 border border-purple-400/30 rounded-xl p-4 text-white italic placeholder-purple-300 resize-none h-24"
                                    autoFocus
                                />
                                
                                <div className="flex gap-3">
                                    <Button
                                        onClick={() => setShowReplyBox(null)}
                                        variant="outline"
                                        className="flex-1 border-gray-600 text-gray-300 italic"
                                    >
                                        Maybe Later
                                    </Button>
                                    <Button
                                        onClick={sendReply}
                                        disabled={!replyText.trim()}
                                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 italic"
                                    >
                                        <Send className="w-4 h-4 mr-2" />
                                        Reply
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
