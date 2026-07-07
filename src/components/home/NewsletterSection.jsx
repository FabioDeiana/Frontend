import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

function NewsletterSection() {
  const { user, accessToken } = useAuth();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // "success" | "error"
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!email) return;
    setLoading(true);
    setStatus(null);

    try {
      await axios.post("http://localhost:5000/api/newsletter/subscribe", { email });
      setStatus("success");
      setMessage("Iscrizione avvenuta con successo! Grazie.");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err.response?.data?.message || "Errore durante l'iscrizione");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (subscribed) => {
    setLoading(true);
    setStatus(null);

    try {
      await axios.put(
        "http://localhost:5000/api/newsletter/preference",
        { subscribed },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setStatus("success");
      setMessage(subscribed ? "Iscritto alla newsletter!" : "Disiscrizione avvenuta con successo.");
    } catch (err) {
      setStatus("error");
      setMessage("Errore durante l'aggiornamento della preferenza");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 px-6 bg-green-50">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-green-700 mb-3">
          Resta aggiornato
        </h2>
        <p className="text-gray-600 mb-2">
          Iscriviti alla newsletter per ricevere aggiornamenti sulle nuove attività eco-friendly nella tua zona.
        </p>
        <p className="text-sm text-gray-400 mb-8">
          Utilizziamo la tua email solo per inviarti aggiornamenti di GreenMap. Nessuno spam, puoi cancellarti in qualsiasi momento.
        </p>

        {status && (
          <p className={`text-sm px-4 py-2 rounded-lg mb-4 ${
            status === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}>
            {message}
          </p>
        )}

        {user ? (
          // Utente loggato — toggle iscrizione
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => handleToggle(true)}
              disabled={loading}
              className="bg-green-700 text-white font-semibold px-6 py-3 rounded-full hover:bg-green-800 transition disabled:opacity-50"
            >
              Iscrivimi
            </button>
            <button
              onClick={() => handleToggle(false)}
              disabled={loading}
              className="bg-white text-green-700 font-semibold px-6 py-3 rounded-full border border-green-700 hover:bg-green-50 transition disabled:opacity-50"
            >
              Cancella iscrizione
            </button>
          </div>
        ) : (
          // Utente anonimo — form email
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="La tua email"
              className="border border-gray-300 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 sm:w-72"
            />
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="bg-green-700 text-white font-semibold px-6 py-3 rounded-full hover:bg-green-800 transition disabled:opacity-50"
            >
              {loading ? "Invio..." : "Iscriviti"}
            </button>
          </div>
        )}

        <p className="text-xs text-gray-400 mt-4">
          Per cancellarti in qualsiasi momento scrivi a{" "}
          <span className="underline">privacy@greenmap.it</span> oppure usa il bottone "Cancella iscrizione" qui sopra.
        </p>
      </div>
    </section>
  );
}

export default NewsletterSection;