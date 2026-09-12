import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import MobileBottomNav from "./MobileBottomNav";
import { useTheme } from "@/context/ThemeContext";

interface MainLayoutProps {
  children: React.ReactNode;
}

function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { darkMode, toggleTheme } = useTheme();

  return (
    <div
      className={`
        min-h-screen
        transition-colors
        ${
          darkMode
            ? "bg-slate-950 text-white"
            : "bg-slate-50 text-slate-900"
        }
      `}
    >
      {/* Navbar */}
      <Navbar
        onMenuClick={() => setSidebarOpen(true)}
        darkMode={darkMode}
        onThemeToggle={toggleTheme}
      />

      <div className="flex">
        {/* Desktop + Mobile Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <main
          className="
            min-w-0
            flex-1
            pb-20
            md:pb-0
          "
        >
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}

export default MainLayout;