import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

function AdminDashboard() {
  const { accessToken } = useAuth();
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("users");

  useEffect(() => {
    async function fetchData() {
      try {
        const [usersRes, activitiesRes] = await Promise.all([
          axios.get("http://localhost:5000/api/admin/users", {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
          axios.get("http://localhost:5000/api/activities", {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
        ]);
        setUsers(usersRes.data);
        setActivities(activitiesRes.data);
      } catch (err) {
        setError("Errore nel caricamento dei dati");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [accessToken]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/admin/users/${userId}`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? response.data.user : u))
      );
    } catch (err) {
      alert("Errore durante l'aggiornamento del ruolo");
    }
  };

  const handleToggleActive = async (userId, currentStatus) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/admin/users/${userId}`,
        { isActive: !currentStatus },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? response.data.user : u))
      );
    } catch (err) {
      alert("Errore durante l'aggiornamento dello stato");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Sei sicuro di voler eliminare questo utente?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      alert(err.response?.data?.message || "Errore durante l'eliminazione");
    }
  };

  const handleDeleteActivity = async (activityId) => {
    if (!confirm("Sei sicuro di voler eliminare questa attività?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/activities/${activityId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setActivities((prev) => prev.filter((a) => a._id !== activityId));
    } catch (err) {
      alert("Errore durante l'eliminazione dell'attività");
    }
  };

  if (loading) return <p className="text-center py-20">Caricamento...</p>;
  if (error) return <p className="text-center py-20 text-red-600">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-green-700 mb-8">
        {t("admin.title")}
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-green-50 rounded-2xl p-6 text-center">
          <p className="text-4xl font-bold text-green-700">{users.length}</p>
          <p className="text-gray-600 mt-1">{t("admin.registeredUsers")}</p>
        </div>
        <div className="bg-green-50 rounded-2xl p-6 text-center">
          <p className="text-4xl font-bold text-green-700">{activities.length}</p>
          <p className="text-gray-600 mt-1">{t("admin.activities")}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-5 py-2 rounded-full font-medium transition ${
            activeTab === "users"
              ? "bg-green-700 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {t("admin.users")}
        </button>
        <button
          onClick={() => setActiveTab("activities")}
          className={`px-5 py-2 rounded-full font-medium transition ${
            activeTab === "activities"
              ? "bg-green-700 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {t("admin.activities")}
        </button>
      </div>

      {/* Tab Utenti */}
      {activeTab === "users" && (
        <div className="flex flex-col gap-4">
          {users.map((u) => (
            <div
              key={u._id}
              className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <p className="font-medium">{u.name}</p>
                <p className="text-sm text-gray-500">{u.email}</p>
                <span
                  className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mt-1 ${
                    u.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {u.isActive ? t("admin.active") : t("admin.disabled")}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 items-center">
                <select
                  value={u.role}
                  onChange={(e) => handleRoleChange(u._id, e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="user">user</option>
                  <option value="owner">owner</option>
                  <option value="admin">admin</option>
                </select>

                <button
                  onClick={() => handleToggleActive(u._id, u.isActive)}
                  className={`text-sm px-3 py-1 rounded-lg font-medium transition ${
                    u.isActive
                      ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                      : "bg-green-100 text-green-700 hover:bg-green-200"
                  }`}
                >
                  {u.isActive ? t("admin.disable") : t("admin.enable")}
                </button>

                <button
                  onClick={() => handleDeleteUser(u._id)}
                  className="text-sm px-3 py-1 rounded-lg font-medium bg-red-100 text-red-600 hover:bg-red-200 transition"
                >
                  {t("admin.delete")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab Attività */}
      {activeTab === "activities" && (
        <div className="flex flex-col gap-4">
          {activities.map((a) => (
            <div
              key={a._id}
              className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <p className="font-medium">{a.name}</p>
                <p className="text-sm text-gray-500">{a.city} — {a.category}</p>
                <span
                  className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mt-1 ${
                    a.verified
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {a.verified ? t("admin.verified") : t("admin.notVerified")}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleDeleteActivity(a._id)}
                  className="text-sm px-3 py-1 rounded-lg font-medium bg-red-100 text-red-600 hover:bg-red-200 transition"
                >
                  {t("admin.delete")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;