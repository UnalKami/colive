import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute({ roles }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("rol");

  if (!token || !userRole || !roles.includes(userRole)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}