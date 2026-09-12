import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import "./index.css";

import { ThemeProvider } from "@/context/ThemeContext";
import { LearningProvider } from "@/context/LearningContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <LearningProvider>
        <App />
      </LearningProvider>
    </ThemeProvider>
  </StrictMode>,
);