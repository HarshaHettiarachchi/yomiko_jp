import { useEffect, useMemo, useState } from "react";
import {
  Volume2,
  RotateCcw,
  Star,
  Check,
  BookOpen,
} from "lucide-react";
import { motion } from "motion/react";

import { useLearning } from "@/context/LearningContext";

type KanaType = "hiragana" | "katakana";

interface KanaCharacter {
  character: string;
  romaji: string;
}

/* =========================================================
   HIRAGANA - 46 BASIC CHARACTERS
========================================================= */

const hiragana: KanaCharacter[] = [
  { character: "あ", romaji: "a" },
  { character: "い", romaji: "i" },
  { character: "う", romaji: "u" },
  { character: "え", romaji: "e" },
  { character: "お", romaji: "o" },

  { character: "か", romaji: "ka" },
  { character: "き", romaji: "ki" },
  { character: "く", romaji: "ku" },
  { character: "け", romaji: "ke" },
  { character: "こ", romaji: "ko" },

  { character: "さ", romaji: "sa" },
  { character: "し", romaji: "shi" },
  { character: "す", romaji: "su" },
  { character: "せ", romaji: "se" },
  { character: "そ", romaji: "so" },

  { character: "た", romaji: "ta" },
  { character: "ち", romaji: "chi" },
  { character: "つ", romaji: "tsu" },
  { character: "て", romaji: "te" },
  { character: "と", romaji: "to" },

  { character: "な", romaji: "na" },
  { character: "に", romaji: "ni" },
  { character: "ぬ", romaji: "nu" },
  { character: "ね", romaji: "ne" },
  { character: "の", romaji: "no" },

  { character: "は", romaji: "ha" },
  { character: "ひ", romaji: "hi" },
  { character: "ふ", romaji: "fu" },
  { character: "へ", romaji: "he" },
  { character: "ほ", romaji: "ho" },

  { character: "ま", romaji: "ma" },
  { character: "み", romaji: "mi" },
  { character: "む", romaji: "mu" },
  { character: "め", romaji: "me" },
  { character: "も", romaji: "mo" },

  { character: "や", romaji: "ya" },
  { character: "ゆ", romaji: "yu" },
  { character: "よ", romaji: "yo" },

  { character: "ら", romaji: "ra" },
  { character: "り", romaji: "ri" },
  { character: "る", romaji: "ru" },
  { character: "れ", romaji: "re" },
  { character: "ろ", romaji: "ro" },

  { character: "わ", romaji: "wa" },
  { character: "を", romaji: "wo" },
  { character: "ん", romaji: "n" },
];

/* =========================================================
   KATAKANA - 46 BASIC CHARACTERS
========================================================= */

const katakana: KanaCharacter[] = [
  { character: "ア", romaji: "a" },
  { character: "イ", romaji: "i" },
  { character: "ウ", romaji: "u" },
  { character: "エ", romaji: "e" },
  { character: "オ", romaji: "o" },

  { character: "カ", romaji: "ka" },
  { character: "キ", romaji: "ki" },
  { character: "ク", romaji: "ku" },
  { character: "ケ", romaji: "ke" },
  { character: "コ", romaji: "ko" },

  { character: "サ", romaji: "sa" },
  { character: "シ", romaji: "shi" },
  { character: "ス", romaji: "su" },
  { character: "セ", romaji: "se" },
  { character: "ソ", romaji: "so" },

  { character: "タ", romaji: "ta" },
  { character: "チ", romaji: "chi" },
  { character: "ツ", romaji: "tsu" },
  { character: "テ", romaji: "te" },
  { character: "ト", romaji: "to" },

  { character: "ナ", romaji: "na" },
  { character: "ニ", romaji: "ni" },
  { character: "ヌ", romaji: "nu" },
  { character: "ネ", romaji: "ne" },
  { character: "ノ", romaji: "no" },

  { character: "ハ", romaji: "ha" },
  { character: "ヒ", romaji: "hi" },
  { character: "フ", romaji: "fu" },
  { character: "ヘ", romaji: "he" },
  { character: "ホ", romaji: "ho" },

  { character: "マ", romaji: "ma" },
  { character: "ミ", romaji: "mi" },
  { character: "ム", romaji: "mu" },
  { character: "メ", romaji: "me" },
  { character: "モ", romaji: "mo" },

  { character: "ヤ", romaji: "ya" },
  { character: "ユ", romaji: "yu" },
  { character: "ヨ", romaji: "yo" },

  { character: "ラ", romaji: "ra" },
  { character: "リ", romaji: "ri" },
  { character: "ル", romaji: "ru" },
  { character: "レ", romaji: "re" },
  { character: "ロ", romaji: "ro" },

  { character: "ワ", romaji: "wa" },
  { character: "ヲ", romaji: "wo" },
  { character: "ン", romaji: "n" },
];

/* =========================================================
   LOCAL STORAGE
========================================================= */

const LEARNED_KEY = "yomiko-kana-learned";
const FAVORITES_KEY = "yomiko-kana-favorites";

/* =========================================================
   SAFE STORAGE READER
========================================================= */

function getStoredArray(key: string): string[] {
  try {
    const saved = localStorage.getItem(key);

    if (!saved) {
      return [];
    }

    const parsed: unknown = JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (item): item is string => typeof item === "string",
    );
  } catch {
    return [];
  }
}

/* =========================================================
   SPEECH
========================================================= */

function speakJapanese(text: string) {
  if (!("speechSynthesis" in window)) {
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  utterance.lang = "ja-JP";
  utterance.rate = 0.7;
  utterance.pitch = 1;

  window.speechSynthesis.speak(utterance);
}

/* =========================================================
   COMPONENT
========================================================= */

function Kana() {
  const {
    addKanaLearned,
    removeKanaLearned,
  } = useLearning();

  const [type, setType] =
    useState<KanaType>("hiragana");

  const [learned, setLearned] =
    useState<string[]>(() =>
      getStoredArray(LEARNED_KEY),
    );

  const [favorites, setFavorites] =
    useState<string[]>(() =>
      getStoredArray(FAVORITES_KEY),
    );

  /* =========================================================
     CURRENT KANA
  ========================================================= */

  const characters = useMemo(
    () =>
      type === "hiragana"
        ? hiragana
        : katakana,
    [type],
  );

  /* =========================================================
     CURRENT PROGRESS
  ========================================================= */

  const learnedCharacters = characters.filter(
    (item) => learned.includes(item.character),
  );

  const progress =
    characters.length === 0
      ? 0
      : Math.round(
          (learnedCharacters.length /
            characters.length) *
            100,
        );

  /* =========================================================
     SAVE LEARNED
  ========================================================= */

  useEffect(() => {
    localStorage.setItem(
      LEARNED_KEY,
      JSON.stringify(learned),
    );
  }, [learned]);

  /* =========================================================
     SAVE FAVORITES
  ========================================================= */

  useEffect(() => {
    localStorage.setItem(
      FAVORITES_KEY,
      JSON.stringify(favorites),
    );
  }, [favorites]);

  /* =========================================================
     TOGGLE LEARNED
  ========================================================= */

  const toggleLearned = (character: string) => {
    const isLearned = learned.includes(character);

    if (isLearned) {
      setLearned((previous) =>
        previous.filter(
          (item) => item !== character,
        ),
      );

      removeKanaLearned();
      return;
    }

    setLearned((previous) => [
      ...previous,
      character,
    ]);

    addKanaLearned();
  };

  /* =========================================================
     TOGGLE FAVORITE
  ========================================================= */

  const toggleFavorite = (character: string) => {
    setFavorites((previous) => {
      if (previous.includes(character)) {
        return previous.filter(
          (item) => item !== character,
        );
      }

      return [...previous, character];
    });
  };

  /* =========================================================
     RESET
  ========================================================= */

  const reset = () => {
    const learnedCount = learned.length;

    for (let i = 0; i < learnedCount; i += 1) {
      removeKanaLearned();
    }

    setLearned([]);
    setFavorites([]);

    localStorage.removeItem(LEARNED_KEY);
    localStorage.removeItem(FAVORITES_KEY);

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <div className="min-h-screen px-4 py-5 pb-28 sm:px-6 sm:py-7 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mb-6"
        >
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-pink-500 sm:text-sm">
            Japanese Basics
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Kana
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
            Learn Hiragana and Katakana with pronunciation.
          </p>
        </motion.div>

        {/* =====================================================
            HIRAGANA / KATAKANA + RESET
        ===================================================== */}

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div className="grid w-full grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1 dark:bg-slate-900 sm:w-auto">

            <button
              type="button"
              onClick={() => setType("hiragana")}
              className={`rounded-xl px-5 py-3 text-sm font-bold transition-all sm:px-8 ${
                type === "hiragana"
                  ? "bg-pink-500 text-white shadow-lg shadow-pink-500/20"
                  : "text-slate-600 hover:text-pink-500 dark:text-slate-300"
              }`}
            >
              Hiragana
            </button>

            <button
              type="button"
              onClick={() => setType("katakana")}
              className={`rounded-xl px-5 py-3 text-sm font-bold transition-all sm:px-8 ${
                type === "katakana"
                  ? "bg-pink-500 text-white shadow-lg shadow-pink-500/20"
                  : "text-slate-600 hover:text-pink-500 dark:text-slate-300"
              }`}
            >
              Katakana
            </button>

          </div>

          <button
            type="button"
            onClick={reset}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-pink-300 hover:text-pink-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 sm:w-auto"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>

        </div>

        {/* =====================================================
            PROGRESS CARD
        ===================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5"
        >

          <div className="mb-3 flex items-center justify-between gap-3">

            <div className="flex min-w-0 items-center gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-100 text-pink-500 dark:bg-pink-500/10">
                <BookOpen className="h-5 w-5" />
              </div>

              <div className="min-w-0">

                <p className="truncate text-sm font-bold text-slate-900 dark:text-white sm:text-base">
                  {type === "hiragana"
                    ? "Hiragana"
                    : "Katakana"}{" "}
                  Progress
                </p>

                <p className="text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                  {learnedCharacters.length} /{" "}
                  {characters.length} learned
                </p>

              </div>

            </div>

            <span className="shrink-0 text-xl font-bold text-pink-500">
              {progress}%
            </span>

          </div>

          <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">

            <motion.div
              initial={{
                width: 0,
              }}
              animate={{
                width: `${progress}%`,
              }}
              transition={{
                duration: 0.6,
                ease: "easeOut",
              }}
              className="h-full rounded-full bg-pink-500"
            />

          </div>

        </motion.div>

        {/* =====================================================
            INFO
        ===================================================== */}

        <div className="mb-6 rounded-2xl border border-pink-100 bg-pink-50/80 p-4 dark:border-pink-900/30 dark:bg-pink-500/5 sm:p-5">

          <div className="flex items-start gap-3">

            <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-pink-500 text-white sm:flex">
              <Volume2 className="h-4 w-4" />
            </div>

            <div>
              <h2 className="text-sm font-bold text-slate-800 dark:text-white sm:text-base">
                {type === "hiragana"
                  ? "Hiragana"
                  : "Katakana"}{" "}
                Practice
              </h2>

              <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-400 sm:text-sm">
                Click a character to hear its pronunciation.
                Save important characters with ⭐ and mark
                completed characters as learned.
              </p>
            </div>

          </div>

        </div>

        {/* =====================================================
            KANA GRID

            Mobile: 2 columns
            Small: 4 columns
            Medium: 6 columns
            Large: 8 columns
        ===================================================== */}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 md:grid-cols-6 lg:grid-cols-8">

          {characters.map((item, index) => {
            const isLearned =
              learned.includes(item.character);

            const isFavorite =
              favorites.includes(item.character);

            return (
              <motion.div
                key={item.character}
                initial={{
                  opacity: 0,
                  y: 12,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: Math.min(
                    index * 0.012,
                    0.3,
                  ),
                  duration: 0.2,
                }}
                className={`group relative overflow-hidden rounded-2xl border p-3 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg sm:p-4 ${
                  isLearned
                    ? "border-green-300 bg-green-50/80 dark:border-green-800 dark:bg-green-950/20"
                    : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
                }`}
              >

                {/* =================================================
                    FAVORITE
                ================================================= */}

                <button
                  type="button"
                  onClick={() =>
                    toggleFavorite(
                      item.character,
                    )
                  }
                  aria-label={
                    isFavorite
                      ? `Remove ${item.character} from favorites`
                      : `Add ${item.character} to favorites`
                  }
                  className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-lg transition hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Star
                    className={`h-4 w-4 transition ${
                      isFavorite
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-slate-400 hover:text-yellow-400"
                    }`}
                  />
                </button>

                {/* =================================================
                    CHARACTER + SPEECH
                ================================================= */}

                <button
                  type="button"
                  onClick={() =>
                    speakJapanese(
                      item.character,
                    )
                  }
                  aria-label={`Listen to ${item.character}`}
                  className="flex w-full flex-col items-center pt-4"
                >

                  <span className="text-4xl font-bold leading-none text-slate-800 dark:text-white sm:text-5xl">
                    {item.character}
                  </span>

                  <span className="mt-2 text-sm font-bold text-pink-500">
                    {item.romaji}
                  </span>

                  <span className="mt-2 flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-400 transition group-hover:bg-pink-50 group-hover:text-pink-500 dark:bg-slate-800 dark:group-hover:bg-pink-500/10">
                    <Volume2 className="h-3.5 w-3.5" />
                  </span>

                </button>

                {/* =================================================
                    LEARNED BUTTON
                ================================================= */}

                <button
                  type="button"
                  onClick={() =>
                    toggleLearned(
                      item.character,
                    )
                  }
                  className={`mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-[11px] font-bold transition sm:text-xs ${
                    isLearned
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-slate-100 text-slate-500 hover:bg-pink-100 hover:text-pink-500 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                  }`}
                >
                  <Check className="h-3.5 w-3.5" />

                  <span>
                    {isLearned
                      ? "Learned"
                      : "Mark Learned"}
                  </span>
                </button>

              </motion.div>
            );
          })}

        </div>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <div className="mt-8 pb-4 text-center">

          <p className="text-xs text-slate-400 sm:text-sm">
            {characters.length} basic{" "}
            {type} characters
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {favorites.length} favorites saved
          </p>

        </div>

      </div>
    </div>
  );
}

export default Kana;