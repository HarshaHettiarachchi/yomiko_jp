import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type QuizCategory =
  | "Vocabulary"
  | "Kanji"
  | "Hiragana"
  | "Katakana";

export interface QuizHistoryItem {
  id: number;
  category: QuizCategory;
  level: string;
  score: number;
  total: number;
  percentage: number;
  date: string;
}

export interface CategoryQuizStats {
  attempts: number;
  questions: number;
  correct: number;
  accuracy: number;
  bestScore: number;
}

interface LearningContextType {
  name: string;
  jlptLevel: string;
  dailyGoal: number;

  learnedKanji: number;
  learnedKana: number;
  learnedNumbers: number;

  quizScore: number;
  quizTotal: number;
  listeningCompleted: number;

  streak: number;
  xp: number;

  // Number of activities completed today
  dailyCompleted: number;

  quizAttempts: number;
  quizBestScore: number;
  quizQuestionsAnswered: number;
  quizCorrectAnswers: number;
  quizAverageAccuracy: number;

  quizHistory: QuizHistoryItem[];

  quizCategoryStats: Record<
    QuizCategory,
    CategoryQuizStats
  >;

  updateName: (value: string) => void;
  updateJlptLevel: (value: string) => void;
  updateDailyGoal: (value: number) => void;

  // Kanji
  addKanjiLearned: () => void;
  removeKanjiLearned: () => void;

  // Kana
  addKanaLearned: () => void;
  removeKanaLearned: () => void;

  // Numbers
  addLearnedNumber: () => void;
  removeLearnedNumber: () => void;

  // Listening
  addListeningCompleted: () => void;

  // Quiz
  saveQuizResult: (
    score: number,
    total: number,
    category: QuizCategory,
    level: string,
  ) => void;
}

const LearningContext = createContext<
  LearningContextType | undefined
>(undefined);

/* =====================================================
   DEFAULT QUIZ STATS
===================================================== */

const defaultCategoryStats: Record<
  QuizCategory,
  CategoryQuizStats
> = {
  Vocabulary: {
    attempts: 0,
    questions: 0,
    correct: 0,
    accuracy: 0,
    bestScore: 0,
  },

  Kanji: {
    attempts: 0,
    questions: 0,
    correct: 0,
    accuracy: 0,
    bestScore: 0,
  },

  Hiragana: {
    attempts: 0,
    questions: 0,
    correct: 0,
    accuracy: 0,
    bestScore: 0,
  },

  Katakana: {
    attempts: 0,
    questions: 0,
    correct: 0,
    accuracy: 0,
    bestScore: 0,
  },
};

/* =====================================================
   LOCAL STORAGE HELPERS
===================================================== */

function getNumber(
  key: string,
  defaultValue = 0,
): number {
  const value = Number(
    localStorage.getItem(key),
  );

  return Number.isFinite(value)
    ? value
    : defaultValue;
}

function getArray<T>(
  key: string,
): T[] {
  try {
    const data = JSON.parse(
      localStorage.getItem(key) || "[]",
    );

    return Array.isArray(data)
      ? data
      : [];
  } catch {
    return [];
  }
}

/* =====================================================
   LOCAL DATE
===================================================== */

function getLocalDate(): string {
  const date = new Date();

  const year =
    date.getFullYear();

  const month = String(
    date.getMonth() + 1,
  ).padStart(2, "0");

  const day = String(
    date.getDate(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/* =====================================================
   YESTERDAY CHECK
===================================================== */

function isYesterday(
  previousDate: string,
  currentDate: string,
): boolean {
  if (!previousDate) {
    return false;
  }

  const previous =
    new Date(
      `${previousDate}T00:00:00`,
    );

  const current =
    new Date(
      `${currentDate}T00:00:00`,
    );

  const difference =
    current.getTime() -
    previous.getTime();

  const oneDay =
    24 * 60 * 60 * 1000;

  return (
    difference === oneDay
  );
}

/* =====================================================
   CATEGORY STATS
===================================================== */

function loadCategoryStats(): Record<
  QuizCategory,
  CategoryQuizStats
> {
  try {
    const stored = JSON.parse(
      localStorage.getItem(
        "yomiko-quiz-category-stats",
      ) || "{}",
    );

    return {
      Vocabulary: {
        ...defaultCategoryStats.Vocabulary,
        ...(stored.Vocabulary || {}),
      },

      Kanji: {
        ...defaultCategoryStats.Kanji,
        ...(stored.Kanji || {}),
      },

      Hiragana: {
        ...defaultCategoryStats.Hiragana,
        ...(stored.Hiragana || {}),
      },

      Katakana: {
        ...defaultCategoryStats.Katakana,
        ...(stored.Katakana || {}),
      },
    };
  } catch {
    return {
      ...defaultCategoryStats,
    };
  }
}

/* =====================================================
   PROVIDER
===================================================== */

export function LearningProvider({
  children,
}: {
  children: ReactNode;
}) {
  /* ===================================================
     BASIC SETTINGS
  =================================================== */

  const [name, setName] =
    useState(() =>
      localStorage.getItem(
        "yomiko-name",
      ) || "Learner",
    );

  const [jlptLevel, setJlptLevel] =
    useState(() =>
      localStorage.getItem(
        "yomiko-jlpt-level",
      ) || "N5",
    );

  const [dailyGoal, setDailyGoal] =
    useState(() => {
      const saved =
        getNumber(
          "yomiko-daily-goal",
          20,
        );

      return Math.max(
        1,
        saved,
      );
    });

  /* ===================================================
     LEARNING COUNTS
  =================================================== */

  const [
    learnedKanji,
    setLearnedKanji,
  ] = useState(() =>
    Math.max(
      0,
      getNumber(
        "yomiko-learned",
        0,
      ),
    ),
  );

  const [
    learnedKana,
    setLearnedKana,
  ] = useState(() =>
    Math.max(
      0,
      getNumber(
        "yomiko-kana-learned",
        0,
      ),
    ),
  );

  const [
    learnedNumbers,
    setLearnedNumbers,
  ] = useState(() =>
    Math.max(
      0,
      getNumber(
        "yomiko-numbers-learned",
        0,
      ),
    ),
  );

  /* ===================================================
     QUIZ
  =================================================== */

  const [
    quizScore,
    setQuizScore,
  ] = useState(() =>
    Math.max(
      0,
      getNumber(
        "yomiko-quiz-score",
        0,
      ),
    ),
  );

  const [
    quizTotal,
    setQuizTotal,
  ] = useState(() =>
    Math.max(
      0,
      getNumber(
        "yomiko-quiz-total",
        0,
      ),
    ),
  );

  const [
    quizAttempts,
    setQuizAttempts,
  ] = useState(() =>
    Math.max(
      0,
      getNumber(
        "yomiko-quiz-attempts",
        0,
      ),
    ),
  );

  const [
    quizBestScore,
    setQuizBestScore,
  ] = useState(() =>
    Math.max(
      0,
      getNumber(
        "yomiko-quiz-best-score",
        0,
      ),
    ),
  );

  const [
    quizQuestionsAnswered,
    setQuizQuestionsAnswered,
  ] = useState(() =>
    Math.max(
      0,
      getNumber(
        "yomiko-quiz-questions",
        0,
      ),
    ),
  );

  const [
    quizCorrectAnswers,
    setQuizCorrectAnswers,
  ] = useState(() =>
    Math.max(
      0,
      getNumber(
        "yomiko-quiz-correct",
        0,
      ),
    ),
  );

  const [
    quizHistory,
    setQuizHistory,
  ] = useState<
    QuizHistoryItem[]
  >(() =>
    getArray<QuizHistoryItem>(
      "yomiko-quiz-history",
    ),
  );

  const [
    quizCategoryStats,
    setQuizCategoryStats,
  ] = useState<
    Record<
      QuizCategory,
      CategoryQuizStats
    >
  >(loadCategoryStats);

  /* ===================================================
     LISTENING
  =================================================== */

  const [
    listeningCompleted,
    setListeningCompleted,
  ] = useState(() =>
    Math.max(
      0,
      getNumber(
        "yomiko-listening-completed",
        0,
      ),
    ),
  );

  /* ===================================================
     STREAK / XP
  =================================================== */

  const [streak, setStreak] =
    useState(() =>
      Math.max(
        0,
        getNumber(
          "yomiko-streak",
          0,
        ),
      ),
    );

  const [xp, setXp] =
    useState(() =>
      Math.max(
        0,
        getNumber(
          "yomiko-xp",
          0,
        ),
      ),
    );

  /* ===================================================
     DAILY ACTIVITY
  =================================================== */

  const [
    dailyCompleted,
    setDailyCompleted,
  ] = useState(() =>
    Math.max(
      0,
      getNumber(
        "yomiko-daily-completed",
        0,
      ),
    ),
  );

  /* ===================================================
     RESET DAILY ACTIVITY WHEN NEW DAY STARTS
  =================================================== */

  useEffect(() => {
    const today =
      getLocalDate();

    const lastActivity =
      localStorage.getItem(
        "yomiko-activity-date",
      );

    if (
      lastActivity &&
      lastActivity !== today
    ) {
      setDailyCompleted(0);

      localStorage.setItem(
        "yomiko-daily-completed",
        "0",
      );
    }

    localStorage.setItem(
      "yomiko-activity-date",
      today,
    );
  }, []);

  /* ===================================================
     SAVE BASIC SETTINGS
  =================================================== */

  useEffect(() => {
    localStorage.setItem(
      "yomiko-name",
      name,
    );
  }, [name]);

  useEffect(() => {
    localStorage.setItem(
      "yomiko-jlpt-level",
      jlptLevel,
    );
  }, [jlptLevel]);

  useEffect(() => {
    localStorage.setItem(
      "yomiko-daily-goal",
      String(dailyGoal),
    );
  }, [dailyGoal]);

  /* ===================================================
     SAVE LEARNING COUNTS
  =================================================== */

  useEffect(() => {
    localStorage.setItem(
      "yomiko-learned",
      String(learnedKanji),
    );
  }, [learnedKanji]);

  useEffect(() => {
    localStorage.setItem(
      "yomiko-kana-learned",
      String(learnedKana),
    );
  }, [learnedKana]);

  useEffect(() => {
    localStorage.setItem(
      "yomiko-numbers-learned",
      String(learnedNumbers),
    );
  }, [learnedNumbers]);

  /* ===================================================
     SAVE QUIZ
  =================================================== */

  useEffect(() => {
    localStorage.setItem(
      "yomiko-quiz-score",
      String(quizScore),
    );

    localStorage.setItem(
      "yomiko-quiz-total",
      String(quizTotal),
    );
  }, [
    quizScore,
    quizTotal,
  ]);

  useEffect(() => {
    localStorage.setItem(
      "yomiko-quiz-attempts",
      String(quizAttempts),
    );

    localStorage.setItem(
      "yomiko-quiz-best-score",
      String(quizBestScore),
    );

    localStorage.setItem(
      "yomiko-quiz-questions",
      String(
        quizQuestionsAnswered,
      ),
    );

    localStorage.setItem(
      "yomiko-quiz-correct",
      String(
        quizCorrectAnswers,
      ),
    );
  }, [
    quizAttempts,
    quizBestScore,
    quizQuestionsAnswered,
    quizCorrectAnswers,
  ]);

  useEffect(() => {
    localStorage.setItem(
      "yomiko-quiz-history",
      JSON.stringify(
        quizHistory,
      ),
    );
  }, [quizHistory]);

  useEffect(() => {
    localStorage.setItem(
      "yomiko-quiz-category-stats",
      JSON.stringify(
        quizCategoryStats,
      ),
    );
  }, [quizCategoryStats]);

  /* ===================================================
     SAVE LISTENING
  =================================================== */

  useEffect(() => {
    localStorage.setItem(
      "yomiko-listening-completed",
      String(
        listeningCompleted,
      ),
    );
  }, [listeningCompleted]);

  /* ===================================================
     SAVE STREAK / XP
  =================================================== */

  useEffect(() => {
    localStorage.setItem(
      "yomiko-streak",
      String(streak),
    );
  }, [streak]);

  useEffect(() => {
    localStorage.setItem(
      "yomiko-xp",
      String(xp),
    );
  }, [xp]);

  /* ===================================================
     SAVE DAILY ACTIVITY
  =================================================== */

  useEffect(() => {
    localStorage.setItem(
      "yomiko-daily-completed",
      String(dailyCompleted),
    );
  }, [dailyCompleted]);

  /* ===================================================
     RECORD LEARNING ACTIVITY
  =================================================== */

  const recordActivity = () => {
    const today =
      getLocalDate();

    const lastActivity =
      localStorage.getItem(
        "yomiko-last-activity",
      );

    /*
     * Daily activity count
     */
    setDailyCompleted(
      (value) => value + 1,
    );

    /*
     * Streak:
     *
     * First activity ever -> 1
     * New day after yesterday -> +1
     * Same day -> unchanged
     * Missed days -> restart at 1
     */
    if (!lastActivity) {
      setStreak(1);

      localStorage.setItem(
        "yomiko-last-activity",
        today,
      );

      return;
    }

    if (lastActivity === today) {
      return;
    }

    if (
      isYesterday(
        lastActivity,
        today,
      )
    ) {
      setStreak(
        (value) => value + 1,
      );
    } else {
      setStreak(1);
    }

    localStorage.setItem(
      "yomiko-last-activity",
      today,
    );
  };

  /* ===================================================
     SETTINGS FUNCTIONS
  =================================================== */

  const updateName = (
    value: string,
  ) => {
    setName(value.trim() || "Learner");
  };

  const updateJlptLevel = (
    value: string,
  ) => {
    setJlptLevel(value);
  };

  const updateDailyGoal = (
    value: number,
  ) => {
    const safeValue =
      Number.isFinite(value)
        ? Math.max(
            1,
            Math.round(value),
          )
        : 20;

    setDailyGoal(
      safeValue,
    );
  };

  /* ===================================================
     KANJI
  =================================================== */

  const addKanjiLearned = () => {
    setLearnedKanji(
      (value) => value + 1,
    );

    setXp(
      (value) => value + 10,
    );

    recordActivity();
  };

  const removeKanjiLearned = () => {
    setLearnedKanji(
      (value) =>
        Math.max(
          0,
          value - 1,
        ),
    );
  };

  /* ===================================================
     KANA
  =================================================== */

  const addKanaLearned = () => {
    setLearnedKana(
      (value) => value + 1,
    );

    setXp(
      (value) => value + 5,
    );

    recordActivity();
  };

  const removeKanaLearned = () => {
    setLearnedKana(
      (value) =>
        Math.max(
          0,
          value - 1,
        ),
    );
  };

  /* ===================================================
     NUMBERS
  =================================================== */

  const addLearnedNumber = () => {
    setLearnedNumbers(
      (value) => value + 1,
    );

    setXp(
      (value) => value + 5,
    );

    recordActivity();
  };

  const removeLearnedNumber = () => {
    setLearnedNumbers(
      (value) =>
        Math.max(
          0,
          value - 1,
        ),
    );
  };

  /* ===================================================
     LISTENING
  =================================================== */

  const addListeningCompleted = () => {
    setListeningCompleted(
      (value) => value + 1,
    );

    setXp(
      (value) => value + 15,
    );

    recordActivity();
  };

  /* ===================================================
     QUIZ RESULT
  =================================================== */

  const saveQuizResult = (
    score: number,
    total: number,
    category: QuizCategory,
    level: string,
  ) => {
    if (
      total <= 0 ||
      score < 0
    ) {
      return;
    }

    const safeScore =
      Math.min(
        score,
        total,
      );

    const percentage =
      Math.round(
        (safeScore / total) *
          100,
      );

    const date =
      getLocalDate();

    /* -----------------------------------------------
       HISTORY
    ------------------------------------------------ */

    const historyItem: QuizHistoryItem =
      {
        id: Date.now(),
        category,
        level,
        score: safeScore,
        total,
        percentage,
        date,
      };

    setQuizHistory(
      (history) =>
        [
          historyItem,
          ...history,
        ].slice(0, 50),
    );

    /* -----------------------------------------------
       BASIC QUIZ STATS
    ------------------------------------------------ */

    setQuizScore(
      safeScore,
    );

    setQuizTotal(
      total,
    );

    setQuizAttempts(
      (value) => value + 1,
    );

    setQuizQuestionsAnswered(
      (value) =>
        value + total,
    );

    setQuizCorrectAnswers(
      (value) =>
        value + safeScore,
    );

    setQuizBestScore(
      (value) =>
        Math.max(
          value,
          percentage,
        ),
    );

    /* -----------------------------------------------
       CATEGORY STATS
    ------------------------------------------------ */

    setQuizCategoryStats(
      (current) => {
        const old =
          current[category] ||
          defaultCategoryStats[
            category
          ];

        const questions =
          old.questions +
          total;

        const correct =
          old.correct +
          safeScore;

        const accuracy =
          questions > 0
            ? Math.round(
                (correct /
                  questions) *
                  100,
              )
            : 0;

        return {
          ...current,

          [category]: {
            attempts:
              old.attempts +
              1,

            questions,

            correct,

            accuracy,

            bestScore:
              Math.max(
                old.bestScore,
                percentage,
              ),
          },
        };
      },
    );

    /* -----------------------------------------------
       XP
    ------------------------------------------------ */

    setXp(
      (value) =>
        value +
        safeScore * 10 +
        20,
    );

    /* -----------------------------------------------
       DAILY ACTIVITY + STREAK
    ------------------------------------------------ */

    recordActivity();
  };

  /* ===================================================
     AVERAGE ACCURACY
  =================================================== */

  const quizAverageAccuracy =
    quizQuestionsAnswered > 0
      ? Math.round(
          (quizCorrectAnswers /
            quizQuestionsAnswered) *
            100,
        )
      : 0;

  /* ===================================================
     PROVIDER
  =================================================== */

  return (
    <LearningContext.Provider
      value={{
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

        quizAttempts,
        quizBestScore,
        quizQuestionsAnswered,
        quizCorrectAnswers,
        quizAverageAccuracy,

        quizHistory,
        quizCategoryStats,

        updateName,
        updateJlptLevel,
        updateDailyGoal,

        // Kanji
        addKanjiLearned,
        removeKanjiLearned,

        // Kana
        addKanaLearned,
        removeKanaLearned,

        // Numbers
        addLearnedNumber,
        removeLearnedNumber,

        // Listening
        addListeningCompleted,

        // Quiz
        saveQuizResult,
      }}
    >
      {children}
    </LearningContext.Provider>
  );
}

/* =====================================================
   HOOK
===================================================== */

export function useLearning() {
  const context =
    useContext(
      LearningContext,
    );

  if (!context) {
    throw new Error(
      "useLearning must be used inside LearningProvider",
    );
  }

  return context;
}