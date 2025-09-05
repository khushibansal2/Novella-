import React from "react";
import { motion } from "framer-motion";

export default function ChatMessage({ message, isStreaming, currentStreamText }) {
    const isUser = message.sender === "user";
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
        >
            <div className="flex items-end gap-3 max-w-[80%]">
                {!isUser && (
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex-shrink-0 flex items-center justify-center shadow-md">
                        <span className="text-white text-xs font-bold italic">AI</span>
                    </div>
                )}
                
                <div
                    className={`px-4 py-3 rounded-2xl shadow-sm ${
                        isUser
                            ? 'bg-purple-600 text-white rounded-br-sm'
                            : 'bg-white border border-purple-100 text-purple-900 rounded-bl-sm'
                    }`}
                >
                    <p className="text-sm italic leading-relaxed">
                        {isStreaming ? (
                            <StreamingText text={currentStreamText || message.content} />
                        ) : (
                            message.content
                        )}
                    </p>
                </div>
                
                {isUser && (
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-300 to-purple-500 rounded-full flex-shrink-0 flex items-center justify-center shadow-md">
                        <span className="text-white text-xs font-bold italic">U</span>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

function StreamingText({ text }) {
    const [displayText, setDisplayText] = React.useState('');
    const [currentIndex, setCurrentIndex] = React.useState(0);

    React.useEffect(() => {
        if (currentIndex < text.length) {
            const timer = setTimeout(() => {
                setDisplayText(prev => prev + text[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, 50 + Math.random() * 50); // Random delay between 50-100ms
            
            return () => clearTimeout(timer);
        }
    }, [currentIndex, text]);

    return (
        <span className="text-purple-600">
            {displayText}
            {currentIndex < text.length && (
                <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="inline-block w-0.5 h-4 bg-purple-600 ml-0.5"
                />
            )}
        </span>
    );
}