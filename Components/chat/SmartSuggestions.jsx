import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function SmartSuggestions({ suggestions, onSuggestionClick }) {
    if (!suggestions || suggestions.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
        >
            <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span className="text-sm text-purple-600 italic font-medium">Suggested responses:</span>
            </div>
            <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onSuggestionClick(suggestion)}
                            className="bg-white/60 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 rounded-full px-4 py-2 text-xs italic transition-all duration-200"
                        >
                            {suggestion}
                        </Button>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}