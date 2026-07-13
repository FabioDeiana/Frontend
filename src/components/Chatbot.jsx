import { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

function Chatbot() {
  const { user } = useAuth();
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

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
        { role: "assistant", content: "Errore nella risposta. Riprova." },
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
    <div className="fixed bottom-6 right-6 z-50">
      {/* Finestra chat */}
      {open && (
        <div className="bg-white rounded-2xl shadow-xl w-80 mb-4 flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-ocean-700 text-white px-4 py-3 flex justify-between items-center">
            <div>
              <p className="font-semibold text-sm">GreenMap Assistant</p>
              <p className="text-xs text-ocean-200">Powered by AI</p>
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
                Ciao! Come posso aiutarti a trovare attività eco-friendly?
              </p>
            )}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`text-sm px-3 py-2 rounded-xl max-w-[90%] ${
                  msg.role === "user"
                    ? "bg-ocean-700 text-white self-end"
                    : "bg-ocean-50 text-gray-800 self-start"
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
          <div className="border-t border-gray-200 p-3 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Scrivi un messaggio..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-400"
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="bg-ocean-700 text-white px-3 py-2 rounded-lg hover:bg-ocean-800 transition disabled:opacity-50 text-sm font-medium"
            >
              →
            </button>
          </div>
        </div>
      )}

      {/* Bottone flottante */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="bg-ocean-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-ocean-800 transition text-2xl"
      >
        {open ? "✕" : "💬"}
      </button>
    </div>
  );
}

export default Chatbot;