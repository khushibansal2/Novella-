import React from "react";
import { motion } from "framer-motion";

export default function MemberProfiles({ members }) {
    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-sm border border-purple-100">
            <h3 className="text-lg font-medium text-purple-900 italic mb-4">Active Members</h3>
            <div className="flex gap-4 overflow-x-auto pb-2">
                {members.map((member, index) => (
                    <motion.div
                        key={member.id || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex-shrink-0 text-center"
                    >
                        <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mb-2 shadow-lg">
                                <span className="text-white font-medium italic text-sm">
                                    {member.name?.charAt(0) || 'U'}
                                </span>
                            </div>
                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                                member.status === 'online' ? 'bg-green-400' : 
                                member.status === 'away' ? 'bg-yellow-400' : 'bg-gray-400'
                            }`} />
                        </div>
                        <p className="text-xs text-purple-700 font-medium italic truncate w-16">
                            {member.name}
                        </p>
                        <p className="text-xs text-purple-500 italic font-semibold">
                            {member.collection_rate}%
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}