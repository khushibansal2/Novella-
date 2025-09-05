import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function ButterflyAnimation({ 
    bpm = 70, 
    color = "#4CC9F0", 
    size = "large",
    isSync = false,
    onClick 
}) {
    const butterflyRef = useRef(null);
    
    // Calculate animation speed based on BPM
    const animationSpeed = Math.max(0.5, Math.min(3, bpm / 40));
    const isHighBpm = bpm > 100;
    
    const sizeClasses = {
        small: "w-8 h-8",
        medium: "w-16 h-16", 
        large: "w-32 h-32"
    };

    return (
        <motion.div
            ref={butterflyRef}
            className={`relative ${sizeClasses[size]} cursor-pointer butterfly-float`}
            onClick={onClick}
            animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
            }}
            transition={{
                duration: 60 / bpm, // Sync with heart rate
                repeat: Infinity,
                ease: "easeInOut"
            }}
        >
            {/* Butterfly wings */}
            <div className="relative w-full h-full">
                {/* Left wing */}
                <motion.div
                    className="absolute left-0 top-1/4 w-1/2 h-3/4 rounded-tl-full rounded-bl-full"
                    style={{ 
                        background: `linear-gradient(45deg, ${color}, ${isHighBpm ? '#FF1744' : color}90)`,
                        filter: isHighBpm ? 'drop-shadow(0 0 10px #FF1744)' : `drop-shadow(0 0 8px ${color})`
                    }}
                    animate={{
                        rotateY: [0, -30, 0],
                        opacity: [0.8, 1, 0.8]
                    }}
                    transition={{
                        duration: animationSpeed,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                
                {/* Right wing */}
                <motion.div
                    className="absolute right-0 top-1/4 w-1/2 h-3/4 rounded-tr-full rounded-br-full"
                    style={{ 
                        background: `linear-gradient(-45deg, ${color}, ${isHighBpm ? '#FF1744' : color}90)`,
                        filter: isHighBpm ? 'drop-shadow(0 0 10px #FF1744)' : `drop-shadow(0 0 8px ${color})`
                    }}
                    animate={{
                        rotateY: [0, 30, 0],
                        opacity: [0.8, 1, 0.8]
                    }}
                    transition={{
                        duration: animationSpeed,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.1
                    }}
                />
                
                {/* Body */}
                <div 
                    className="absolute left-1/2 top-0 w-1 h-full transform -translate-x-1/2 rounded-full"
                    style={{ backgroundColor: isHighBpm ? '#FF1744' : '#1A1A2E' }}
                />
                
                {/* Sync effect - DNA helix */}
                {isSync && (
                    <motion.div
                        className="absolute inset-0 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <motion.div
                            className="absolute inset-0 border-2 border-cyan-400 rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            style={{ filter: 'drop-shadow(0 0 15px #4CC9F0)' }}
                        />
                        <motion.div
                            className="absolute inset-2 border border-pink-400 rounded-full"
                            animate={{ rotate: -360 }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            style={{ filter: 'drop-shadow(0 0 10px #F72585)' }}
                        />
                    </motion.div>
                )}
            </div>
            
            {/* Glow effect for high BPM */}
            {isHighBpm && (
                <div 
                    className="absolute inset-0 rounded-full animate-ping"
                    style={{ 
                        background: 'radial-gradient(circle, rgba(255, 23, 68, 0.3), transparent)',
                        filter: 'blur(10px)'
                    }}
                />
            )}
        </motion.div>
    );
}