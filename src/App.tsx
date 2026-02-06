import { useEffect, useState } from "react";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import Home from "./components/Home/Home";
import { useAppSelector } from "./app/hooks";

const App = () => {
  type Screen = "register" | "login" | "home";

  const pathToScreen = (path: string): Screen => {
    if (path.startsWith("/login")) return "login";
    if (path.startsWith("/home")) return "home";
    return "register";
  };

  const screenToPath = (screen: Screen) => {
    if (screen === "login") return "/login";
    if (screen === "home") return "/home";
    return "/register";
  };

  const [screen, setScreen] = useState<Screen>(
    pathToScreen(window.location.pathname),
  );
  const { isAuthenticated } = useAppSelector((s) => s.auth);

  useEffect(() => {
    const onPopState = () => setScreen(pathToScreen(window.location.pathname));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = (next: Screen) => {
    setScreen(next);
    window.history.pushState({}, "", screenToPath(next));
  };

  return (
    <div className="h-screen">
      {screen === "home" &&
        (isAuthenticated ? (
          <Home onLogout={() => navigate("login")} />
        ) : (
          <Login
            onSuccess={() => navigate("home")}
            onBackToRegister={() => navigate("register")}
          />
        ))}
      {screen === "login" && (
        <Login
          onSuccess={() => navigate("home")}
          onBackToRegister={() => navigate("register")}
        />
      )}
      {screen === "register" && (
        <Register
          onVerifySuccess={() => navigate("login")}
          onLoginClick={() => navigate("login")}
        />
      )}
    </div>
  );
};

export default App;
