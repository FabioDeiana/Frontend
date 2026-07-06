import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function Register() {
  const [searchParams] = useSearchParams();
  const isOwner = searchParams.get("type") === "owner";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData,
        { withCredentials: true }
      );

      login(response.data.user, response.data.accessToken);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Errore durante la registrazione");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-green-700 mb-2 text-center">
          {isOwner ? "Registra la tua attività" : "Crea un account"}
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          {isOwner
            ? "Crea un account owner per gestire la tua attività su GreenMap"
            : "Unisciti alla community di GreenMap"}
        </p>

        {error && (
          <p className="bg-red-100 text-red-700 text-sm px-4 py-2 rounded-lg mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-green-700 text-white font-semibold py-2 rounded-lg hover:bg-green-800 transition disabled:opacity-50"
          >
            {loading ? "Registrazione in corso..." : "Registrati"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-6">
          Hai già un account?{" "}
          <Link to="/login" className="text-green-700 font-medium hover:underline">
            Accedi
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;