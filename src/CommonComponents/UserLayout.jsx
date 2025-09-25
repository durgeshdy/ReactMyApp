import { Outlet } from "react-router-dom";

export default function UserLayout() {
  return (
    <div className="admin-layout">
      <h1>User Layout</h1>
      <Outlet />
    </div>
  );
}