import { useAppSelector } from "../app/hooks";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  const user = useAppSelector((state) => state.auth.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoutes;
