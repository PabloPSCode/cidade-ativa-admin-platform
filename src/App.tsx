import { useEffect } from "react";
import Routes from "./routes";
import { useThemeStore } from "./store/theme";
import "./styles/globals.css";

function App() {
  const { theme } = useThemeStore();

  useEffect(() => {
    if (theme) {
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [theme]);

  return (
    <div className="tesla-theme min-h-screen w-full">
      <Routes />
    </div>
  );
}

export default App;
