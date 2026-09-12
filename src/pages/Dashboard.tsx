import { useEffect, useState } from "react";
import {
  Flame,
  Target,
  Trophy,
  BookOpen,
  ArrowRight,
  Sparkles,
  Languages,
  Headphones,
  MessageCircle,
  RefreshCw,
  Hash,
  Brain,
} from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

import { useLearning } from "@/context/LearningContext";
import { getKanjiByLevel } from "@/services/kanjiApi";

/* =========================================================
   CONTENT TOTALS
========================================================= */

const KANA_TOTAL = 46;
const NUMBERS_TOTAL = 289;
const LISTENING_TOTAL = 400;

const VOCABULARY_TOTAL = 100;
const GRAMMAR_TOTAL = 33;
const EXPRESSIONS_TOTAL = 200;
const VERBS_TOTAL = 100;
const ADJECTIVES_TOTAL = 200;

/* =========================================================
   SAFE NUMBER
========================================================= */

function getSafeCount(value: unknown): number {
  if (Array.isArray(value)) {
    return value.length;
  }

  const numberValue = Number(value);

  if (!Number.isFinite(numberValue) || numberValue < 0) {
    return 0;
  }

  return numberValue;
}

/* =========================================================
   LOCAL STORAGE ARRAY COUNT
========================================================= */

function getStoredArrayLength(key: string): number {
  try {
    const saved = localStorage.getItem(key);

    if (!saved) {
      return 0;
    }

    const parsed: unknown = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed.length : 0;
  } catch {
    return 0;
  }
}

/* =========================================================
   PERCENTAGE
========================================================= */

function getPercentage(
  value: number,
  total: number,
): number {
  if (
    !Number.isFinite(value) ||
    !Number.isFinite(total) ||
    total <= 0
  ) {
    return 0;
  }

  return Math.min(
    Math.max(Math.round((value / total) * 100), 0),
    100,
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard() {
  const {
    name,
    jlptLevel,
    dailyGoal,
    learnedKanji,
    learnedKana,
    learnedNumbers,
    quizScore,
    quizTotal,
    listeningCompleted,
    streak,
    xp,
    dailyCompleted,
  } = useLearning();

  const [kanjiCount, setKanjiCount] = useState(0);
  const [kanjiLoading, setKanjiLoading] = useState(true);

  /* =====================================================
     KANJI API
  ===================================================== */

  useEffect(() => {
    let active = true;

    setKanjiLoading(true);

    getKanjiByLevel(jlptLevel)
      .then((data) => {
        if (!active) {
          return;
        }

        setKanjiCount(
          Array.isArray(data) ? data.length : 0,
        );
      })
      .catch(() => {
        if (!active) {
          return;
        }

        setKanjiCount(0);
      })
      .finally(() => {
        if (active) {
          setKanjiLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [jlptLevel]);

  /* =====================================================
     SAFE VALUES
  ===================================================== */

  const learnedKanjiCount =
    getSafeCount(learnedKanji);

  const totalKanjiCount =
    getSafeCount(kanjiCount);

  const safeLearnedKana =
    getSafeCount(learnedKana);

  const safeLearnedNumbers =
    getSafeCount(learnedNumbers);

  const safeQuizScore =
    getSafeCount(quizScore);

  const safeQuizTotal =
    getSafeCount(quizTotal);

  const safeListeningCompleted =
    getSafeCount(listeningCompleted);

  const safeStreak =
    getSafeCount(streak);

  const safeXp =
    getSafeCount(xp);

  const safeDailyCompleted =
    getSafeCount(dailyCompleted);

  const safeDailyGoal =
    getSafeCount(dailyGoal);

  /* =====================================================
     LEARNED COUNTS FROM LOCAL STORAGE
  ===================================================== */

  const vocabularyLearned =
    getStoredArrayLength(
      "yomiko-vocabulary-favorites",
    );

  const grammarLearned =
    getStoredArrayLength(
      "yomiko-grammar-learned",
    );

  const expressionsLearned =
    getStoredArrayLength(
      "yomiko-expressions-learned",
    );

  const verbsLearned =
    getStoredArrayLength(
      "yomiko-verbs-learned",
    );

  const adjectivesLearned =
    getStoredArrayLength(
      "yomiko-adjectives-learned",
    );

  /* =====================================================
     PROGRESS
  ===================================================== */

  const kanjiProgress = getPercentage(
    learnedKanjiCount,
    totalKanjiCount,
  );

  const kanaProgress = getPercentage(
    safeLearnedKana,
    KANA_TOTAL,
  );

  const vocabularyProgress = getPercentage(
    vocabularyLearned,
    VOCABULARY_TOTAL,
  );

  const grammarProgress = getPercentage(
    grammarLearned,
    GRAMMAR_TOTAL,
  );

  const expressionsProgress =
    getPercentage(
      expressionsLearned,
      EXPRESSIONS_TOTAL,
    );

  const verbsProgress = getPercentage(
    verbsLearned,
    VERBS_TOTAL,
  );

  const adjectivesProgress =
    getPercentage(
      adjectivesLearned,
      ADJECTIVES_TOTAL,
    );

  const numbersProgress = getPercentage(
    safeLearnedNumbers,
    NUMBERS_TOTAL,
  );

  const listeningProgress =
    getPercentage(
      safeListeningCompleted,
      LISTENING_TOTAL,
    );

  const quizProgress =
    safeQuizTotal > 0
      ? getPercentage(
          safeQuizScore,
          safeQuizTotal,
        )
      : 0;

  const dailyProgress =
    safeDailyGoal > 0
      ? getPercentage(
          safeDailyCompleted,
          safeDailyGoal,
        )
      : 0;

  /* =====================================================
     OVERALL LEARNING PROGRESS
  ===================================================== */

  const progressValues = [
    kanjiProgress,
    vocabularyProgress,
    grammarProgress,
    expressionsProgress,
    verbsProgress,
    adjectivesProgress,
    numbersProgress,
    kanaProgress,
    listeningProgress,
    quizProgress,
  ];

  const overallProgress = Math.round(
    progressValues.reduce(
      (sum, value) => sum + value,
      0,
    ) / progressValues.length,
  );

  /* =====================================================
     LEARNING OVERVIEW DATA
  ===================================================== */

  const overviewItems = [
    {
      title: "Kanji",
      value: `${learnedKanjiCount} / ${totalKanjiCount}`,
      description: `${jlptLevel} Kanji`,
      progress: kanjiProgress,
      icon: BookOpen,
      path: "/kanji",
    },
    {
      title: "Vocabulary",
      value: `${vocabularyLearned} / ${VOCABULARY_TOTAL}`,
      description: "Saved words",
      progress: vocabularyProgress,
      icon: Languages,
      path: "/vocabulary",
    },
    {
      title: "Grammar",
      value: `${grammarLearned} / ${GRAMMAR_TOTAL}`,
      description: "Grammar patterns",
      progress: grammarProgress,
      icon: Brain,
      path: "/grammar",
    },
    {
      title: "Expressions",
      value: `${expressionsLearned} / ${EXPRESSIONS_TOTAL}`,
      description: "Useful expressions",
      progress: expressionsProgress,
      icon: MessageCircle,
      path: "/expressions",
    },
    {
      title: "Verbs",
      value: `${verbsLearned} / ${VERBS_TOTAL}`,
      description: "Japanese verbs",
      progress: verbsProgress,
      icon: RefreshCw,
      path: "/verbs",
    },
    {
      title: "Adjectives",
      value: `${adjectivesLearned} / ${ADJECTIVES_TOTAL}`,
      description: "Japanese adjectives",
      progress: adjectivesProgress,
      icon: Sparkles,
      path: "/adjectives",
    },
    {
      title: "Numbers & Time",
      value: `${safeLearnedNumbers} / ${NUMBERS_TOTAL}`,
      description: "Numbers and time",
      progress: numbersProgress,
      icon: Hash,
      path: "/numbers",
    },
    {
      title: "Kana",
      value: `${safeLearnedKana} / ${KANA_TOTAL}`,
      description: "Hiragana & Katakana",
      progress: kanaProgress,
      icon: Languages,
      path: "/kana",
    },
    {
      title: "Listening",
      value: `${safeListeningCompleted} / ${LISTENING_TOTAL}`,
      description: "Listening lessons",
      progress: listeningProgress,
      icon: Headphones,
      path: "/listening",
    },
    {
      title: "Quiz",
      value:
        safeQuizTotal > 0
          ? `${safeQuizScore} / ${safeQuizTotal}`
          : "Not attempted",
      description: "Latest quiz result",
      progress: quizProgress,
      icon: Trophy,
      path: "/quiz",
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 px-3 py-5 dark:bg-slate-950 sm:px-6 sm:py-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mb-5 sm:mb-8"
        >
          <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-pink-500 sm:text-sm">
            YOMIKO LEARNING DASHBOARD
          </p>

          <h1 className="text-2xl font-bold leading-tight text-slate-900 dark:text-white sm:text-4xl">
            Welcome back, {name}! 👋
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400 sm:text-base">
            Keep going with your Japanese learning journey.
          </p>
        </motion.div>

        {/* =================================================
            OVERALL PROGRESS BANNER
        ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.1,
          }}
          className="
            mb-5 overflow-hidden rounded-2xl
            bg-gradient-to-br from-pink-500 via-fuchsia-500 to-purple-600
            p-5 text-white shadow-lg
            sm:mb-8 sm:rounded-3xl sm:p-8
          "
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <div className="flex items-center gap-2">
                <Sparkles size={18} />

                <span className="text-xs font-semibold text-white/80 sm:text-sm">
                  Current JLPT Level
                </span>
              </div>

              <h2 className="mt-1 text-4xl font-black sm:mt-2 sm:text-5xl">
                {jlptLevel}
              </h2>

              <p className="mt-1.5 text-sm text-white/80">
                {kanjiLoading
                  ? "Loading Kanji..."
                  : `${totalKanjiCount} Kanji available`}
              </p>
            </div>

            <div className="rounded-2xl bg-white/15 px-5 py-4 backdrop-blur-md sm:min-w-[210px] sm:px-6 sm:py-5">

              <div className="flex items-center justify-between gap-4">
                <p className="text-xs text-white/70 sm:text-sm">
                  Overall Progress
                </p>

                <p className="text-2xl font-black sm:text-3xl">
                  {overallProgress}%
                </p>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/20">
                <motion.div
                  initial={{
                    width: 0,
                  }}
                  animate={{
                    width: `${overallProgress}%`,
                  }}
                  transition={{
                    duration: 0.8,
                  }}
                  className="h-full rounded-full bg-white"
                />
              </div>

              <p className="mt-2 text-xs text-white/70">
                Keep learning every day
              </p>

            </div>

          </div>
        </motion.div>

        {/* =================================================
            STATS
        ================================================= */}

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">

          <StatCard
            icon={Flame}
            title="Streak"
            value={safeStreak.toString()}
            unit="days"
            description={
              safeStreak > 0
                ? "Keep it alive!"
                : "Start today"
            }
          />

          <StatCard
            icon={Trophy}
            title="Total XP"
            value={safeXp.toLocaleString()}
            unit="XP"
            description="Keep earning"
          />

          <StatCard
            icon={BookOpen}
            title="Kanji Learned"
            value={learnedKanjiCount.toString()}
            unit="characters"
            description={`${kanjiProgress}% of ${jlptLevel}`}
          />

          <StatCard
            icon={Headphones}
            title="Listening"
            value={safeListeningCompleted.toString()}
            unit="lessons"
            description={`${listeningProgress}% completed`}
          />

        </div>

        {/* =================================================
            DAILY GOAL + QUIZ
        ================================================= */}

        <div className="mt-5 grid gap-4 sm:mt-8 sm:gap-6 lg:grid-cols-2">

          {/* DAILY GOAL */}

          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.25,
            }}
            className="
              rounded-2xl
              border border-slate-200
              bg-white
              p-5 shadow-sm
              dark:border-slate-800
              dark:bg-slate-900
              sm:rounded-3xl sm:p-6
            "
          >
            <div className="flex items-center justify-between gap-3">

              <div className="flex min-w-0 items-center gap-3">

                <div className="shrink-0 rounded-xl bg-pink-50 p-2.5 text-pink-500 dark:bg-pink-950/30">
                  <Target size={20} />
                </div>

                <div className="min-w-0">
                  <h2 className="font-bold text-slate-900 dark:text-white">
                    Daily Goal
                  </h2>

                  <p className="truncate text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                    Today's activity
                  </p>
                </div>

              </div>

              <span className="shrink-0 text-xl font-black text-pink-500 sm:text-2xl">
                {dailyProgress}%
              </span>

            </div>

            <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <motion.div
                initial={{
                  width: 0,
                }}
                animate={{
                  width: `${dailyProgress}%`,
                }}
                transition={{
                  duration: 0.8,
                }}
                className="h-full rounded-full bg-gradient-to-r from-pink-500 to-purple-500"
              />
            </div>

            <div className="mt-3 flex justify-between text-xs sm:text-sm">
              <span className="text-slate-500 dark:text-slate-400">
                Activities
              </span>

              <span className="font-bold text-slate-800 dark:text-white">
                {safeDailyCompleted} / {safeDailyGoal}
              </span>
            </div>

          </motion.div>

          {/* QUIZ */}

          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.3,
            }}
            className="
              rounded-2xl
              border border-slate-200
              bg-white
              p-5 shadow-sm
              dark:border-slate-800
              dark:bg-slate-900
              sm:rounded-3xl sm:p-6
            "
          >
            <div className="flex items-center gap-3">

              <div className="shrink-0 rounded-xl bg-purple-50 p-2.5 text-purple-500 dark:bg-purple-950/30">
                <Trophy size={20} />
              </div>

              <div>
                <h2 className="font-bold text-slate-900 dark:text-white">
                  Quiz Progress
                </h2>

                <p className="text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                  Latest quiz result
                </p>
              </div>

            </div>

            <div className="mt-6 flex items-end justify-between gap-3">

              <div>
                <p className="text-3xl font-black text-slate-900 dark:text-white sm:text-4xl">
                  {safeQuizScore}

                  <span className="text-lg font-medium text-slate-400 sm:text-xl">
                    /{safeQuizTotal}
                  </span>
                </p>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                  {safeQuizTotal > 0
                    ? `${quizProgress}% score`
                    : "No quiz completed yet"}
                </p>
              </div>

              <span className="text-2xl font-black text-pink-500 sm:text-3xl">
                {quizProgress}%
              </span>

            </div>

            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <motion.div
                initial={{
                  width: 0,
                }}
                animate={{
                  width: `${quizProgress}%`,
                }}
                transition={{
                  duration: 0.8,
                }}
                className="h-full rounded-full bg-purple-500"
              />
            </div>

          </motion.div>

        </div>

        {/* =================================================
            CONTINUE LEARNING
        ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.35,
          }}
          className="
            mt-4
            rounded-2xl
            border border-slate-200
            bg-white
            p-5 shadow-sm
            dark:border-slate-800
            dark:bg-slate-900
            sm:mt-6 sm:rounded-3xl sm:p-6
          "
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex min-w-0 items-center gap-3 sm:gap-4">

              <div className="shrink-0 rounded-xl bg-pink-50 p-3 text-pink-500 dark:bg-pink-950/30 sm:rounded-2xl sm:p-4">
                <BookOpen size={22} />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-bold text-pink-500 sm:text-sm">
                  Continue Learning
                </p>

                <h2 className="mt-0.5 font-bold text-slate-900 dark:text-white sm:text-xl">
                  {jlptLevel} Kanji
                </h2>

                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                  {learnedKanjiCount} of {totalKanjiCount} learned
                </p>
              </div>

            </div>

            <div className="w-full sm:w-56">

              <div className="mb-2 flex justify-between text-xs sm:text-sm">
                <span className="text-slate-500 dark:text-slate-400">
                  Progress
                </span>

                <span className="font-bold text-pink-500">
                  {kanjiProgress}%
                </span>
              </div>

              <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <motion.div
                  initial={{
                    width: 0,
                  }}
                  animate={{
                    width: `${kanjiProgress}%`,
                  }}
                  transition={{
                    duration: 0.8,
                  }}
                  className="h-full rounded-full bg-pink-500"
                />
              </div>

            </div>

            <Link
              to="/kanji"
              className="
                inline-flex
                min-h-12
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-pink-500
                px-5 py-3
                text-sm
                font-bold
                text-white
                shadow-sm
                transition
                active:scale-[0.98]
                hover:bg-pink-600
                sm:w-auto
              "
            >
              Continue
              <ArrowRight size={18} />
            </Link>

          </div>
        </motion.div>

        {/* =================================================
            LEARNING OVERVIEW
        ================================================= */}

        <section className="mt-5 sm:mt-8">

          <div className="mb-4 flex items-end justify-between gap-3">

            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
                Learning Overview
              </h2>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                Your progress across all Yomiko learning areas.
              </p>
            </div>

            <Link
              to="/progress"
              className="hidden shrink-0 text-xs font-bold text-pink-500 hover:text-pink-600 sm:block sm:text-sm"
            >
              View Progress
            </Link>

          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">

            {overviewItems.map(
              (item, index) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.title}
                    initial={{
                      opacity: 0,
                      y: 12,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay:
                        0.05 * index,
                    }}
                  >
                    <Link
                      to={item.path}
                      className="
                        group
                        block
                        min-w-0
                        rounded-2xl
                        border border-slate-200
                        bg-white
                        p-4 shadow-sm
                        transition-all
                        hover:-translate-y-1
                        hover:shadow-md
                        active:scale-[0.99]
                        dark:border-slate-800
                        dark:bg-slate-900
                        sm:p-5
                      "
                    >

                      <div className="flex items-center justify-between gap-2">

                        <div className="shrink-0 rounded-xl bg-pink-50 p-2.5 text-pink-500 transition group-hover:scale-105 dark:bg-pink-500/10">
                          <Icon size={19} />
                        </div>

                        <span className="text-xs font-bold text-pink-500 sm:text-sm">
                          {item.progress}%
                        </span>

                      </div>

                      <h3 className="mt-3 truncate text-sm font-bold text-slate-900 dark:text-white sm:mt-4">
                        {item.title}
                      </h3>

                      <p className="mt-1 truncate text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {item.value}
                      </p>

                      <p className="mt-0.5 truncate text-[10px] text-slate-400 sm:text-xs">
                        {item.description}
                      </p>

                      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <motion.div
                          initial={{
                            width: 0,
                          }}
                          animate={{
                            width: `${item.progress}%`,
                          }}
                          transition={{
                            duration: 0.7,
                            delay:
                              0.1 +
                              index *
                                0.03,
                          }}
                          className="h-full rounded-full bg-pink-500"
                        />
                      </div>

                    </Link>
                  </motion.div>
                );
              },
            )}

          </div>

          <Link
            to="/progress"
            className="
              mt-4
              flex
              items-center
              justify-center
              gap-2
              rounded-xl
              border border-slate-200
              bg-white
              px-4 py-3
              text-sm
              font-bold
              text-slate-600
              transition
              hover:border-pink-300
              hover:text-pink-500
              dark:border-slate-800
              dark:bg-slate-900
              dark:text-slate-300
              dark:hover:border-pink-500/30
              dark:hover:text-pink-400
              sm:hidden
            "
          >
            View Full Progress
            <ArrowRight size={16} />
          </Link>

        </section>

        {/* =================================================
            QUICK PRACTICE
        ================================================= */}

        <section className="mt-5 sm:mt-8">

          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
              Quick Practice
            </h2>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
              Practice your Japanese anytime.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">

            <Link
              to="/listening"
              className="
                group
                rounded-2xl
                border border-slate-200
                bg-white
                p-5 shadow-sm
                transition-all
                hover:-translate-y-1
                hover:shadow-md
                dark:border-slate-800
                dark:bg-slate-900
              "
            >
              <div className="flex items-center gap-4">

                <div className="shrink-0 rounded-2xl bg-pink-50 p-3 text-pink-500 dark:bg-pink-500/10">
                  <Headphones size={24} />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    Listening Practice
                  </h3>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                    {safeListeningCompleted} of{" "}
                    {LISTENING_TOTAL} lessons completed
                  </p>
                </div>

                <ArrowRight
                  size={19}
                  className="shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-pink-500"
                />

              </div>
            </Link>

            <Link
              to="/quiz"
              className="
                group
                rounded-2xl
                border border-slate-200
                bg-white
                p-5 shadow-sm
                transition-all
                hover:-translate-y-1
                hover:shadow-md
                dark:border-slate-800
                dark:bg-slate-900
              "
            >
              <div className="flex items-center gap-4">

                <div className="shrink-0 rounded-2xl bg-purple-50 p-3 text-purple-500 dark:bg-purple-500/10">
                  <Trophy size={24} />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    Take a Quiz
                  </h3>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                    {safeQuizTotal > 0
                      ? `Latest score: ${quizProgress}%`
                      : "Test your Japanese knowledge"}
                  </p>
                </div>

                <ArrowRight
                  size={19}
                  className="shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-purple-500"
                />

              </div>
            </Link>

          </div>

        </section>

        {/* =================================================
            API STATUS
        ================================================= */}

        <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 p-3.5 dark:border-green-500/20 dark:bg-green-500/5 sm:mt-6 sm:p-4">

          <div className="flex items-center gap-3">

            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-500 text-sm font-bold text-white">
              ✓
            </div>

            <div className="min-w-0">

              <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                Kanji API connected
              </p>

              <p className="text-xs text-green-600 dark:text-green-400/70">
                {kanjiLoading
                  ? "Loading Kanji data..."
                  : `${jlptLevel}: ${totalKanjiCount} Kanji available`}
              </p>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  icon: Icon,
  title,
  value,
  unit,
  description,
}: {
  icon: typeof Flame;
  title: string;
  value: string;
  unit: string;
  description: string;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="
        min-w-0
        rounded-2xl
        border border-slate-200
        bg-white
        p-4 shadow-sm
        dark:border-slate-800
        dark:bg-slate-900
        sm:p-5
      "
    >

      <div className="flex items-center justify-between gap-2">

        <div className="shrink-0 rounded-xl bg-pink-50 p-2.5 text-pink-500 dark:bg-pink-950/30">
          <Icon size={20} />
        </div>

        <span className="hidden text-[10px] font-semibold text-green-500 sm:block">
          ACTIVE
        </span>

      </div>

      <p className="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400 sm:mt-5 sm:text-sm">
        {title}
      </p>

      <div className="mt-1 flex min-w-0 items-baseline gap-1.5">

        <span className="truncate text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">
          {value}
        </span>

        <span className="shrink-0 text-[10px] text-slate-500 sm:text-sm">
          {unit}
        </span>

      </div>

      <p className="mt-1.5 truncate text-[10px] text-slate-400 sm:text-xs">
        {description}
      </p>

    </motion.div>
  );
}

export default Dashboard;