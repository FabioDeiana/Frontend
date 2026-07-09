import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import PublicRoute from "../components/PublicRoute";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ActivityDetail from "../pages/ActivityDetail";
import Profile from "../pages/Profile";
import BusinessProfile from "../pages/BusinessProfile";
import AdminDashboard from "../pages/AdminDashboard";
import About from "../pages/About";
import CookiePolicy from "../pages/CookiePolicy";
import NotFound from "../pages/NotFound";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
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

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRouter;