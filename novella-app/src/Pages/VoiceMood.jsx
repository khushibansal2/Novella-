import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Send, Sparkles } from "lucide-react";

// --- Custom Button Component ---
const Button = ({ onClick, disabled, className, children }) => (
  <button onClick={onClick} disabled={disabled} className={className}>
    {children}
  </button>
);

export default function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [currentMood, setCurrentMood] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [voiceMessages, setVoiceMessages] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const recognitionRef = useRef(null);

  // --- Mood Categories ---
  const moodTypes = {
    golden_pollen: {
      name: "Golden Pollen",
      color: "#FFD700",
      emoji: "✨",
      description: "Flirty and playful",
      particles: "sparkle",
    },
    blue_mist: {
      name: "Blue Mist",
      color: "#4CC9F0",
      emoji: "🌊",
      description: "Calm and sorrowful tone",
      particles: "waves",
    },
    silver_whisper: {
      name: "Silver Whisper",
      color: "#C0C0C0",
      emoji: "🌙",
      description: "Mysterious and intimate",
      particles: "shimmer",
    },
    rose_ember: {
      name: "Rose Ember",
      color: "#F72585",
      emoji: "🔥",
      description: "Passionate and intense",
      particles: "fire",
    },
    neutral: {
      name: "Clear Light",
      color: "#E0E0E0",
      emoji: "⚪",
      description: "A balanced and neutral tone",
      particles: "shimmer",
    },
  };

  // --- Detect Mood From Text ---
  const detectMood = (text) => {
    const lower = text.toLowerCase();
    const moodKeywords = {
      golden_pollen: [
        "haha",
        "lol",
        "funny",
        "play",
        "cute",
        "sweet",
        "giggle",
        "flirty",
        "hug",
        "playful",
      ],
      rose_ember: ["happy", "want", "love", "joy", "excited","thrilled","desired","passion", "intense"],
      blue_mist: ["sad", "down", "tired", "calm","quiet","alone", "thoughtful", "serene"],
      silver_whisper: [
        "mystery",
        "secret",
        "whisper",
        "hidden",
        "intimate",
        "hush",
      ],
    };

    for (const mood in moodKeywords) {
      if (moodKeywords[mood].some((keyword) => lower.includes(keyword))) {
        return mood;
      }
    }

    return "neutral"; // default mood
  };

  // --- Start Recording ---
  const startRecording = () => {
    if (!("webkitSpeechRecognition" in window)) {
      setErrorMessage("Speech Recognition not supported in this browser. Please use a different browser like Google Chrome.");
      return;
    }
    setErrorMessage("");

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsRecording(true);
      setTranscript("");
      setCurrentMood(null);
    };

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      const mood = detectMood(text);
      setCurrentMood(mood);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event);
      setErrorMessage("Error during speech recognition. Please try again.");
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  // --- Stop Recording ---
  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  // --- Send Message (local version) ---
  const sendVoiceMessage = () => {
    if (currentMood) {
      const newMessage = {
        id: Date.now(), // Unique ID for local state
        senderId: "local-user",
        mood: currentMood,
        description: moodTypes[currentMood].description,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        transcript: transcript,
      };

      setVoiceMessages(prevMessages => [newMessage, ...prevMessages]);
      setCurrentMood(null);
      setTranscript("");
    }
  };

  // --- Mood Particles ---
  const MoodParticles = ({ mood }) => {
    const moodConfig = moodTypes[mood];

    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{ backgroundColor: moodConfig.color }}
            initial={{
              x: Math.random() * 300,
              y: Math.random() * 300,
              opacity: 0.8,
            }}
            animate={{
              x: Math.random() * 300,
              y: Math.random() * 300,
              opacity: [0.8, 0.2, 0.8],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen p-4 pt-16 font-[Inter] text-white bg-gradient-to-br from-gray-900 to-purple-950">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold satoshi text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500 mb-2">
          Voice Mood Analyzer
        </h1>
        <p className="text-purple-300 italic">
          Transform your voice into beautiful emotions
        </p>
      </motion.div>

      {/* Recording Interface */}
      <div className="bg-black/20 backdrop-blur-xl rounded-3xl p-8 mb-8 border border-purple-500/30 text-center relative">
        <AnimatePresence>
          {currentMood && <MoodParticles mood={currentMood} key="particles" />}
        </AnimatePresence>

        <AnimatePresence>
          {isRecording && (
            <motion.div
              key="recording"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="mb-6"
            >
              <div className="text-cyan-400 mb-4">
                <div className="text-lg font-semibold italic">
                  Listening to your voice...
                </div>
                <div className="text-sm opacity-80">
                  Analyzing emotional patterns
                </div>
              </div>
              <div className="flex justify-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 rounded-full bg-gradient-to-t from-cyan-400 to-pink-500"
                    animate={{
                      height: [20, 60, 20],
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Current mood result */}
        <AnimatePresence>
          {currentMood && !isRecording && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <div className="text-center">
                <div className="text-4xl mb-2">
                  {moodTypes[currentMood].emoji}
                </div>
                <h3
                  className="text-2xl font-bold satoshi mb-2"
                  style={{ color: moodTypes[currentMood].color }}
                >
                  {moodTypes[currentMood].name}
                </h3>
                <p className="text-purple-200 italic mb-4">
                  {moodTypes[currentMood].description}
                </p>
                <Button
                  onClick={sendVoiceMessage}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 p-4 rounded-xl font-bold text-white shadow-lg transition-all w-full"
                  disabled={false}
                >
                  <Send className="w-4 h-4 mr-2 inline-block" />
                  Save Voice Mood
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Record button */}
        {!currentMood && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={false}
              className={`w-24 h-24 rounded-full ${
                isRecording
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600"
              } text-white border-4 border-white/30 transition-all duration-300`}
            >
              {isRecording ? (
                <MicOff className="w-10 h-10" />
              ) : (
                <Mic className="w-10 h-10" />
              )}
            </Button>
          </motion.div>
        )}

        <p className="text-purple-300 text-sm mt-4 italic">
          {isRecording
            ? "Recording your voice patterns..."
            : currentMood
              ? "Mood analyzed! Save to history"
              : "Tap to record a voice message"}
        </p>

        {errorMessage && (
          <p className="text-red-400 text-sm mt-2 italic">{errorMessage}</p>
        )}
        {transcript && (
          <p className="text-sm text-purple-200 mt-2 italic">
            Transcript: "{transcript}"
          </p>
        )}
      </div>

      {/* Mood Guide */}
      <div className="bg-black/20 backdrop-blur-xl rounded-3xl p-6 mb-8 border border-purple-500/30">
        <h2 className="text-xl font-semibold text-white mb-4 italic flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          Mood Spectrum
        </h2>

        <div className="grid grid-cols-2 gap-3">
          {Object.entries(moodTypes).map(([key, mood]) => (
            <div
              key={key}
              className="p-3 bg-white/5 rounded-lg border border-gray-600/30"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{mood.emoji}</span>
                <span
                  className="font-semibold"
                  style={{ color: mood.color }}
                >
                  {mood.name}
                </span>
              </div>
              <p className="text-gray-300 text-sm italic">
                {mood.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Voice Message History */}
      <div className="bg-black/20 backdrop-blur-xl rounded-3xl p-6 border border-purple-500/30">
        <h2 className="text-xl font-semibold text-white mb-4 italic">
          Recent Voice Messages
        </h2>

        <div className="space-y-3">
          <AnimatePresence>
            {voiceMessages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-4 rounded-2xl bg-purple-600/30 ml-8"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">
                      {moodTypes[message.mood]?.emoji || "⚪"}
                    </span>
                    <span
                      className="font-semibold"
                      style={{ color: moodTypes[message.mood]?.color || "#E0E0E0" }}
                    >
                      {moodTypes[message.mood]?.name || "Unknown"}
                    </span>
                  </div>
                  <span className="text-purple-300 text-sm">
                    {message.timestamp}
                  </span>
                </div>
                <p className="text-purple-200 italic text-sm">
                  {message.description}
                </p>
                {message.transcript && (
                  <p className="text-gray-400 text-xs italic mt-2">
                    "{message.transcript}"
                  </p>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

