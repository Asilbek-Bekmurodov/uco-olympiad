import { useEffect, useState } from "react";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import Home from "./components/Home/Home";
import PublicHero from "./components/Public/PublicHero";
import { useAppSelector } from "./app/hooks";

const App = () => {
  type Screen = "public" | "register" | "login" | "home";

  const pathToScreen = (path: string): Screen => {
    if (path.startsWith("/login")) return "login";
    if (path.startsWith("/register")) return "register";
    if (path.startsWith("/home")) return "home";
    return "public";
  };

  const screenToPath = (screen: Screen) => {
    if (screen === "login") return "/login";
    if (screen === "register") return "/register";
    if (screen === "home") return "/home";
    return "/";
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
      {screen === "public" && (
        <PublicHero
          onLogin={() => navigate("login")}
          onRegister={() => navigate("register")}
        />
      )}
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
