import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
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
      const response = await api.post("/auth/login", formData);
      login(response.data.user, response.data.accessToken);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Errore durante il login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Foto di sfondo con overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
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
            {t("login.title")}
          </h1>
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
              {t("login.email")}
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
              {t("login.password")}
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

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="bg-coral-500 text-white font-semibold py-3 rounded-xl hover:bg-coral-600 transition disabled:opacity-50 shadow-lg shadow-coral-500/30 mt-2"
          >
            {loading ? t("login.loading") : t("login.submit")}
          </motion.button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-6">
          {t("login.noAccount")}{" "}
          <Link to="/register" className="text-coral-600 font-semibold hover:underline">
            {t("login.register")}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;