
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User } from "@/entities/all";
import { Heart, Sparkles, MapPin, X, Star } from "lucide-react";
import RealisticButterfly from "../components/dating/RealisticButterfly";
import ButterflyBurst from "../Components/dating/ButterflyBurst";
import ButterflyAnimation from "../Components/dating/ButterflyAnimation";

const initialMatches = [
    {
        id: 1,
        name: "Lily Chen",
        age: 26,
        bio: "Dancing through life with butterflies in my heart 🦋",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
        distance: "2 miles away",
        currentBpm: 78,
        syncLevel: 87,
        butterflyType: "morpho",
        lastSeen: "Active now"
    },
    {
        id: 2,
        name: "Sofia Luna",
        age: 24,
        bio: "Artist & dreamer seeking authentic connections ✨",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
        distance: "5 miles away", 
        currentBpm: 92,
        syncLevel: 94,
        butterflyType: "swallowtail",
        lastSeen: "2 hours ago"
    },
    {
        id: 3,
        name: "Zara Moon",
        age: 28,
        bio: "Yoga instructor with a wild heart 🌙",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
        distance: "1 mile away",
        currentBpm: 65,
        syncLevel: 76,
        butterflyType: "monarch",
        lastSeen: "30 minutes ago"
    },
    {
        id: 4,
        name: "Aria Chen",
        age: 25,
        bio: "Musician who believes in soul connections 🎵",
        avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400",
        distance: "3 miles away",
        currentBpm: 73,
        syncLevel: 82,
        butterflyType: "swallowtail",
        lastSeen: "1 hour ago"
    }
];

export default function Home() {
    const [matches, setMatches] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [flutterTrigger, setFlutterTrigger] = useState(0);
    
    // Using useMemo to prevent re-shuffling on every render
    const profileStack = useMemo(() => initialMatches, []);
    const [activeCardIndex, setActiveCardIndex] = useState(profileStack.length - 1);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const user = await User.me();
            setCurrentUser(user);
        } catch (error) {
            console.log("User not logged in");
        }
    };
    
    const handleSwipe = (direction) => {
        if (activeCardIndex < 0) return;

        if (direction === 'right') {
            setFlutterTrigger(prev => prev + 1); // Trigger butterfly burst
            console.log(`Flutter sent to ${profileStack[activeCardIndex].name}!`);
        } else {
            console.log(`Passed on ${profileStack[activeCardIndex].name}`);
        }
        
        setActiveCardIndex(prev => prev - 1);
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 50, scale: 0.8 },
        visible: { opacity: 1, y: 0, scale: 1 },
        exit: (direction) => ({
            x: direction === 'right' ? 300 : -300,
            opacity: 0,
            rotate: direction === 'right' ? 20 : -20,
            transition: { duration: 0.3 }
        })
    };
    
    return (
        <div className="min-h-screen p-4 flex flex-col justify-center">
            <ButterflyBurst trigger={flutterTrigger} />
            
            {/* Header */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-4 pt-8"
            >
                <h1 className="text-4xl font-bold satoshi text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500 mb-2 italic">
                    Novella
                </h1>
                <p className="text-purple-300 italic">Where hearts sync and stories begin</p>
            </motion.div>

            {/* Profile Card Stack */}
            <div className="flex-grow flex items-center justify-center relative mb-20">
                <AnimatePresence custom>
                    {activeCardIndex >= 0 ? (
                        <motion.div
                            key={profileStack[activeCardIndex].id}
                            custom={activeCardIndex}
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            onDragEnd={(event, { offset, velocity }) => {
                                const swipeThreshold = 50;
                                if (offset.x > swipeThreshold) {
                                    handleSwipe('right');
                                } else if (offset.x < -swipeThreshold) {
                                    handleSwipe('left');
                                }
                            }}
                            className="bg-black/30 backdrop-blur-xl rounded-3xl overflow-hidden border border-purple-500/20 bio-glow w-[90vw] max-w-sm cursor-grab active:cursor-grabbing"
                            style={{ height: "65vh" }}
                        >
                            <div className="relative flex-1" style={{ height: "calc(100% - 80px)" }}>
                                <img 
                                    src={profileStack[activeCardIndex].avatar} 
                                    alt={profileStack[activeCardIndex].name}
                                    className="w-full h-full object-cover"
                                />
                                
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                                <div className="absolute top-4 right-4">
                                    <RealisticButterfly 
                                        bpm={profileStack[activeCardIndex].currentBpm}
                                        size="medium"
                                        species={profileStack[activeCardIndex].butterflyType}
                                    />
                                </div>
                                
                                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                    <h3 className="text-3xl font-bold satoshi text-white italic">
                                        {profileStack[activeCardIndex].name}, {profileStack[activeCardIndex].age}
                                    </h3>
                                    <p className="text-purple-200 mt-2 mb-3 italic">{profileStack[activeCardIndex].bio}</p>
                                    <div className="flex items-center gap-2 text-cyan-400 text-sm italic">
                                        <MapPin className="w-4 h-4" />
                                        <span>{profileStack[activeCardIndex].distance}</span>
                                    </div>
                                    <div className="flex items-center justify-between mt-4">
                                         <div className="flex items-center gap-2 bg-black/50 backdrop-blur-lg rounded-full px-3 py-1">
                                            <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 60 / profileStack[activeCardIndex].currentBpm, repeat: Infinity }} >
                                                <Heart className="w-4 h-4 text-red-400 fill-current" />
                                            </motion.div>
                                            <span className="text-white text-sm font-bold italic">{profileStack[activeCardIndex].currentBpm}</span>
                                        </div>
                                        <div className="bg-gradient-to-r from-cyan-500/80 to-pink-500/80 backdrop-blur-lg rounded-full px-3 py-1 flex items-center gap-1">
                                            <Sparkles className="w-4 h-4 text-white" />
                                            <span className="text-white text-sm font-bold italic">{profileStack[activeCardIndex].syncLevel}% sync</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Swipe Buttons */}
                            <div className="flex justify-around bg-black/50 backdrop-blur-sm p-4 h-20">
                                <motion.button
                                    onClick={() => handleSwipe('left')}
                                    whileHover={{ scale: 1.1 }} 
                                    whileTap={{ scale: 0.9 }}
                                    className="bg-white/10 border-2 border-pink-500/50 rounded-full px-8 py-3 text-pink-500 font-semibold italic hover:bg-pink-500/20 transition-all text-lg"
                                >
                                    Pass
                                </motion.button>
                                <motion.button
                                    onClick={() => handleSwipe('right')}
                                    whileHover={{ scale: 1.1 }} 
                                    whileTap={{ scale: 0.9 }}
                                    className="bg-white/10 border-2 border-cyan-400/50 rounded-full px-6 py-3 text-cyan-400 font-semibold italic hover:bg-cyan-400/20 transition-all flex items-center gap-2 text-lg"
                                >
                                    <ButterflyAnimation bpm={90} size="small" color="#4CC9F0" />
                                    Flutter
                                </motion.button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                            <div className="mb-4">
                                <RealisticButterfly size="large" species="morpho" bpm={70} />
                            </div>
                            <p className="text-purple-300 italic">That's everyone for now!</p>
                            <p className="text-purple-400 text-sm mt-1 italic">Come back later for new stories to begin.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
