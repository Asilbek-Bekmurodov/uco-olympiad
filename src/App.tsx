import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import Home from "./components/Home/Home";
import PublicHero from "./components/Public/PublicHero";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAppSelector } from "./app/hooks";
import Dashboard from "./components/Dashboard/Dashboard";
import Users from "./components/Dashboard/Users/Users";
import { defaultRouteForRole, normalizeRole } from "./utils/roles";
import Exams from "./components/Dashboard/Exams/Exams";
import ExamDetails from "./components/Dashboard/Exams/ExamDetails";
import ExamPage from "./components/Home/ExamPage";
import ResultScreen from "./components/Home/ResultScreen";

const App = () => {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAppSelector((s) => s.auth);
  const normalizedRole = normalizeRole(role);
  const isReady = isAuthenticated && Boolean(normalizedRole);
  const defaultRoute = defaultRouteForRole(normalizedRole);

  useEffect(() => {
    const handler = () => navigate("/login", { replace: true });
    window.addEventListener("auth:logout", handler);
    return () => window.removeEventListener("auth:logout", handler);
  }, [navigate]);

  return (
    <div className="h-screen">
      <Routes>
        <Route
          path="/"
          element={
            isReady ? (
              <Navigate to={defaultRoute} replace />
            ) : (
              <PublicHero
                onLogin={() => navigate("/login")}
                onRegister={() => navigate("/register")}
              />
            )
          }
        />
        <Route
          path="/login"
          element={isReady ? <Navigate to={defaultRoute} replace /> : <Login />}
        />
        <Route
          path="/register"
          element={
            isReady ? <Navigate to={defaultRoute} replace /> : <Register />
          }
        />
        <Route path="/home" element={<Home />}>
          <Route path="my-exam/:testId" element={<ExamPage />} />
          <Route path="result" element={<ResultScreen />} />
        </Route>
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Navigate to="users" replace />} />
          <Route path="users" element={<Users />} />
          <Route path="exams" element={<Exams />} />
          <Route path="exams/:id" element={<ExamDetails />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;
