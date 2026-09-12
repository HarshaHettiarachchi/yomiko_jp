import { useState, type ElementType } from "react";

import {
  Moon,
  Sun,
  Volume2,
  Target,
  GraduationCap,
  RotateCcw,
  User,
  Save,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

import { motion } from "motion/react";

import { useTheme } from "@/context/ThemeContext";
import { useLearning } from "@/context/LearningContext";

/* =========================================================
   STORAGE KEYS
========================================================= */

const AUDIO_STORAGE_KEY = "yomiko-audio";

const PROGRESS_STORAGE_KEYS = [
  // Kanji
  "yomiko-learned",

  // Kana
  "yomiko-kana-learned",

  // Vocabulary
  "yomiko-favorites",
  "yomiko-vocabulary-favorites",

  // Numbers
  "yomiko-numbers-learned",

  // Grammar
  "yomiko-grammar-learned",

  // Expressions
  "yomiko-expressions-learned",

  // Verbs
  "yomiko-verbs-learned",

  // Adjectives
  "yomiko-adjectives-learned",

  // Quiz
  "yomiko-quiz-score",
  "yomiko-quiz-total",
  "yomiko-quiz-history",
  "yomiko-quiz-attempts",
  "yomiko-quiz-best-score",
  "yomiko-quiz-questions",
  "yomiko-quiz-correct",
  "yomiko-quiz-category-stats",

  // Listening
  "yomiko-listening-completed",
  "yomiko-listening-completed-ids",

  // Streak / XP
  "yomiko-streak",
  "yomiko-xp",

  // Daily activity
  "yomiko-daily-completed",
  "yomiko-activity-date",
  "yomiko-last-activity",
];

/* =========================================================
   SETTINGS PAGE
========================================================= */

function Settings() {
  const { darkMode, toggleTheme } = useTheme();

  const {
    name,
    jlptLevel,
    dailyGoal,
    updateName,
    updateJlptLevel,
    updateDailyGoal,
  } = useLearning();

  const [audio, setAudio] = useState(
    () => localStorage.getItem(AUDIO_STORAGE_KEY) !== "off",
  );

  const [saved, setSaved] = useState(false);

  const [resetting, setResetting] = useState(false);

  /* =======================================================
     SAVE SETTINGS
  ======================================================= */

  const saveSettings = () => {
    localStorage.setItem(
      AUDIO_STORAGE_KEY,
      audio ? "on" : "off",
    );

    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  /* =======================================================
     RESET ALL LEARNING PROGRESS
  ======================================================= */

  const resetProgress = () => {
    const confirmed = window.confirm(
      "Are you sure you want to reset all your learning progress?\n\nThis will remove learned items, favorites, quiz statistics, listening progress, streak and XP.",
    );

    if (!confirmed) {
      return;
    }

    setResetting(true);

    try {
      PROGRESS_STORAGE_KEYS.forEach((key) => {
        localStorage.removeItem(key);
      });

      window.alert(
        "All learning progress has been reset successfully.",
      );

      window.location.reload();
    } catch (error) {
      console.error("Failed to reset progress:", error);

      setResetting(false);

      window.alert(
        "Something went wrong while resetting your progress. Please try again.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 pb-28 dark:bg-slate-950 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-4xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.3,
          }}
          className="mb-8"
        >
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-pink-500 sm:text-sm">
            Personalize Yomiko
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Settings
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
            Customize your Japanese learning experience.
          </p>
        </motion.div>

        {/* =================================================
            PROFILE
        ================================================= */}

        <motion.section
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.3,
          }}
          className="mb-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6"
        >
          <SectionHeader
            icon={User}
            iconClassName="bg-pink-50 text-pink-500 dark:bg-pink-500/10"
            title="Profile"
            description="Your personal information"
          />

          <div>
            <label
              htmlFor="display-name"
              className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Display Name
            </label>

            <input
              id="display-name"
              type="text"
              value={name}
              onChange={(event) =>
                updateName(event.target.value)
              }
              placeholder="Enter your name"
              autoComplete="name"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-pink-950 sm:text-base"
            />

            <p className="mt-2 text-xs text-slate-400">
              This name is used across your Yomiko profile.
            </p>
          </div>
        </motion.section>

        {/* =================================================
            LEARNING PREFERENCES
        ================================================= */}

        <motion.section
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.3,
            delay: 0.05,
          }}
          className="mb-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6"
        >
          <SectionHeader
            icon={Target}
            iconClassName="bg-purple-50 text-purple-500 dark:bg-purple-500/10"
            title="Learning Preferences"
            description="Set your learning goals"
          />

          <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">

            {/* JLPT LEVEL */}

            <div>
              <label
                htmlFor="jlpt-level"
                className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                JLPT Level
              </label>

              <select
                id="jlpt-level"
                value={jlptLevel}
                onChange={(event) =>
                  updateJlptLevel(event.target.value)
                }
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-pink-950 sm:text-base"
              >
                <option value="N5">
                  N5 - Beginner
                </option>

                <option value="N4">
                  N4 - Elementary
                </option>

                <option value="N3">
                  N3 - Intermediate
                </option>

                <option value="N2">
                  N2 - Upper Intermediate
                </option>

                <option value="N1">
                  N1 - Advanced
                </option>
              </select>
            </div>

            {/* DAILY GOAL */}

            <div>
              <label
                htmlFor="daily-goal"
                className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                Daily Learning Goal
              </label>

              <select
                id="daily-goal"
                value={dailyGoal.toString()}
                onChange={(event) =>
                  updateDailyGoal(
                    Number(event.target.value),
                  )
                }
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-pink-950 sm:text-base"
              >
                <option value="10">
                  10 minutes
                </option>

                <option value="20">
                  20 minutes
                </option>

                <option value="30">
                  30 minutes
                </option>

                <option value="45">
                  45 minutes
                </option>

                <option value="60">
                  60 minutes
                </option>
              </select>
            </div>

          </div>
        </motion.section>

        {/* =================================================
            APPEARANCE & AUDIO
        ================================================= */}

        <motion.section
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.3,
            delay: 0.1,
          }}
          className="mb-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6"
        >
          <SectionHeader
            icon={darkMode ? Moon : Sun}
            iconClassName="bg-blue-50 text-blue-500 dark:bg-blue-500/10"
            title="Appearance & Audio"
            description="Control your app experience"
          />

          <div className="space-y-3">

            {/* DARK MODE */}

            <SettingRow
              icon={darkMode ? Moon : Sun}
              title="Dark Mode"
              description={
                darkMode
                  ? "Dark theme is enabled"
                  : "Light theme is enabled"
              }
              enabled={darkMode}
              onToggle={toggleTheme}
            />

            {/* AUDIO */}

            <SettingRow
              icon={Volume2}
              title="Japanese Audio"
              description={
                audio
                  ? "Pronunciation features are enabled"
                  : "Pronunciation features are disabled"
              }
              enabled={audio}
              onToggle={() =>
                setAudio((value) => !value)
              }
            />

          </div>
        </motion.section>

        {/* =================================================
            SAVE BUTTON
        ================================================= */}

        <motion.button
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.3,
            delay: 0.15,
          }}
          type="button"
          onClick={saveSettings}
          className={`flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 font-bold text-white shadow-lg transition-all ${
            saved
              ? "bg-green-500 shadow-green-500/20 hover:bg-green-600"
              : "bg-pink-500 shadow-pink-500/20 hover:bg-pink-600"
          }`}
        >
          {saved ? (
            <>
              <CheckCircle2 size={20} />
              Settings Saved
            </>
          ) : (
            <>
              <Save size={20} />
              Save Settings
            </>
          )}
        </motion.button>

        {/* =================================================
            RESET PROGRESS
        ================================================= */}

        <motion.section
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.3,
            delay: 0.2,
          }}
          className="mt-6 rounded-3xl border border-red-200 bg-red-50 p-5 dark:border-red-900/40 dark:bg-red-950/20 sm:p-6"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex gap-3">
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400">
                <AlertTriangle size={20} />
              </div>

              <div>
                <h2 className="font-bold text-red-700 dark:text-red-400">
                  Reset Learning Progress
                </h2>

                <p className="mt-1 max-w-xl text-sm leading-5 text-red-600/80 dark:text-red-400/70">
                  Remove learned items, favorites, quiz
                  statistics, listening progress, streak and XP.
                </p>

                <p className="mt-2 text-xs font-medium text-red-500/70 dark:text-red-400/60">
                  Your profile and learning preferences will not
                  be deleted.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={resetProgress}
              disabled={resetting}
              className="flex w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-red-300 bg-white px-5 py-3 font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-800 dark:bg-slate-900 dark:text-red-400 dark:hover:bg-red-950/40 sm:w-auto"
            >
              <RotateCcw
                size={18}
                className={
                  resetting
                    ? "animate-spin"
                    : ""
                }
              />

              {resetting
                ? "Resetting..."
                : "Reset Progress"}
            </button>

          </div>
        </motion.section>

        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="flex items-center justify-center gap-2 px-4 py-8 text-center text-xs text-slate-400 sm:text-sm">
          <GraduationCap size={18} />

          <span>
            Yomiko — Read. Learn. Remember.
          </span>
        </div>

      </div>
    </div>
  );
}

/* =========================================================
   SECTION HEADER
========================================================= */

function SectionHeader({
  icon: Icon,
  iconClassName,
  title,
  description,
}: {
  icon: ElementType;
  iconClassName: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}
      >
        <Icon size={21} />
      </div>

      <div className="min-w-0">
        <h2 className="font-bold text-slate-900 dark:text-white">
          {title}
        </h2>

        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
          {description}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   SETTING ROW
========================================================= */

function SettingRow({
  icon: Icon,
  title,
  description,
  enabled,
  onToggle,
}: {
  icon: ElementType;
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">

      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-pink-500 shadow-sm dark:bg-slate-900">
          <Icon size={19} />
        </div>

        <div className="min-w-0">
          <p className="font-semibold text-slate-800 dark:text-white">
            {title}
          </p>

          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
            {description}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onToggle}
        aria-label={`${title} ${
          enabled ? "disable" : "enable"
        }`}
        aria-pressed={enabled}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
          enabled
            ? "bg-pink-500"
            : "bg-slate-300 dark:bg-slate-600"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-all ${
            enabled
              ? "left-6"
              : "left-1"
          }`}
        />
      </button>

    </div>
  );
}

export default Settings;