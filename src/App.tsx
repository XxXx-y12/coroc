import { useState } from "react";
import { ToastProvider } from "./contexts/ToastContext";
// @ts-ignore
import WelcomeScreen from "./components/WelcomeScreen.jsx";
// @ts-ignore
import StarryLandingScreen from "./components/StarryLandingScreen.jsx";
// @ts-ignore
import MainApp from "./components/MainApp.jsx";

export default function App() {
  const [view, setView] = useState("welcome");

  return (
    <ToastProvider>
      <div className={view === "welcome" || view === "intro" ? "" : "opacity-100 animate-in fade-in duration-1000"}>
        {view === "welcome" && (
          <WelcomeScreen onEnter={() => setView("intro")} />
        )}
        
        {view === "intro" && (
          <StarryLandingScreen onLogin={() => setView("main")} />
        )}
        
        {view === "main" && (
          <MainApp onLogout={() => setView("intro")} />
        )}
      </div>
    </ToastProvider>
  );
}