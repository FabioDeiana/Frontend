import { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";

function Chatbot() {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Mostra la nuvoletta-promemoria dopo 4 secondi, la nasconde dopo altri 6
  useEffect(() => {
    const showTimer = setTimeout(() => setShowHint(true), 4000);
    const hideTimer = setTimeout(() => setShowHint(false), 10000);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await api.post("/chat", {
        message: input,
        preferences: user?.preferences || null,
        language: i18n.language.startsWith("it") ? "italiano" : "english",
      });

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.data.reply },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: t("chatbot.error") },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Finestra chat */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl shadow-xl w-80 mb-4 flex flex-col overflow-hidden border border-ocean-100"
          >
            {/* Header */}
            <div className="bg-ocean-700 text-white px-4 py-3 flex justify-between items-center">
              <div>
                <p className="font-semibold text-sm">{t("chatbot.title")}</p>
                <p className="text-xs text-ocean-200">{t("chatbot.subtitle")}</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-white hover:text-ocean-200 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Messaggi */}
            <div className="flex flex-col gap-3 p-4 h-72 overflow-y-auto">
              {messages.length === 0 && (
                <p className="text-gray-400 text-sm text-center mt-8">
                  {t("chatbot.welcome")}
                </p>
              )}
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`text-sm px-3 py-2 rounded-xl max-w-[90%] ${
                    msg.role === "user"
                      ? "bg-ocean-700 text-white self-end"
                      : "bg-ocean-50 text-ocean-800 self-start"
                  }`}
                >
                  {msg.content}
                </div>
              ))}
              {loading && (
                <div className="bg-ocean-50 text-gray-500 text-sm px-3 py-2 rounded-xl self-start">
                  ...
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-ocean-100 p-3 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("chatbot.placeholder")}
                className="flex-1 border border-ocean-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-400"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="bg-coral-500 text-white px-3 py-2 rounded-lg hover:bg-coral-600 transition disabled:opacity-50 text-sm font-medium"
              >
                →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nuvoletta promemoria */}
      <AnimatePresence>
        {showHint && !open && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-white text-ocean-800 text-sm px-4 py-2 rounded-xl shadow-lg border border-ocean-100 mb-3"
          >
            {t("chatbot.hint")}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottone flottante con etichetta */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, type: "spring", stiffness: 260, damping: 15 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setOpen((prev) => !prev);
          setShowHint(false);
        }}
        className="bg-coral-500 text-white rounded-full shadow-lg shadow-coral-500/30 flex items-center gap-2 px-5 py-3.5 font-semibold hover:bg-coral-600 transition-colors"
      >
        <span className="text-xl">💬</span>
        <span className="hidden sm:inline">{open ? "✕" : t("chatbot.button")}</span>
      </motion.button>
    </div>
  );
}

export default Chatbot;