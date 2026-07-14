import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";

function Register() {
  const [searchParams] = useSearchParams();
  const isOwner = searchParams.get("type") === "owner";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [newsletter, setNewsletter] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await api.post("/auth/register", formData);

      login(response.data.user, response.data.accessToken);

      if (newsletter) {
        await api.put("/newsletter/preference", { subscribed: true });
      }

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Errore durante la registrazione");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Foto di sfondo con overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-ocean-800/70" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8"
      >
        <div className="text-center mb-6">
          <span className="text-4xl">🌍</span>
          <h1 className="text-2xl text-ocean-700 mt-2">
            {isOwner ? t("register.titleOwner") : t("register.title")}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isOwner ? t("register.subtitleOwner") : t("register.subtitle")}
          </p>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-100 text-red-700 text-sm px-4 py-2 rounded-xl mb-4"
          >
            {error}
          </motion.p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-ocean-800 mb-1">
              {t("register.name")}
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-ocean-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ocean-400 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ocean-800 mb-1">
              {t("register.email")}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-ocean-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ocean-400 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ocean-800 mb-1">
              {t("register.password")}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border border-ocean-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ocean-400 transition"
            />
          </div>

          <div className="bg-ocean-50 rounded-xl p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={newsletter}
                onChange={(e) => setNewsletter(e.target.checked)}
                className="mt-0.5 accent-coral-500"
              />
              <div>
                <p className="text-sm font-medium text-ocean-800">
                  {t("register.newsletterLabel")}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {t("register.newsletterDesc")}
                </p>
              </div>
            </label>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="bg-coral-500 text-white font-semibold py-3 rounded-xl hover:bg-coral-600 transition disabled:opacity-50 shadow-lg shadow-coral-500/30 mt-2"
          >
            {loading ? t("register.loading") : t("register.submit")}
          </motion.button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-4">
          {t("register.terms")}{" "}
          <Link to="/cookie-policy" className="underline">
            Cookie Policy
          </Link>
        </p>

        <p className="text-sm text-center text-gray-500 mt-4">
          {t("register.hasAccount")}{" "}
          <Link to="/login" className="text-coral-600 font-semibold hover:underline">
            {t("register.login")}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Register;