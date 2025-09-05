import React from "react";
import { motion } from "framer-motion";
import { Heart, Activity } from "lucide-react";

export default function HeartRateDisplay({ bpm, isConnected, userName }) {
    const getHeartColor = () => {
        if (bpm > 100) return "text-red-400";
        if (bpm > 80) return "text-orange-400"; 
        return "text-cyan-400";
    };

    return (
        <div className="bg-black/20 backdrop-blur-xl rounded-2xl p-4 border border-purple-500/30">
            <div className="flex items-center gap-3 mb-2">
                <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ 
                        duration: 60 / (bpm || 70),
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <Heart className={`w-5 h-5 ${getHeartColor()} fill-current`} />
                </motion.div>
                <span className="text-purple-200 text-sm font-medium">{userName}</span>
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} animate-pulse`} />
            </div>
            
            <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-bold satoshi ${getHeartColor()}`}>
                    {bpm || '--'}
                </span>
                <span className="text-purple-300 text-sm">BPM</span>
            </div>
            
            {/* Mini heart rate graph */}
            <div className="flex items-center gap-1 mt-2">
                <Activity className="w-4 h-4 text-purple-400" />
                <div className="flex-1 h-8 flex items-end gap-0.5 overflow-hidden">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className={`w-1 bg-gradient-to-t ${getHeartColor().replace('text', 'from')} to-transparent`}
                            style={{ height: `${Math.random() * 100}%` }}
                            animate={{ height: [`${Math.random() * 100}%`, `${Math.random() * 100}%`] }}
                            transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}