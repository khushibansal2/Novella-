import React from 'react';
import { motion } from 'framer-motion';
import ButterflyAnimation from '../Components/dating/ButterflyAnimation';

export default function ButterflyTypingIndicator() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-end gap-2 p-2"
        >
            <ButterflyAnimation size="small" bpm={150} color="#C77DFF" />
            <p className="text-purple-300 text-sm italic">fluttering a reply...</p>
        </motion.div>
    );
}