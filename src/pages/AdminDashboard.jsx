import { useState, useEffect } from "react";
import api from "../services/api";
import { useTranslation } from "react-i18next";

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

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-ocean-700 mb-8">
        {t("admin.title")}
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-ocean-50 rounded-2xl p-6 text-center">
          <p className="text-4xl font-bold text-ocean-700">{users.length}</p>
          <p className="text-gray-600 mt-1">{t("admin.registeredUsers")}</p>
        </div>
        <div className="bg-ocean-50 rounded-2xl p-6 text-center">
          <p className="text-4xl font-bold text-ocean-700">{activities.length}</p>
          <p className="text-gray-600 mt-1">{t("admin.activities")}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-5 py-2 rounded-full font-medium transition ${
            activeTab === "users"
              ? "bg-ocean-700 text-white"
              : "bg-ocean-50 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {t("admin.users")}
        </button>
        <button
          onClick={() => setActiveTab("activities")}
          className={`px-5 py-2 rounded-full font-medium transition ${
            activeTab === "activities"
              ? "bg-ocean-700 text-white"
              : "bg-ocean-50 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {t("admin.activities")}
        </button>
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-5 py-2 rounded-full font-medium transition ${
            activeTab === "pending"
              ? "bg-ocean-700 text-white"
              : "bg-ocean-50 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {t("admin.pending")}
          {pendingActivities.length > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {pendingActivities.length}
            </span>
          )}
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
                      ? "bg-ocean-100 text-ocean-700"
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
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-400"
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
                      : "bg-ocean-100 text-ocean-700 hover:bg-ocean-100"
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
                <p className="text-sm text-gray-500">{a.city} — {t(`categories.${a.category}`)}</p>
                <span
                  className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mt-1 ${
                    a.verified
                      ? "bg-sun-100 text-ocean-700"
                      : "bg-ocean-50 text-gray-500"
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

      {/* Tab In attesa */}
      {activeTab === "pending" && (
        <div className="flex flex-col gap-4">
          {pendingActivities.length === 0 ? (
            <p className="text-gray-500 text-sm">{t("admin.noPending")}</p>
          ) : (
            pendingActivities.map((a) => (
              <div
                key={a._id}
                className="bg-white border border-gray-100 rounded-2xl p-4"
              >
                <div className="mb-3">
                  <p className="font-medium">{a.name}</p>
                  <p className="text-sm text-gray-500">
                    {a.city} — {t(`categories.${a.category}`)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{a.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{a.address}</p>
                  {a.createdBy && (
                    <p className="text-xs text-gray-400 mt-1">
                      {t("admin.proposedBy")}: {a.createdBy.name} ({a.createdBy.email})
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {a.tags?.diet?.map((tag) => (
                      <span key={tag} className="bg-ocean-50 text-ocean-700 text-xs px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                    {a.tags?.accessibility?.map((tag) => (
                      <span key={tag} className="bg-ocean-100 text-ocean-700 text-xs px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleModerate(a._id, "approved")}
                    className="text-sm px-4 py-1.5 rounded-lg font-medium bg-ocean-100 text-ocean-700 hover:bg-ocean-100 transition"
                  >
                    ✓ {t("admin.approve")}
                  </button>
                  <button
                    onClick={() => handleModerate(a._id, "rejected")}
                    className="text-sm px-4 py-1.5 rounded-lg font-medium bg-red-100 text-red-600 hover:bg-red-200 transition"
                  >
                    ✕ {t("admin.reject")}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;