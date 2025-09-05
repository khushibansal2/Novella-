import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import RealisticButterfly from '../Components/dating/RealisticButterfly';

export default function ChatMessageItem({ message, onInView, showTimestamp = false }) {
    const isUser = message.sender === "You";
    const [hasLanded, setHasLanded] = useState(message.has_butterfly);

    useEffect(() => {
        onInView(message.id);
        if (message.has_butterfly) {
            const timer = setTimeout(() => {
                setHasLanded(false);
            }, 3000); // Butterfly flies away after 3 seconds
            return () => clearTimeout(timer);
        }
    }, [message.id, message.has_butterfly, onInView]);

    const messageVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <motion.div
            variants={messageVariants}
            initial="hidden"
            animate="visible"
            className={`flex items-end gap-2 my-3 ${isUser ? 'justify-end' : 'justify-start'}`}
        >
            {!isUser && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex-shrink-0" />
            )}
            <div className="relative">
                <div
                    className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl shadow-md ${
                        isUser
                            ? 'bg-purple-600 text-white rounded-br-lg'
                            : 'bg-white/10 text-purple-200 rounded-bl-lg border border-purple-300/20'
                    }`}
                >
                    <p className="italic text-sm leading-relaxed">{message.content}</p>
                    {showTimestamp && (
                        <p className={`text-xs mt-1 opacity-70 ${isUser ? 'text-purple-200' : 'text-purple-300'}`}>
                            {message.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || 'now'}
                        </p>
                    )}
                </div>
                {hasLanded && !isUser && (
                    <motion.div
                        className="absolute -top-6 -right-6"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1, transition: { delay: 0.5, type: 'spring' } }}
                        exit={{ scale: 0, opacity: 0, transition: { duration: 0.5 } }}
                    >
                        <RealisticButterfly size="small" bpm={80} species="swallowtail" />
                    </motion.div>
                )}
            </div>
            {isUser && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex-shrink-0" />
            )}
        </motion.div>
    );
}