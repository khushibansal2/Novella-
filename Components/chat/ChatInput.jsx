import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles } from 'lucide-react';

export default function ChatInput({ onSend, onHesitation, onAskChatbot }) {
    const [text, setText] = useState('');
    const hesitationTimer = useRef(null);

    const handleChange = (e) => {
        setText(e.target.value);
        
        clearTimeout(hesitationTimer.current);
        hesitationTimer.current = setTimeout(() => {
            if (e.target.value.length > 0) {
                onHesitation();
            }
        }, 2000); 
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.trim()) {
            onSend(text.trim());
            setText('');
            clearTimeout(hesitationTimer.current);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-black/30 backdrop-blur-xl border-t border-purple-500/30">
            <div className="flex items-center gap-3">
                <button 
                    type="button" 
                    onClick={onAskChatbot}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                </button>
                <input
                    type="text"
                    value={text}
                    onChange={handleChange}
                    placeholder="Flutter a message..."
                    className="flex-1 bg-transparent border-none outline-none text-white italic placeholder-purple-300"
                />
                <motion.button
                    type="submit"
                    disabled={!text.trim()}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 disabled:opacity-50"
                >
                    <Send className="w-5 h-5 text-white" />
                </motion.button>
            </div>
        </form>
    );
}