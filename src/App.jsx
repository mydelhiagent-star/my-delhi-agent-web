import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import PostPropertyPage from "./pages/Dashboard/PostPropertyPage";
import MyPropertiesPage from "./pages/Dashboard/MyPropertiesPage";
import MyClientsPage from "./pages/Dashboard/MyClientsPage";
import PropertyDetails from "./pages/PropertyDetails";
import PropertyPreview from "./pages/PropertyPreview";
import SearchByLocation from "./pages/SearchByLocation";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<AdminLogin />} />
        {/* Legacy dashboard route - redirect to post property */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiredRole="dealer">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        
        {/* New route-based dashboard pages */}
        <Route
          path="/dashboard/post-property"
          element={
            <ProtectedRoute requiredRole="dealer">
              <PostPropertyPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/properties"
          element={
            <ProtectedRoute requiredRole="dealer">
              <MyPropertiesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/clients"
          element={
            <ProtectedRoute requiredRole="dealer">
              <MyClientsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/property/:id" element={<PropertyDetails />} />
        <Route path="/preview/:id" element={<PropertyPreview />} />
      </Routes>
    </Router>
  );
}

export default App;
