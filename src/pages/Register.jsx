import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

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
    <div className="min-h-screen bg-ocean-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-ocean-700 mb-2 text-center">
          {isOwner ? t("register.titleOwner") : t("register.title")}
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          {isOwner ? t("register.subtitleOwner") : t("register.subtitle")}
        </p>

        {error && (
          <p className="bg-red-100 text-red-700 text-sm px-4 py-2 rounded-lg mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("register.name")}
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ocean-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("register.email")}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ocean-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("register.password")}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ocean-400"
            />
          </div>

          <div className="bg-ocean-50 rounded-xl p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={newsletter}
                onChange={(e) => setNewsletter(e.target.checked)}
                className="mt-0.5 accent-ocean-600"
              />
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {t("register.newsletterLabel")}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {t("register.newsletterDesc")}
                </p>
              </div>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-coral-500 hover:bg-coral-600"
          >
            {loading ? t("register.loading") : t("register.submit")}
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-4">
          {t("register.terms")}{" "}
          <Link to="/cookie-policy" className="underline">
            Cookie Policy
          </Link>
        </p>

        <p className="text-sm text-center text-gray-600 mt-4">
          {t("register.hasAccount")}{" "}
          <Link to="/login" className="text-ocean-700 font-medium hover:underline">
            {t("register.login")}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;