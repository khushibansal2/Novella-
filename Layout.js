import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Heart, Leaf, Mic, Eye, Home, MessageSquare, Bot } from "lucide-react";

export default function Layout({ children, currentPageName }) {
    const location = useLocation();

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap');
                
                body {
                    font-family: 'DM Sans', sans-serif;
                    font-style: italic;
                }
                
                .satoshi {
                    font-family: 'DM Sans', sans-serif;
                    font-weight: 700;
                    letter-spacing: -0.02em;
                    font-style: italic;
                }
                
                /* Falling petals animation */
                .petal {
                    position: absolute;
                    width: 10px;
                    height: 10px;
                    background: radial-gradient(circle, #F72585, #C77DFF);
                    border-radius: 50% 0 50% 0;
                    animation: fall 8s infinite linear;
                    opacity: 0.7;
                }
                
                @keyframes fall {
                    0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
                }
                
                /* Butterfly hover effect */
                .butterfly-float {
                    animation: flutter 3s ease-in-out infinite;
                }
                
                @keyframes flutter {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    25% { transform: translateY(-10px) rotate(2deg); }
                    75% { transform: translateY(-5px) rotate(-1deg); }
                }
                
                /* Bioluminescent glow */
                .bio-glow {
                    box-shadow: 0 0 20px rgba(76, 201, 240, 0.3), 0 0 40px rgba(76, 201, 240, 0.1);
                }
                
                /* Heartbeat pulse */
                .heartbeat {
                    animation: pulse 1.2s ease-in-out infinite;
                }
                
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); }
                }
            `}</style>

            {/* Falling petals */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {[...Array(12)].map((_, i) => (
                    <div
                        key={i}
                        className="petal"
                        style={{
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 8}s`,
                            animationDuration: `${6 + Math.random() * 4}s`
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10">
                {/* Navigation */}
                <nav className="fixed bottom-0 left-0 right-0 bg-black/30 backdrop-blur-xl border-t border-purple-500/30 z-50">
                    <div className="flex justify-around py-2">
                        {[
                            { name: "Home", icon: Home, page: "Home" },
                            { name: "Sync", icon: Heart, page: "HeartSync" },
                            { name: "Chat", icon: MessageSquare, page: "Chat" },
                            { name: "Amora", icon: Bot, page: "Chatbot" },
                            { name: "Garden", icon: Leaf, page: "Garden" },
                            { name: "Voice", icon: Mic, page: "VoiceMood" },
                            { name: "Glimpse", icon: Eye, page: "Glimpse" }
                        ].map((item) => {
                            const isActive = location.pathname === createPageUrl(item.page);
                            return (
                                <Link
                                    key={item.name}
                                    to={createPageUrl(item.page)}
                                    className={`flex flex-col items-center p-2 rounded-lg transition-all duration-300 ${
                                        isActive 
                                            ? 'text-cyan-400 bg-purple-500/20' 
                                            : 'text-purple-300 hover:text-cyan-300'
                                    }`}
                                >
                                    <item.icon className={`w-5 h-5 mb-1 ${isActive ? 'heartbeat' : ''}`} />
                                    <span className="text-xs font-medium italic">{item.name}</span>
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                {/* Main content */}
                <main className="pb-20">
                    {children}
                </main>
            </div>
        </div>
    );
}