import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import MainLayout from "@/components/layout/MainLayout";

import Dashboard from "@/pages/Dashboard";
import Kanji from "@/pages/Kanji";
import Vocabulary from "@/pages/Vocabulary";
import Grammar from "@/pages/Grammar";
import Expressions from "@/pages/Expressions";
import Verbs from "@/pages/Verbs";
import Adjectives from "@/pages/Adjectives";
import Numbers from "@/pages/Numbers";
import Kana from "@/pages/Kana";
import Listening from "@/pages/Listening";
import Quiz from "@/pages/Quiz";
import Progress from "@/pages/Progress";
import Settings from "@/pages/Settings";
import AboutCreator from "@/pages/AboutCreator";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname]);

  return null;
}

function App() {
  return (
    <BrowserRouter basename="/yomiko_jp">
      <ScrollToTop />

      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/kanji" element={<Kanji />} />
          <Route path="/vocabulary" element={<Vocabulary />} />
          <Route path="/grammar" element={<Grammar />} />
          <Route path="/expressions" element={<Expressions />} />
          <Route path="/verbs" element={<Verbs />} />
          <Route path="/adjectives" element={<Adjectives />} />
          <Route path="/numbers" element={<Numbers />} />
          <Route path="/kana" element={<Kana />} />
          <Route path="/listening" element={<Listening />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/about-creator" element={<AboutCreator />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;