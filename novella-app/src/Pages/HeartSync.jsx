
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Zap, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import ButterflyAnimation from "../Components/dating/ButterflyAnimation";
import HeartRateDisplay from "../Components/dating/HeartRateDisplay";
import ButterflyBurst from "../Components/dating/ButterflyBurst";

export default function HeartSync() {
    const [myBpm, setMyBpm] = useState(72);
    const [partnerBpm, setPartnerBpm] = useState(68);
    const [isConnected, setIsConnected] = useState(true);
    const [syncLevel, setSyncLevel] = useState(0);
    const [showFlutterTooltip, setShowFlutterTooltip] = useState(false);
    const [flutterTrigger, setFlutterTrigger] = useState(0);

    useEffect(() => {
        // Simulate dynamic heart rates
        const interval = setInterval(() => {
            setMyBpm(prev => Math.max(60, Math.min(120, prev + (Math.random() - 0.5) * 8)));
            setPartnerBpm(prev => Math.max(60, Math.min(120, prev + (Math.random() - 0.5) * 8)));
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Calculate sync level based on BPM difference
        const difference = Math.abs(myBpm - partnerBpm);
        const newSyncLevel = Math.max(0, 100 - (difference * 3));
        setSyncLevel(newSyncLevel);
        
        // Show flutter tooltip when hearts are in sync
        if (newSyncLevel > 85) {
            setShowFlutterTooltip(true);
        } else {
            setShowFlutterTooltip(false);
        }
    }, [myBpm, partnerBpm]);

    const isHighSync = syncLevel > 85;
    const averageBpm = (myBpm + partnerBpm) / 2;

    const sendFlutter = () => {
        setFlutterTrigger(prev => prev + 1); // Trigger the burst effect
        console.log("Flutter sent! 🦋💝");
    };

    return (
        <div className="min-h-screen p-4 pt-16">
            <ButterflyBurst trigger={flutterTrigger} />
            {/* Header */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
            >
                <h1 className="text-3xl font-bold satoshi text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500 mb-2 italic">
                    Heart Sync
                </h1>
                <p className="text-purple-300 italic">Feel the rhythm of connection</p>
            </motion.div>

            {/* Connection status */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`bg-black/20 backdrop-blur-xl rounded-2xl p-4 mb-8 border transition-colors duration-500 ${
                    isConnected ? 'border-green-500/50' : 'border-red-500/50'
                }`}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full animate-pulse ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
                        <span className="text-white font-medium italic">
                            {isConnected ? 'Connected to Emma Rose' : 'Connecting...'}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-400" />
                        <span className="text-cyan-400 font-bold italic">{syncLevel.toFixed(0)}% sync</span>
                    </div>
                </div>
            </motion.div>

            {/* Heart rate displays */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <HeartRateDisplay 
                    bpm={myBpm}
                    isConnected={isConnected}
                    userName="You"
                />
                <HeartRateDisplay 
                    bpm={partnerBpm}
                    isConnected={isConnected}
                    userName="Emma"
                />
            </div>

            {/* Butterfly sync animation */}
            <div className="relative mb-8">
                <div className="bg-black/20 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30 bio-glow">
                    <div className="flex items-center justify-center gap-8 mb-6">
                        {/* My butterfly */}
                        <div className="text-center">
                            <ButterflyAnimation 
                                bpm={myBpm}
                                size="large"
                                color="#4CC9F0"
                                isSync={isHighSync}
                                onClick={sendFlutter}
                            />
                            <p className="text-cyan-400 text-sm mt-2 font-medium">Your Heart</p>
                        </div>

                        {/* Sync visualization */}
                        <div className="flex flex-col items-center">
                            <motion.div
                                className="w-16 h-16 rounded-full border-4 border-purple-500/30 flex items-center justify-center mb-2"
                                animate={{ 
                                    borderColor: isHighSync ? '#F72585' : '#8B5CF6',
                                    scale: [1, 1.1, 1]
                                }}
                                transition={{ 
                                    duration: 60 / averageBpm,
                                    repeat: Infinity 
                                }}
                            >
                                <Heart className={`w-8 h-8 ${isHighSync ? 'text-pink-500 fill-current' : 'text-purple-400'}`} />
                            </motion.div>
                            
                            {isHighSync && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center"
                                >
                                    <div className="text-pink-400 text-xs font-semibold mb-1">DNA SYNC</div>
                                    <motion.div
                                        className="w-12 h-1 bg-gradient-to-r from-cyan-400 via-pink-500 to-cyan-400"
                                        animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        style={{ backgroundSize: '200% 200%' }}
                                    />
                                </motion.div>
                            )}
                        </div>

                        {/* Partner's butterfly */}
                        <div className="text-center">
                            <ButterflyAnimation 
                                bpm={partnerBpm}
                                size="large"
                                color="#F72585"
                                isSync={isHighSync}
                                onClick={sendFlutter}
                            />
                            <p className="text-pink-400 text-sm mt-2 font-medium">Emma's Heart</p>
                        </div>
                    </div>

                    {/* Flutter tooltip */}
                    <AnimatePresence>
                        {showFlutterTooltip && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="text-center"
                            >
                                <div className="bg-gradient-to-r from-pink-500/80 to-purple-600/80 backdrop-blur-lg rounded-2xl px-6 py-3 inline-block">
                                    <p className="text-white font-medium italic mb-2">
                                        💕 Your hearts are dancing! 💕
                                    </p>
                                    <Button
                                        onClick={sendFlutter}
                                        className="bg-white/20 hover:bg-white/30 text-white border border-white/30 italic"
                                    >
                                        <Send className="w-4 h-4 mr-2" />
                                        Send a Flutter
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Sync history */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-black/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30"
            >
                <h3 className="text-lg font-semibold text-white mb-4 italic">Today's Sync Sessions</h3>
                <div className="space-y-3">
                    {[
                        { time: "2:14 PM", sync: 94, duration: "3m 42s", mood: "Excited" },
                        { time: "11:28 AM", sync: 87, duration: "2m 15s", mood: "Calm" },
                        { time: "9:45 AM", sync: 91, duration: "5m 01s", mood: "Romantic" }
                    ].map((session, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${
                                    session.sync > 90 ? 'bg-green-400' : 
                                    session.sync > 80 ? 'bg-yellow-400' : 'bg-gray-400'
                                }`} />
                                <span className="text-purple-200 text-sm italic">{session.time}</span>
                                <span className="text-xs text-purple-400 italic">{session.mood}</span>
                            </div>
                            <div className="text-right">
                                <div className="text-cyan-400 font-semibold text-sm italic">{session.sync}% sync</div>
                                <div className="text-purple-300 text-xs italic">{session.duration}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
