import React from "react";
import { motion } from "framer-motion";

export default function TypingIndicator() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex justify-start mb-4"
        >
            <div className="flex items-end gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex-shrink-0 flex items-center justify-center shadow-md">
                    <span className="text-white text-xs font-bold italic">AI</span>
                </div>
                
                <div className="bg-white border border-purple-100 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
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
    );
}