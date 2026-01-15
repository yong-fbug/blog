import { Navigate, Route, Routes } from "react-router-dom";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import { Dashboard } from "./pages/Dashboard";
import { useEffect } from "react";
import { useAppDispatch } from "./app/hooks";
import { getSession } from "./features/auth/authUser";

const App = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getSession());
  }, [dispatch]);
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoutes />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  );
};

export default App;
