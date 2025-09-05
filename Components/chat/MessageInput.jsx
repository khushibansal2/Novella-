
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Delete } from "lucide-react"; // Changed Backspace to Delete
import { Button } from "@/components/ui/button";

export default function MessageInput({ onSendMessage, onBackspaceEffect }) {
    const [message, setMessage] = useState("");
    const [showBackspaceEffect, setShowBackspaceEffect] = useState(false);
    const inputRef = useRef(null);
    const previousLength = useRef(0);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Backspace' && message.length > 0) {
                setShowBackspaceEffect(true);
                onBackspaceEffect?.();
                
                setTimeout(() => setShowBackspaceEffect(false), 300);
            }
        };

        const input = inputRef.current;
        if (input) {
            input.addEventListener('keydown', handleKeyDown);
            return () => input.removeEventListener('keydown', handleKeyDown);
        }
    }, [message, onBackspaceEffect]);

    useEffect(() => {
        // Detect if text was deleted (not just backspace key)
        if (message.length < previousLength.current) {
            setShowBackspaceEffect(true);
            setTimeout(() => setShowBackspaceEffect(false), 300);
        }
        previousLength.current = message.length;
    }, [message]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim()) {
            onSendMessage(message.trim());
            setMessage("");
        }
    };

    return (
        <div className="relative">
            <AnimatePresence>
                {showBackspaceEffect && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute -top-12 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs italic flex items-center gap-1 shadow-lg z-10"
                    >
                        <Delete className="w-3 h-3" /> {/* Changed Backspace to Delete */}
                        Deletion detected!
                    </motion.div>
                )}
            </AnimatePresence>
            
            <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-purple-100">
                <div className="flex gap-2 p-4">
                    <input
                        ref={inputRef}
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 bg-transparent border-none outline-none text-purple-900 placeholder-purple-400 italic text-sm"
                        autoFocus
                    />
                    <Button
                        type="submit"
                        disabled={!message.trim()}
                        className="bg-purple-600 hover:bg-purple-700 rounded-xl px-4 py-2 transition-colors duration-200"
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </form>
        </div>
    );
}
