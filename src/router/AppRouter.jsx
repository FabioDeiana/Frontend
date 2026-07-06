import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ActivityDetail from "../pages/ActivityDetail";
import Profile from "../pages/Profile";
import BusinessProfile from "../pages/BusinessProfile";
import AdminDashboard from "../pages/AdminDashboard";
import About from "../pages/About";
import CookiePolicy from "../pages/CookiePolicy";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/activity/:id" element={<ActivityDetail />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/business"
        element={
          <ProtectedRoute allowedRoles={["owner", "admin"]}>
            <BusinessProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/about" element={<About />} />
      <Route path="/cookie-policy" element={<CookiePolicy />} />
    </Routes>
  );
}

export default AppRouter;