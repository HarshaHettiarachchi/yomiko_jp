import type { ElementType } from "react";

import {
  Award,
  BookOpen,
  Brain,
  Flame,
  Headphones,
  Languages,
  MessageCircle,
  RefreshCw,
  Sparkles,
  Target,
  Trophy,
  Zap,
  CircleHelp,
  Hash,
} from "lucide-react";

import { useLearning } from "@/context/LearningContext";

/* =========================================================
   CONSTANTS
========================================================= */

const KANA_TOTAL = 46;
const NUMBERS_TOTAL = 289;
const LISTENING_TOTAL = 400;

const EXPRESSIONS_TOTAL = 200;
const VERBS_TOTAL = 100;
const ADJECTIVES_TOTAL = 200;

const VOCABULARY_TOTAL = 100;
const GRAMMAR_TOTAL = 33;

/* =========================================================
   COMPONENT
========================================================= */

function Progress() {
  const {
    jlptLevel,
    learnedKanji,
    learnedKana,
    learnedNumbers,
    listeningCompleted,
    quizScore,
    quizTotal,
    streak,
    xp,
    quizAttempts,
    quizBestScore,
    quizQuestionsAnswered,
    quizCorrectAnswers,
    quizAverageAccuracy,
    quizCategoryStats,
  } = useLearning();

  /* =======================================================
     SAFE NUMERIC VALUES
  ======================================================= */

  const safeKanji = Number.isFinite(learnedKanji)
    ? Math.max(0, learnedKanji)
    : 0;

  const safeKana = Number.isFinite(learnedKana)
    ? Math.max(0, learnedKana)
    : 0;

  const safeNumbers = Number.isFinite(learnedNumbers)
    ? Math.max(0, learnedNumbers)
    : 0;

  const safeListening = Number.isFinite(listeningCompleted)
    ? Math.max(0, listeningCompleted)
    : 0;

  const safeQuizScore = Number.isFinite(quizScore)
    ? Math.max(0, quizScore)
    : 0;

  const safeQuizTotal = Number.isFinite(quizTotal)
    ? Math.max(0, quizTotal)
    : 0;

  const safeStreak = Number.isFinite(streak)
    ? Math.max(0, streak)
    : 0;

  const safeXp = Number.isFinite(xp)
    ? Math.max(0, xp)
    : 0;

  const safeQuizAttempts = Number.isFinite(quizAttempts)
    ? Math.max(0, quizAttempts)
    : 0;

  const safeQuizBestScore = Number.isFinite(quizBestScore)
    ? Math.max(0, quizBestScore)
    : 0;

  const safeQuestionsAnswered = Number.isFinite(
    quizQuestionsAnswered,
  )
    ? Math.max(0, quizQuestionsAnswered)
    : 0;

  const safeCorrectAnswers = Number.isFinite(
    quizCorrectAnswers,
  )
    ? Math.max(0, quizCorrectAnswers)
    : 0;

  const safeAverageAccuracy = Number.isFinite(
    quizAverageAccuracy,
  )
    ? Math.min(Math.max(quizAverageAccuracy, 0), 100)
    : 0;

  /* =======================================================
     JLPT KANJI TOTAL
     
     Current project:
     N5 = 79
     Other levels = 166
  ======================================================= */

  const KANJI_TOTAL = jlptLevel === "N5" ? 79 : 166;

  /* =======================================================
     LOCAL STORAGE
  ======================================================= */

  const getStoredArrayLength = (key: string): number => {
    try {
      const saved = localStorage.getItem(key);

      if (!saved) {
        return 0;
      }

      const parsed: unknown = JSON.parse(saved);

      if (!Array.isArray(parsed)) {
        return 0;
      }

      return parsed.length;
    } catch {
      return 0;
    }
  };

  const vocabularyLearned = getStoredArrayLength(
    "yomiko-vocabulary-favorites",
  );

  const grammarLearned = getStoredArrayLength(
    "yomiko-grammar-learned",
  );

  const expressionsLearned = getStoredArrayLength(
    "yomiko-expressions-learned",
  );

  const verbsLearned = getStoredArrayLength(
    "yomiko-verbs-learned",
  );

  const adjectivesLearned = getStoredArrayLength(
    "yomiko-adjectives-learned",
  );

  /* =======================================================
     PERCENTAGE HELPER
  ======================================================= */

  const getPercentage = (
    value: number,
    total: number,
  ): number => {
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
  };

  /* =======================================================
     MAIN PERCENTAGES
  ======================================================= */

  const kanaPercentage = getPercentage(
    safeKana,
    KANA_TOTAL,
  );

  const numbersPercentage = getPercentage(
    safeNumbers,
    NUMBERS_TOTAL,
  );

  const listeningPercentage = getPercentage(
    safeListening,
    LISTENING_TOTAL,
  );

  const quizPercentage = getPercentage(
    safeQuizScore,
    safeQuizTotal,
  );

  /* =======================================================
     LEARNING SKILLS
  ======================================================= */

  const skillData = [
    {
      name: "Kanji",
      value: safeKanji,
      total: KANJI_TOTAL,
      icon: BookOpen,
    },
    {
      name: "Vocabulary",
      value: vocabularyLearned,
      total: VOCABULARY_TOTAL,
      icon: Languages,
    },
    {
      name: "Grammar",
      value: grammarLearned,
      total: GRAMMAR_TOTAL,
      icon: Brain,
    },
    {
      name: "Expressions",
      value: expressionsLearned,
      total: EXPRESSIONS_TOTAL,
      icon: MessageCircle,
    },
    {
      name: "Verbs",
      value: verbsLearned,
      total: VERBS_TOTAL,
      icon: RefreshCw,
    },
    {
      name: "Adjectives",
      value: adjectivesLearned,
      total: ADJECTIVES_TOTAL,
      icon: Sparkles,
    },
    {
      name: "Numbers & Time",
      value: safeNumbers,
      total: NUMBERS_TOTAL,
      icon: Hash,
    },
    {
      name: "Kana",
      value: safeKana,
      total: KANA_TOTAL,
      icon: Languages,
    },
    {
      name: "Listening",
      value: safeListening,
      total: LISTENING_TOTAL,
      icon: Headphones,
    },
  ];

  /* =======================================================
     OVERALL PROGRESS
  ======================================================= */

  const overallProgressValues = skillData.map((item) =>
    getPercentage(item.value, item.total),
  );

  overallProgressValues.push(quizPercentage);

  const overallProgress =
    overallProgressValues.length > 0
      ? Math.round(
          overallProgressValues.reduce(
            (sum, value) => sum + value,
            0,
          ) / overallProgressValues.length,
        )
      : 0;

  /* =======================================================
     QUIZ CATEGORY DATA
  ======================================================= */

  const categoryData = [
    {
      name: "Vocabulary",
      icon: Languages,
      stats: quizCategoryStats.Vocabulary,
    },
    {
      name: "Kanji",
      icon: BookOpen,
      stats: quizCategoryStats.Kanji,
    },
    {
      name: "Hiragana",
      icon: Sparkles,
      stats: quizCategoryStats.Hiragana,
    },
    {
      name: "Katakana",
      icon: Sparkles,
      stats: quizCategoryStats.Katakana,
    },
  ];

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 pb-28 dark:bg-slate-950 sm:px-6 sm:py-8 md:px-8">
      <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">

        {/* =================================================
            HEADER
        ================================================= */}

        <section>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-pink-500 sm:text-sm">
            Your Learning Journey
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Progress
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
            Track your Japanese learning progress and quiz
            performance.
          </p>
        </section>

        {/* =================================================
            OVERALL PROGRESS
        ================================================= */}

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-pink-100 text-pink-600 dark:bg-pink-500/10 dark:text-pink-400">
                <Target size={25} />
              </div>

              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Overall Progress
                </p>

                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                  {overallProgress}%
                </h2>
              </div>
            </div>

            <div className="w-full md:max-w-lg">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">
                  Current JLPT Level
                </span>

                <span className="font-bold text-pink-500">
                  {jlptLevel}
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-pink-500 transition-all duration-700"
                  style={{
                    width: `${overallProgress}%`,
                  }}
                />
              </div>
            </div>

          </div>
        </section>

        {/* =================================================
            MAIN STATS
        ================================================= */}

        <section className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">

          <StatCard
            icon={Flame}
            label="Streak"
            value={`${safeStreak} days`}
          />

          <StatCard
            icon={Zap}
            label="XP"
            value={safeXp.toLocaleString()}
          />

          <StatCard
            icon={Trophy}
            label="Quiz Accuracy"
            value={`${safeAverageAccuracy}%`}
          />

          <StatCard
            icon={Award}
            label="Best Quiz"
            value={`${safeQuizBestScore}%`}
          />

        </section>

        {/* =================================================
            LEARNING SKILLS
        ================================================= */}

        <section>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Learning Skills
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Your progress across Yomiko learning areas.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">

            {skillData.map((skill) => {
              const Icon = skill.icon;

              const percentage = getPercentage(
                skill.value,
                skill.total,
              );

              return (
                <div
                  key={skill.name}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 sm:p-5"
                >
                  <div className="flex items-center justify-between gap-2">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-500 dark:bg-pink-500/10">
                      <Icon size={19} />
                    </div>

                    <span className="text-sm font-bold text-pink-500">
                      {percentage}%
                    </span>

                  </div>

                  <h3 className="mt-4 truncate text-sm font-bold text-slate-900 dark:text-white sm:text-base">
                    {skill.name}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                    {skill.value.toLocaleString()} /{" "}
                    {skill.total.toLocaleString()}
                  </p>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-pink-500 transition-all duration-700"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}

          </div>
        </section>

        {/* =================================================
            QUIZ PERFORMANCE
        ================================================= */}

        <section>
          <div className="mb-4">
            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400">
                <CircleHelp size={21} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Quiz Performance
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Your overall quiz statistics.
                </p>
              </div>

            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">

            <QuizStat
              label="Attempts"
              value={safeQuizAttempts}
            />

            <QuizStat
              label="Questions Answered"
              value={safeQuestionsAnswered}
            />

            <QuizStat
              label="Correct Answers"
              value={safeCorrectAnswers}
            />

            <QuizStat
              label="Overall Accuracy"
              value={`${safeAverageAccuracy}%`}
            />

          </div>
        </section>

        {/* =================================================
            QUIZ CATEGORY STATISTICS
        ================================================= */}

        <section>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Quiz by Category
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              See how you perform in each quiz category.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">

            {categoryData.map((category) => {
              const Icon = category.icon;
              const stats = category.stats;

              const accuracy = Number.isFinite(
                stats.accuracy,
              )
                ? Math.min(
                    Math.max(stats.accuracy, 0),
                    100,
                  )
                : 0;

              return (
                <div
                  key={category.name}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5"
                >
                  <div className="flex items-center justify-between gap-2">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-500 dark:bg-pink-500/10">
                      <Icon size={19} />
                    </div>

                    <span className="text-lg font-bold text-pink-500 sm:text-xl">
                      {accuracy}%
                    </span>

                  </div>

                  <h3 className="mt-4 text-sm font-bold text-slate-900 dark:text-white sm:text-base">
                    {category.name}
                  </h3>

                  <div className="mt-4 space-y-2 text-xs sm:text-sm">

                    <div className="flex items-center justify-between gap-2">
                      <span className="text-slate-500 dark:text-slate-400">
                        Attempts
                      </span>

                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {stats.attempts}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span className="text-slate-500 dark:text-slate-400">
                        Questions
                      </span>

                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {stats.questions}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span className="text-slate-500 dark:text-slate-400">
                        Correct
                      </span>

                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {stats.correct}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span className="text-slate-500 dark:text-slate-400">
                        Best Score
                      </span>

                      <span className="font-semibold text-pink-500">
                        {stats.bestScore}%
                      </span>
                    </div>

                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-pink-500 transition-all duration-700"
                      style={{
                        width: `${accuracy}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}

          </div>
        </section>

        {/* =================================================
            LEARNING SUMMARY
        ================================================= */}

        <section>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Learning Summary
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              A quick overview of your current learning progress.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">

            <SummaryCard
              title="Kana"
              value={`${safeKana} / ${KANA_TOTAL}`}
              percentage={kanaPercentage}
            />

            <SummaryCard
              title="Numbers & Time"
              value={`${safeNumbers.toLocaleString()} / ${NUMBERS_TOTAL.toLocaleString()}`}
              percentage={numbersPercentage}
            />

            <SummaryCard
              title="Listening"
              value={`${safeListening} / ${LISTENING_TOTAL}`}
              percentage={listeningPercentage}
            />

            <SummaryCard
              title="Latest Quiz"
              value={`${safeQuizScore} / ${safeQuizTotal}`}
              percentage={quizPercentage}
            />

          </div>
        </section>

      </div>
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">

      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-pink-50 text-pink-500 dark:bg-pink-500/10">
        <Icon size={20} />
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
        {label}
      </p>

      <p className="mt-1 truncate text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
        {value}
      </p>

    </div>
  );
}

/* =========================================================
   QUIZ STAT
========================================================= */

function QuizStat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">

      <p className="text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
        {label}
      </p>

      <p className="mt-2 text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
        {value}
      </p>

    </div>
  );
}

/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({
  title,
  value,
  percentage,
}: {
  title: string;
  value: string;
  percentage: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">

      <div className="flex items-center justify-between gap-2">
        <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-white">
          {title}
        </h3>

        <span className="shrink-0 text-sm font-bold text-pink-500">
          {percentage}%
        </span>
      </div>

      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
        {value}
      </p>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-pink-500 transition-all duration-700"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>

    </div>
  );
}

export default Progress;