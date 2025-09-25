import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="admin-layout">
           <h1>Admin Layout</h1>

      <Outlet />
    </div>
  );
}