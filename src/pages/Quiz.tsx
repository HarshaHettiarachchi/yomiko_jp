import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CircleHelp,
  Headphones,
  Languages,
  Loader2,
  RotateCcw,
  Sparkles,
  Trophy,
  XCircle,
  BookOpen,
} from "lucide-react";

import {
  getKanjiQuizPool,
  getVocabularyQuizPool,
  shuffle,
  createOptions,
  type QuizCategory,
  type VocabularyItem,
  type KanjiItem,
} from "@/services/quizApi";

import { useLearning } from "@/context/LearningContext";

/* =========================================================
   TYPES
========================================================= */

type Question = {
  prompt: string;
  answer: string;
  options: string[];
  type: QuizCategory;
  romaji?: string;
};

/* =========================================================
   CATEGORIES
========================================================= */

const categories: {
  name: QuizCategory;
  description: string;
  icon: typeof Languages;
}[] = [
  {
    name: "Vocabulary",
    description: "Japanese words & meanings",
    icon: Languages,
  },
  {
    name: "Kanji",
    description: "Kanji meanings & readings",
    icon: BookOpen,
  },
  {
    name: "Hiragana",
    description: "Hiragana characters",
    icon: Sparkles,
  },
  {
    name: "Katakana",
    description: "Katakana characters",
    icon: Sparkles,
  },
];

/* =========================================================
   LEVELS
========================================================= */

const levels = ["N5", "N4", "N3", "N2", "N1"];

/* =========================================================
   QUESTION COUNTS
========================================================= */

const questionCounts = [
  10,
  20,
  50,
  100,
  250,
  500,
  1000,
];

/* =========================================================
   HIRAGANA
========================================================= */

const hiragana: [string, string][] = [
  ["あ", "a"],
  ["い", "i"],
  ["う", "u"],
  ["え", "e"],
  ["お", "o"],
  ["か", "ka"],
  ["き", "ki"],
  ["く", "ku"],
  ["け", "ke"],
  ["こ", "ko"],
  ["さ", "sa"],
  ["し", "shi"],
  ["す", "su"],
  ["せ", "se"],
  ["そ", "so"],
  ["た", "ta"],
  ["ち", "chi"],
  ["つ", "tsu"],
  ["て", "te"],
  ["と", "to"],
  ["な", "na"],
  ["に", "ni"],
  ["ぬ", "nu"],
  ["ね", "ne"],
  ["の", "no"],
  ["は", "ha"],
  ["ひ", "hi"],
  ["ふ", "fu"],
  ["へ", "he"],
  ["ほ", "ho"],
  ["ま", "ma"],
  ["み", "mi"],
  ["む", "mu"],
  ["め", "me"],
  ["も", "mo"],
  ["や", "ya"],
  ["ゆ", "yu"],
  ["よ", "yo"],
  ["ら", "ra"],
  ["り", "ri"],
  ["る", "ru"],
  ["れ", "re"],
  ["ろ", "ro"],
  ["わ", "wa"],
  ["を", "wo"],
  ["ん", "n"],
];

/* =========================================================
   KATAKANA
========================================================= */

const katakana: [string, string][] = [
  ["ア", "a"],
  ["イ", "i"],
  ["ウ", "u"],
  ["エ", "e"],
  ["オ", "o"],
  ["カ", "ka"],
  ["キ", "ki"],
  ["ク", "ku"],
  ["ケ", "ke"],
  ["コ", "ko"],
  ["サ", "sa"],
  ["シ", "shi"],
  ["ス", "su"],
  ["セ", "se"],
  ["ソ", "so"],
  ["タ", "ta"],
  ["チ", "chi"],
  ["ツ", "tsu"],
  ["テ", "te"],
  ["ト", "to"],
  ["ナ", "na"],
  ["ニ", "ni"],
  ["ヌ", "nu"],
  ["ネ", "ne"],
  ["ノ", "no"],
  ["ハ", "ha"],
  ["ヒ", "hi"],
  ["フ", "fu"],
  ["ヘ", "he"],
  ["ホ", "ho"],
  ["マ", "ma"],
  ["ミ", "mi"],
  ["ム", "mu"],
  ["メ", "me"],
  ["モ", "mo"],
  ["ヤ", "ya"],
  ["ユ", "yu"],
  ["ヨ", "yo"],
  ["ラ", "ra"],
  ["リ", "ri"],
  ["ル", "ru"],
  ["レ", "re"],
  ["ロ", "ro"],
  ["ワ", "wa"],
  ["ヲ", "wo"],
  ["ン", "n"],
];

/* =========================================================
   COMPONENT
========================================================= */

function Quiz() {
  const { saveQuizResult } = useLearning();

  const [category, setCategory] =
    useState<QuizCategory>("Vocabulary");

  const [selectedLevel, setSelectedLevel] =
    useState("N5");

  const [questionCount, setQuestionCount] =
    useState(10);

  const [questions, setQuestions] =
    useState<Question[]>([]);

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [selectedAnswer, setSelectedAnswer] =
    useState<string | null>(null);

  const [score, setScore] =
    useState(0);

  const [quizStarted, setQuizStarted] =
    useState(false);

  const [quizFinished, setQuizFinished] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [finalScore, setFinalScore] =
    useState(0);

  /* =========================================================
     CURRENT QUESTION
  ========================================================= */

  const currentQuestion =
    questions[currentIndex];

  const progress =
    questions.length > 0
      ? Math.round(
          ((currentIndex + 1) /
            questions.length) *
            100,
        )
      : 0;

  const canUseLevel =
    category === "Vocabulary" ||
    category === "Kanji";

  /* =========================================================
     SPEECH
  ========================================================= */

  const speak = (text: string) => {
    if (
      typeof window === "undefined" ||
      !("speechSynthesis" in window)
    ) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(text);

    utterance.lang = "ja-JP";
    utterance.rate = 0.8;
    utterance.pitch = 1;

    window.speechSynthesis.speak(
      utterance,
    );
  };

  /* =========================================================
     BUILD KANA QUESTIONS
  ========================================================= */

  const buildKanaQuestions = (
    data: [string, string][],
    amount: number,
    type: QuizCategory,
  ): Question[] => {
    const shuffledData =
      shuffle([...data]);

    const selected =
      amount <= shuffledData.length
        ? shuffledData.slice(0, amount)
        : Array.from(
            { length: amount },
            (_, index) =>
              shuffledData[
                index %
                  shuffledData.length
              ],
          );

    const allRomaji = data.map(
      (item) => item[1],
    );

    return selected.map(
      ([character, romaji]) => ({
        prompt: character,
        answer: romaji,
        options: createOptions(
          romaji,
          allRomaji,
          4,
        ),
        type,
      }),
    );
  };

  /* =========================================================
     BUILD VOCABULARY QUESTIONS
  ========================================================= */

  const buildVocabularyQuestions = (
    data: VocabularyItem[],
    amount: number,
  ): Question[] => {
    const pool = shuffle([...data]);

    const selected =
      amount <= pool.length
        ? pool.slice(0, amount)
        : Array.from(
            { length: amount },
            (_, index) =>
              pool[
                index % pool.length
              ],
          );

    const meanings = data.map(
      (item) => item.meaning,
    );

    return selected.map((item) => ({
      prompt: item.word,
      answer: item.meaning,
      options: createOptions(
        item.meaning,
        meanings,
        4,
      ),
      type: "Vocabulary",
      romaji: item.romaji,
    }));
  };

  /* =========================================================
     BUILD KANJI QUESTIONS
  ========================================================= */

  const buildKanjiQuestions = (
    data: KanjiItem[],
    amount: number,
  ): Question[] => {
    const pool = shuffle([...data]);

    const selected =
      amount <= pool.length
        ? pool.slice(0, amount)
        : Array.from(
            { length: amount },
            (_, index) =>
              pool[
                index % pool.length
              ],
          );

    const meanings = data.flatMap(
      (item) => item.meanings,
    );

    return selected.map((item) => {
      const answer =
        item.meanings[0] ||
        "Unknown";

      return {
        prompt: item.kanji,
        answer,
        options: createOptions(
          answer,
          meanings,
          4,
        ),
        type: "Kanji",
      };
    });
  };

  /* =========================================================
     START QUIZ
  ========================================================= */

  const startQuiz = async () => {
    setLoading(true);
    setError("");

    try {
      let generatedQuestions: Question[] =
        [];

      /* -------------------------
         HIRAGANA
      ------------------------- */

      if (category === "Hiragana") {
        generatedQuestions =
          buildKanaQuestions(
            hiragana,
            questionCount,
            "Hiragana",
          );
      }

      /* -------------------------
         KATAKANA
      ------------------------- */

      if (category === "Katakana") {
        generatedQuestions =
          buildKanaQuestions(
            katakana,
            questionCount,
            "Katakana",
          );
      }

      /* -------------------------
         VOCABULARY
      ------------------------- */

      if (category === "Vocabulary") {
        const levelNumber = Number(
          selectedLevel.replace(
            "N",
            "",
          ),
        );

        const vocabulary =
          await getVocabularyQuizPool(
            levelNumber,
            1000,
          );

        if (!vocabulary.length) {
          throw new Error(
            "No vocabulary questions found.",
          );
        }

        generatedQuestions =
          buildVocabularyQuestions(
            vocabulary,
            questionCount,
          );
      }

      /* -------------------------
         KANJI
      ------------------------- */

      if (category === "Kanji") {
        const levelNumber = Number(
          selectedLevel.replace(
            "N",
            "",
          ),
        );

        const kanji =
          await getKanjiQuizPool(
            levelNumber,
          );

        if (!kanji.length) {
          throw new Error(
            "No Kanji questions found.",
          );
        }

        generatedQuestions =
          buildKanjiQuestions(
            kanji,
            questionCount,
          );
      }

      if (!generatedQuestions.length) {
        throw new Error(
          "No questions generated.",
        );
      }

      setQuestions(
        generatedQuestions,
      );

      setCurrentIndex(0);
      setSelectedAnswer(null);
      setScore(0);
      setFinalScore(0);
      setQuizFinished(false);
      setQuizStarted(true);
    } catch (err) {
      console.error(
        "Quiz error:",
        err,
      );

      setError(
        "Quiz questions load කරන්න බැරි වුණා. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     ANSWER
  ========================================================= */

  const handleAnswer = (
    answer: string,
  ) => {
    if (
      selectedAnswer !== null ||
      !currentQuestion
    ) {
      return;
    }

    setSelectedAnswer(answer);

    if (
      answer ===
      currentQuestion.answer
    ) {
      setScore(
        (previous) =>
          previous + 1,
      );
    }
  };

  /* =========================================================
     NEXT QUESTION
  ========================================================= */

  const handleNextQuestion = () => {
    if (
      selectedAnswer === null ||
      !currentQuestion
    ) {
      return;
    }

    const isCorrect =
      selectedAnswer ===
      currentQuestion.answer;

    /*
      score state is updated after the answer click.
      Therefore on the final question we add the
      current answer only when calculating final score.
    */

    const completedScore =
      isCorrect
        ? score
        : score;

    if (
      currentIndex + 1 >=
      questions.length
    ) {
      /*
        Because score already contains the
        current correct answer by the time
        this button is clicked, use score.
      */

      const resultScore =
        score;

      setFinalScore(
        resultScore,
      );

      saveQuizResult(
        resultScore,
        questions.length,
        category,
        selectedLevel,
      );

      setQuizFinished(true);

      return;
    }

    setCurrentIndex(
      (previous) =>
        previous + 1,
    );

    setSelectedAnswer(null);

    void completedScore;
  };

  /* =========================================================
     RESTART
  ========================================================= */

  const restartQuiz = () => {
    setQuestions([]);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setFinalScore(0);
    setQuizStarted(false);
    setQuizFinished(false);
    setError("");
  };

  /* =========================================================
     QUIZ SETUP SCREEN
  ========================================================= */

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-6 pb-28 dark:bg-slate-950 sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto max-w-6xl">

          {/* HEADER */}

          <div className="mb-7 sm:mb-8">

            <div className="mb-3 flex items-center gap-3">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-pink-100 text-pink-500 dark:bg-pink-500/10">
                <CircleHelp className="h-6 w-6" />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-pink-500 sm:text-sm">
                  Practice & Challenge
                </p>

                <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
                  Japanese Quiz
                </h1>
              </div>

            </div>

            <p className="text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
              Test your Japanese knowledge
              with vocabulary, Kanji,
              Hiragana and Katakana.
            </p>

          </div>

          {/* =================================================
              CATEGORY
          ================================================= */}

          <section className="mb-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:mb-6 sm:p-6">

            <h2 className="mb-4 text-base font-bold text-slate-900 dark:text-white sm:text-lg">
              Choose Quiz Category
            </h2>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">

              {categories.map(
                (item) => {
                  const Icon =
                    item.icon;

                  const active =
                    category ===
                    item.name;

                  return (
                    <button
                      key={
                        item.name
                      }
                      type="button"
                      onClick={() =>
                        setCategory(
                          item.name,
                        )
                      }
                      className={`rounded-2xl border p-4 text-left transition-all sm:p-5 ${
                        active
                          ? "border-pink-400 bg-pink-50 shadow-sm dark:border-pink-500 dark:bg-pink-500/10"
                          : "border-slate-200 bg-white hover:border-pink-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
                      }`}
                    >

                      <div
                        className={`mb-3 inline-flex rounded-xl p-2.5 ${
                          active
                            ? "bg-pink-500 text-white"
                            : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 dark:text-white sm:text-base">
                        {item.name}
                      </h3>

                      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400 sm:text-sm">
                        {
                          item.description
                        }
                      </p>

                    </button>
                  );
                },
              )}

            </div>

          </section>

          {/* =================================================
              QUIZ SETTINGS
          ================================================= */}

          <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">

            {/* JLPT */}

            {canUseLevel && (
              <div className="mb-6">

                <h2 className="mb-3 text-base font-bold text-slate-900 dark:text-white sm:text-lg">
                  JLPT Level
                </h2>

                <div className="grid grid-cols-5 gap-2 sm:flex sm:flex-wrap sm:gap-3">

                  {levels.map(
                    (level) => (
                      <button
                        key={
                          level
                        }
                        type="button"
                        onClick={() =>
                          setSelectedLevel(
                            level,
                          )
                        }
                        className={`rounded-xl px-2 py-3 text-sm font-bold transition sm:px-5 ${
                          selectedLevel ===
                          level
                            ? "bg-pink-500 text-white shadow-md shadow-pink-500/20"
                            : "bg-slate-100 text-slate-600 hover:bg-pink-50 hover:text-pink-500 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                        }`}
                      >
                        {level}
                      </button>
                    ),
                  )}

                </div>

              </div>
            )}

            {/* QUESTION COUNT */}

            <div>

              <h2 className="mb-3 text-base font-bold text-slate-900 dark:text-white sm:text-lg">
                Number of Questions
              </h2>

              <div className="grid grid-cols-4 gap-2 sm:flex sm:flex-wrap sm:gap-3">

                {questionCounts.map(
                  (count) => (
                    <button
                      key={
                        count
                      }
                      type="button"
                      onClick={() =>
                        setQuestionCount(
                          count,
                        )
                      }
                      className={`rounded-xl px-2 py-3 text-sm font-bold transition sm:px-5 ${
                        questionCount ===
                        count
                          ? "bg-pink-500 text-white shadow-md shadow-pink-500/20"
                          : "bg-slate-100 text-slate-600 hover:bg-pink-50 hover:text-pink-500 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                      }`}
                    >
                      {count}
                    </button>
                  ),
                )}

              </div>

            </div>

            {/* ERROR */}

            {error && (
              <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400">
                {error}
              </div>
            )}

            {/* START */}

            <button
              type="button"
              onClick={
                startQuiz
              }
              disabled={loading}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-pink-500 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-pink-500/20 transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading Questions...
                </>
              ) : (
                <>
                  <Trophy className="h-5 w-5" />
                  Start Quiz
                </>
              )}
            </button>

          </section>

        </div>
      </div>
    );
  }

  /* =========================================================
     RESULT SCREEN
  ========================================================= */

  if (quizFinished) {
    const percentage =
      questions.length > 0
        ? Math.round(
            (finalScore /
              questions.length) *
              100,
          )
        : 0;

    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8 pb-28 dark:bg-slate-950 sm:px-6 sm:py-10 lg:px-8">
        <div className="mx-auto max-w-2xl">

          <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-10">

            {/* TROPHY */}

            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-pink-100 text-pink-500 dark:bg-pink-500/10">
              <Trophy className="h-10 w-10" />
            </div>

            <p className="text-sm font-bold uppercase tracking-wider text-pink-500">
              Quiz Complete
            </p>

            <h1 className="mt-2 text-3xl font-black text-slate-900 dark:text-white sm:text-4xl">
              Great Job! 🎉
            </h1>

            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              {category}
              {canUseLevel &&
                ` • ${selectedLevel}`}
            </p>

            {/* SCORE */}

            <div className="my-8">

              <div className="text-6xl font-black text-pink-500 sm:text-7xl">
                {percentage}%
              </div>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {finalScore} /{" "}
                {questions.length}{" "}
                correct
              </p>

            </div>

            {/* SUMMARY */}

            <div className="mb-6 grid grid-cols-2 gap-3">

              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Category
                </p>

                <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                  {category}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Questions
                </p>

                <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                  {questions.length}
                </p>
              </div>

            </div>

            {/* AGAIN */}

            <button
              type="button"
              onClick={
                restartQuiz
              }
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-pink-500 px-6 py-4 font-bold text-white transition hover:bg-pink-600"
            >
              <RotateCcw className="h-5 w-5" />
              Take Another Quiz
            </button>

          </div>

        </div>
      </div>
    );
  }

  /* =========================================================
     SAFETY
  ========================================================= */

  if (!currentQuestion) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
      </div>
    );
  }

  /* =========================================================
     QUIZ QUESTION SCREEN
  ========================================================= */

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-5 pb-28 dark:bg-slate-950 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-4xl">

        {/* =====================================================
            TOP BAR
        ===================================================== */}

        <div className="mb-5 flex items-center justify-between gap-3">

          <button
            type="button"
            onClick={
              restartQuiz
            }
            className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-slate-500 transition hover:bg-white hover:text-pink-500 dark:hover:bg-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Exit
          </button>

          <div className="text-right">

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Question
            </p>

            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {currentIndex + 1} /{" "}
              {questions.length}
            </p>

          </div>

        </div>

        {/* =====================================================
            PROGRESS
        ===================================================== */}

        <div className="mb-6">

          <div className="mb-2 flex justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>
              Progress
            </span>

            <span>
              {progress}%
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">

            <div
              className="h-full rounded-full bg-pink-500 transition-all duration-500"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </div>

        {/* =====================================================
            QUESTION CARD
        ===================================================== */}

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8 md:p-10">

          {/* QUESTION HEADER */}

          <div className="mb-7 text-center sm:mb-8">

            <p className="mb-4 text-xs font-bold uppercase tracking-wider text-pink-500 sm:text-sm">
              {category}
              {canUseLevel &&
                ` • ${selectedLevel}`}
            </p>

            {/* PROMPT */}

            <div className="flex items-center justify-center gap-3">

              <h1
                className={`font-black text-slate-900 dark:text-white ${
                  category ===
                  "Vocabulary"
                    ? "text-4xl sm:text-5xl"
                    : "text-6xl sm:text-7xl md:text-8xl"
                }`}
              >
                {
                  currentQuestion.prompt
                }
              </h1>

              {(category ===
                  "Vocabulary" ||
                  category ===
                    "Kanji") && (
                <button
                  type="button"
                  onClick={() =>
                    speak(
                      currentQuestion.prompt,
                    )
                  }
                  aria-label="Listen"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-500 transition hover:bg-pink-100 dark:bg-pink-500/10 dark:hover:bg-pink-500/20"
                >
                  <Headphones className="h-5 w-5" />
                </button>
              )}

            </div>

            {/* ROMAJI */}

            {currentQuestion.romaji && (
              <p className="mt-3 text-base font-semibold text-slate-500 dark:text-slate-400 sm:text-lg">
                {currentQuestion.romaji}
              </p>
            )}

            {/* INSTRUCTION */}

            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 sm:text-base">
              {category ===
              "Vocabulary"
                ? "Choose the correct meaning"
                : category ===
                    "Kanji"
                  ? "Choose the correct meaning"
                  : "Choose the correct romaji"}
            </p>

          </div>

          {/* =================================================
              ANSWERS

              Mobile: 1 column
              Tablet/Desktop: 2 columns
          ================================================= */}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">

            {currentQuestion.options.map(
              (option, index) => {
                const isSelected =
                  selectedAnswer ===
                  option;

                const isCorrect =
                  option ===
                  currentQuestion.answer;

                let optionClass =
                  "border-slate-200 bg-white hover:border-pink-300 hover:bg-pink-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-pink-500 dark:hover:bg-slate-800";

                if (
                  selectedAnswer !==
                  null
                ) {
                  if (
                    isCorrect
                  ) {
                    optionClass =
                      "border-green-400 bg-green-50 text-green-700 dark:border-green-500 dark:bg-green-500/10 dark:text-green-400";
                  } else if (
                    isSelected
                  ) {
                    optionClass =
                      "border-red-400 bg-red-50 text-red-700 dark:border-red-500 dark:bg-red-500/10 dark:text-red-400";
                  } else {
                    optionClass =
                      "border-slate-200 bg-slate-50 opacity-50 dark:border-slate-800 dark:bg-slate-950";
                  }
                }

                return (
                  <button
                    key={`${option}-${index}`}
                    type="button"
                    onClick={() =>
                      handleAnswer(
                        option,
                      )
                    }
                    disabled={
                      selectedAnswer !==
                      null
                    }
                    className={`flex min-h-[68px] w-full items-center justify-between rounded-2xl border-2 px-4 py-4 text-left text-sm font-bold transition-all sm:min-h-[72px] sm:px-5 sm:text-base ${optionClass}`}
                  >

                    <span className="flex min-w-0 items-center gap-3">

                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        {String.fromCharCode(
                          65 + index,
                        )}
                      </span>

                      <span className="break-words">
                        {option}
                      </span>

                    </span>

                    {selectedAnswer !==
                      null &&
                      isCorrect && (
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" />
                      )}

                    {selectedAnswer !==
                      null &&
                      isSelected &&
                      !isCorrect && (
                        <XCircle className="h-5 w-5 shrink-0 text-red-500" />
                      )}

                  </button>
                );
              },
            )}

          </div>

          {/* =================================================
              FEEDBACK
          ================================================= */}

          {selectedAnswer !==
            null && (
            <div
              className={`mt-5 rounded-2xl border p-4 ${
                selectedAnswer ===
                currentQuestion.answer
                  ? "border-green-200 bg-green-50 dark:border-green-900/40 dark:bg-green-500/10"
                  : "border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-500/10"
              }`}
            >

              <div
                className={`flex items-center gap-2 text-sm font-bold ${
                  selectedAnswer ===
                  currentQuestion.answer
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >

                {selectedAnswer ===
                currentQuestion.answer ? (
                  <>
                    <CheckCircle2 className="h-5 w-5" />
                    Correct! 🎉
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5" />
                    Incorrect
                  </>
                )}

              </div>

              {selectedAnswer !==
                currentQuestion.answer && (
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Correct answer:{" "}
                  <strong className="text-slate-900 dark:text-white">
                    {
                      currentQuestion.answer
                    }
                  </strong>
                </p>
              )}

            </div>
          )}

          {/* =================================================
              NEXT BUTTON
          ================================================= */}

          <button
            type="button"
            onClick={
              handleNextQuestion
            }
            disabled={
              selectedAnswer ===
              null
            }
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-pink-500 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-pink-500/20 transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-40 sm:text-base"
          >

            {currentIndex + 1 >=
            questions.length
              ? "Finish Quiz"
              : "Next Question"}

            <ArrowRight className="h-5 w-5" />

          </button>

        </div>

        {/* =====================================================
            CURRENT SCORE
        ===================================================== */}

        <div className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
          Current Score:{" "}
          <span className="font-bold text-pink-500">
            {score}
          </span>
        </div>

      </div>
    </div>
  );
}

export default Quiz;