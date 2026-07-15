import { useState, useEffect } from "react";
import api from "../services/api";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";

function AdminDashboard() {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [pendingActivities, setPendingActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("users");

  useEffect(() => {
    async function fetchData() {
      try {
        const [usersRes, activitiesRes, pendingRes] = await Promise.all([
          api.get("/admin/users"),
          api.get("/activities"),
          api.get("/activities/pending"),
        ]);
        setUsers(usersRes.data);
        setActivities(activitiesRes.data);
        setPendingActivities(pendingRes.data);
      } catch (err) {
        setError("Errore nel caricamento dei dati");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await api.put(`/admin/users/${userId}`, { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? response.data.user : u))
      );
    } catch (err) {
      alert("Errore durante l'aggiornamento del ruolo");
    }
  };

  const handleToggleActive = async (userId, currentStatus) => {
    try {
      const response = await api.put(`/admin/users/${userId}`, {
        isActive: !currentStatus,
      });
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
      await api.delete(`/admin/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      alert(err.response?.data?.message || "Errore durante l'eliminazione");
    }
  };

  const handleDeleteActivity = async (activityId) => {
    if (!confirm("Sei sicuro di voler eliminare questa attività?")) return;
    try {
      await api.delete(`/activities/${activityId}`);
      setActivities((prev) => prev.filter((a) => a._id !== activityId));
    } catch (err) {
      alert("Errore durante l'eliminazione dell'attività");
    }
  };

  const handleModerate = async (activityId, status) => {
    try {
      const response = await api.put(`/activities/${activityId}/moderate`, { status });
      setPendingActivities((prev) => prev.filter((a) => a._id !== activityId));
      if (status === "approved") {
        setActivities((prev) => [...prev, response.data.activity]);
      }
    } catch (err) {
      alert("Errore durante la moderazione");
    }
  };

  if (loading) return <p className="text-center py-20">Caricamento...</p>;
  if (error) return <p className="text-center py-20 text-red-600">{error}</p>;

  const tabs = [
    { id: "users", label: t("admin.users") },
    { id: "activities", label: t("admin.activities") },
    { id: "pending", label: t("admin.pending"), badge: pendingActivities.length },
  ];

  return (
    <div className="bg-ocean-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl text-ocean-700 mb-8"
        >
          🛠️ {t("admin.title")}
        </motion.h1>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-white rounded-3xl p-6 text-center shadow-sm">
            <p className="text-4xl font-bold text-ocean-700">{users.length}</p>
            <p className="text-gray-500 mt-1 text-sm">{t("admin.registeredUsers")}</p>
          </div>
          <div className="bg-white rounded-3xl p-6 text-center shadow-sm">
            <p className="text-4xl font-bold text-mint-500">{activities.length}</p>
            <p className="text-gray-500 mt-1 text-sm">{t("admin.activities")}</p>
          </div>
          <div className="bg-white rounded-3xl p-6 text-center shadow-sm">
            <p className="text-4xl font-bold text-coral-500">{pendingActivities.length}</p>
            <p className="text-gray-500 mt-1 text-sm">{t("admin.pending")}</p>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-full font-medium transition ${
                activeTab === tab.id
                  ? "bg-ocean-700 text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-ocean-100 shadow-sm"
              }`}
            >
              {tab.label}
              {tab.badge > 0 && (
                <span className="ml-2 bg-coral-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Utenti */}
        {activeTab === "users" && (
          <div className="flex flex-col gap-4">
            {users.map((u, index) => (
              <motion.div
                key={u._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-ocean-700 text-white rounded-full flex items-center justify-center font-bold shrink-0">
                    {u.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-ocean-800">{u.name}</p>
                    <p className="text-sm text-gray-500">{u.email}</p>
                    <span
                      className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mt-1 ${
                        u.isActive
                          ? "bg-mint-100 text-mint-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {u.isActive ? t("admin.active") : t("admin.disabled")}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 items-center">
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    className="border border-ocean-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-400"
                  >
                    <option value="user">user</option>
                    <option value="owner">owner</option>
                    <option value="admin">admin</option>
                  </select>

                  <button
                    onClick={() => handleToggleActive(u._id, u.isActive)}
                    className={`text-sm px-3 py-1.5 rounded-xl font-medium transition ${
                      u.isActive
                        ? "bg-sun-100 text-ocean-800 hover:bg-sun-300"
                        : "bg-mint-100 text-mint-700 hover:bg-mint-100"
                    }`}
                  >
                    {u.isActive ? t("admin.disable") : t("admin.enable")}
                  </button>

                  <button
                    onClick={() => handleDeleteUser(u._id)}
                    className="text-sm px-3 py-1.5 rounded-xl font-medium bg-red-100 text-red-600 hover:bg-red-200 transition"
                  >
                    {t("admin.delete")}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Tab Attività */}
        {activeTab === "activities" && (
          <div className="flex flex-col gap-4">
            {activities.map((a, index) => (
              <motion.div
                key={a._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
              >
                <div>
                  <p className="font-semibold text-ocean-800">{a.name}</p>
                  <p className="text-sm text-gray-500">{a.city} — {t(`categories.${a.category}`)}</p>
                  <span
                    className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mt-1 ${
                      a.verified
                        ? "bg-sun-100 text-ocean-800"
                        : "bg-ocean-100 text-gray-500"
                    }`}
                  >
                    {a.verified ? t("admin.verified") : t("admin.notVerified")}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleDeleteActivity(a._id)}
                    className="text-sm px-3 py-1.5 rounded-xl font-medium bg-red-100 text-red-600 hover:bg-red-200 transition"
                  >
                    {t("admin.delete")}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Tab In attesa */}
        {activeTab === "pending" && (
          <div className="flex flex-col gap-4">
            {pendingActivities.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center shadow-sm">
                <span className="text-4xl">✅</span>
                <p className="text-gray-500 text-sm mt-3">{t("admin.noPending")}</p>
              </div>
            ) : (
              pendingActivities.map((a, index) => (
                <motion.div
                  key={a._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white rounded-3xl p-6 shadow-sm border-l-4 border-coral-500"
                >
                  <div className="mb-4">
                    <p className="font-semibold text-ocean-800 text-lg">{a.name}</p>
                    <p className="text-sm text-gray-500">
                      📍 {a.address}, {a.city} — {t(`categories.${a.category}`)}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">{a.description}</p>
                    {a.createdBy && (
                      <p className="text-xs text-gray-400 mt-2">
                        {t("admin.proposedBy")}: {a.createdBy.name} ({a.createdBy.email})
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1 mt-3">
                      {a.tags?.diet?.map((tag) => (
                        <span key={tag} className="bg-mint-100 text-mint-700 text-xs px-2 py-0.5 rounded-full">
                          🥗 {tag}
                        </span>
                      ))}
                      {a.tags?.accessibility?.map((tag) => (
                        <span key={tag} className="bg-ocean-100 text-ocean-700 text-xs px-2 py-0.5 rounded-full">
                          ♿ {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleModerate(a._id, "approved")}
                      className="text-sm px-5 py-2 rounded-xl font-semibold bg-mint-500 text-white hover:bg-mint-700 transition"
                    >
                      ✓ {t("admin.approve")}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleModerate(a._id, "rejected")}
                      className="text-sm px-5 py-2 rounded-xl font-semibold bg-red-100 text-red-600 hover:bg-red-200 transition"
                    >
                      ✕ {t("admin.reject")}
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;