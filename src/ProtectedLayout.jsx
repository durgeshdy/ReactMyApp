// ProtectedLayout.js
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedLayout({ allowedRole, Layout }) {
  
  const role = localStorage.getItem("role");

  if (!role) {
    return <Navigate to="/login" />;
  }

  if (role !== allowedRole) {
    return <Navigate to="/login" />;
  }

  // ✅ Proper way to render a component passed as prop
  const LayoutComponent = Layout;

  return (
    <LayoutComponent>
      <Outlet />
    </LayoutComponent>
  );
}
