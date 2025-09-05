import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VoiceMood() {
    const [isRecording, setIsRecording] = useState(false);
    const [currentMood, setCurrentMood] = useState(null);
    const [voiceMessages, setVoiceMessages] = useState([
        {
            id: 1,
            sender: "You",
            mood: "golden_pollen",
            timestamp: "2:14 PM",
            description: "Excited and flirty energy detected"
        },
        {
            id: 2,
            sender: "Emma",
            mood: "blue_mist", 
            timestamp: "2:12 PM",
            description: "Calm and thoughtful tone"
        }
    ]);

    const moodTypes = {
        golden_pollen: {
            name: "Golden Pollen",
            color: "#FFD700",
            emoji: "✨",
            description: "Flirty and playful",
            particles: "sparkle"
        },
        blue_mist: {
            name: "Blue Mist", 
            color: "#4CC9F0",
            emoji: "🌊",
            description: "Calm and serene",
            particles: "waves"
        },
        silver_whisper: {
            name: "Silver Whisper",
            color: "#C0C0C0",
            emoji: "🌙",
            description: "Mysterious and intimate", 
            particles: "shimmer"
        },
        rose_ember: {
            name: "Rose Ember",
            color: "#F72585",
            emoji: "🔥",
            description: "Passionate and intense",
            particles: "fire"
        }
    };

    const startRecording = () => {
        setIsRecording(true);
        
        // Simulate recording and mood analysis
        setTimeout(() => {
            const moods = Object.keys(moodTypes);
            const randomMood = moods[Math.floor(Math.random() * moods.length)];
            setCurrentMood(randomMood);
            setIsRecording(false);
        }, 3000);
    };

    const sendVoiceMessage = () => {
        if (currentMood) {
            const newMessage = {
                id: Date.now(),
                sender: "You",
                mood: currentMood,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                description: moodTypes[currentMood].description
            };
            
            setVoiceMessages(prev => [newMessage, ...prev]);
            setCurrentMood(null);
        }
    };

    const MoodParticles = ({ mood }) => {
        const moodConfig = moodTypes[mood];
        
        return (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full"
                        style={{ backgroundColor: moodConfig.color }}
                        initial={{ 
                            x: Math.random() * 300,
                            y: Math.random() * 300,
                            opacity: 0.8
                        }}
                        animate={{
                            x: Math.random() * 300,
                            y: Math.random() * 300,
                            opacity: [0.8, 0.2, 0.8]
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen p-4 pt-16">
            {/* Header */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
            >
                <h1 className="text-3xl font-bold satoshi text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500 mb-2">
                    Voice Mood Analyzer
                </h1>
                <p className="text-purple-300 italic">Transform your voice into beautiful emotions</p>
            </motion.div>

            {/* Recording Interface */}
            <div className="bg-black/20 backdrop-blur-xl rounded-3xl p-8 mb-8 border border-purple-500/30 text-center relative">
                {currentMood && <MoodParticles mood={currentMood} />}
                
                <AnimatePresence>
                    {isRecording && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="mb-6"
                        >
                            <div className="text-cyan-400 mb-4">
                                <div className="text-lg font-semibold italic">Listening to your voice...</div>
                                <div className="text-sm opacity-80">Analyzing emotional patterns</div>
                            </div>
                            
                            {/* Voice wave animation */}
                            <div className="flex justify-center gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="w-2 bg-gradient-to-t from-cyan-400 to-pink-500"
                                        animate={{
                                            height: [20, 60, 20],
                                        }}
                                        transition={{
                                            duration: 0.8,
                                            repeat: Infinity,
                                            delay: i * 0.1
                                        }}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Current mood result */}
                <AnimatePresence>
                    {currentMood && !isRecording && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mb-6"
                        >
                            <div className="text-center">
                                <div className="text-4xl mb-2">{moodTypes[currentMood].emoji}</div>
                                <h3 className="text-2xl font-bold satoshi mb-2" style={{ color: moodTypes[currentMood].color }}>
                                    {moodTypes[currentMood].name}
                                </h3>
                                <p className="text-purple-200 italic mb-4">
                                    {moodTypes[currentMood].description}
                                </p>
                                <Button
                                    onClick={sendVoiceMessage}
                                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                                >
                                    <Send className="w-4 h-4 mr-2" />
                                    Send Voice Mood
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Record button */}
                {!currentMood && (
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button
                            onClick={startRecording}
                            disabled={isRecording}
                            className={`w-24 h-24 rounded-full ${
                                isRecording 
                                    ? 'bg-red-500 hover:bg-red-600' 
                                    : 'bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600'
                            } text-white border-4 border-white/30 transition-all duration-300`}
                        >
                            {isRecording ? (
                                <MicOff className="w-10 h-10" />
                            ) : (
                                <Mic className="w-10 h-10" />
                            )}
                        </Button>
                    </motion.div>
                )}

                <p className="text-purple-300 text-sm mt-4 italic">
                    {isRecording 
                        ? "Recording your voice patterns..." 
                        : currentMood
                        ? "Mood analyzed! Send to your match"
                        : "Tap to record a voice message"
                    }
                </p>
            </div>

            {/* Mood Guide */}
            <div className="bg-black/20 backdrop-blur-xl rounded-3xl p-6 mb-8 border border-purple-500/30">
                <h2 className="text-xl font-semibold text-white mb-4 italic flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                    Mood Spectrum
                </h2>
                
                <div className="grid grid-cols-2 gap-3">
                    {Object.entries(moodTypes).map(([key, mood]) => (
                        <div key={key} className="p-3 bg-white/5 rounded-lg border border-gray-600/30">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xl">{mood.emoji}</span>
                                <span className="font-semibold" style={{ color: mood.color }}>
                                    {mood.name}
                                </span>
                            </div>
                            <p className="text-gray-300 text-sm italic">{mood.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Voice Message History */}
            <div className="bg-black/20 backdrop-blur-xl rounded-3xl p-6 border border-purple-500/30">
                <h2 className="text-xl font-semibold text-white mb-4 italic">Recent Voice Messages</h2>
                
                <div className="space-y-3">
                    {voiceMessages.map((message) => (
                        <motion.div
                            key={message.id}
                            initial={{ opacity: 0, x: message.sender === "You" ? 20 : -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`p-4 rounded-2xl ${
                                message.sender === "You" 
                                    ? 'bg-purple-600/30 ml-8' 
                                    : 'bg-cyan-600/30 mr-8'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">{moodTypes[message.mood].emoji}</span>
                                    <span 
                                        className="font-semibold"
                                        style={{ color: moodTypes[message.mood].color }}
                                    >
                                        {moodTypes[message.mood].name}
                                    </span>
                                </div>
                                <span className="text-purple-300 text-sm">{message.timestamp}</span>
                            </div>
                            <p className="text-purple-200 italic text-sm">{message.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}