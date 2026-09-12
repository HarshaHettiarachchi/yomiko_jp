import { useMemo, useState } from "react";
import {
  Check,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  MessageCircle,
  Search,
  Volume2,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import {
  expressionsData,
  type ExpressionItem,
} from "@/data/expressions";

const categories = [
  "All",
  "Greetings",
  "Shopping",
  "Restaurant",
  "Travel",
  "Workplace",
  "Daily Life",
  "Hospital",
  "Emergency",
  "Casual",
  "Polite",
] as const;

const LEARNED_KEY = "yomiko-expressions-learned";

/* =====================================================
   HELPERS
===================================================== */

function readLearned(): number[] {
  try {
    const saved = JSON.parse(
      localStorage.getItem(LEARNED_KEY) || "[]",
    );

    if (!Array.isArray(saved)) {
      return [];
    }

    return saved.filter(
      (item): item is number => typeof item === "number",
    );
  } catch {
    return [];
  }
}

function speakJapanese(text: string) {
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  utterance.lang = "ja-JP";
  utterance.rate = 0.82;
  utterance.pitch = 1;

  window.speechSynthesis.speak(utterance);
}

/* =====================================================
   MAIN COMPONENT
===================================================== */

function Expressions() {
  const [selectedCategory, setSelectedCategory] =
    useState<(typeof categories)[number]>("All");

  const [search, setSearch] = useState("");

  const [selectedExpression, setSelectedExpression] =
    useState<ExpressionItem | null>(null);

  const [learned, setLearned] =
    useState<number[]>(readLearned);

  /* =====================================================
     FILTER
  ===================================================== */

  const filteredExpressions = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return expressionsData.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" ||
        item.category === selectedCategory;

      if (!keyword) {
        return matchesCategory;
      }

      const searchText = [
        item.japanese,
        item.romaji,
        item.meaning,
        item.example ?? "",
        item.exampleRomaji ?? "",
        item.exampleMeaning ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return (
        matchesCategory &&
        searchText.includes(keyword)
      );
    });
  }, [selectedCategory, search]);

  /* =====================================================
     LEARNED
  ===================================================== */

  const toggleLearned = (id: number) => {
    setLearned((current) => {
      const isLearned = current.includes(id);

      const updated = isLearned
        ? current.filter((item) => item !== id)
        : [...current, id];

      localStorage.setItem(
        LEARNED_KEY,
        JSON.stringify(updated),
      );

      return updated;
    });
  };

  /* =====================================================
     CATEGORY COUNT
  ===================================================== */

  const categoryCount = (category: string) => {
    if (category === "All") {
      return expressionsData.length;
    }

    return expressionsData.filter(
      (item) => item.category === category,
    ).length;
  };

  /* =====================================================
     OVERALL PROGRESS
  ===================================================== */

  const totalExpressions = expressionsData.length;

  const learnedCount = learned.filter((id) =>
    expressionsData.some(
      (item) => item.id === id,
    ),
  ).length;

  const remainingCount = Math.max(
    totalExpressions - learnedCount,
    0,
  );

  const progress =
    totalExpressions > 0
      ? Math.round(
          (learnedCount / totalExpressions) * 100,
        )
      : 0;

  /* =====================================================
     CATEGORY PROGRESS
  ===================================================== */

  const currentCategoryTotal =
    selectedCategory === "All"
      ? expressionsData.length
      : expressionsData.filter(
          (item) =>
            item.category === selectedCategory,
        ).length;

  const currentCategoryLearned =
    selectedCategory === "All"
      ? learnedCount
      : learned.filter((id) =>
          expressionsData.some(
            (item) =>
              item.id === id &&
              item.category === selectedCategory,
          ),
        ).length;

  const categoryProgress =
    currentCategoryTotal > 0
      ? Math.round(
          (currentCategoryLearned /
            currentCategoryTotal) *
            100,
        )
      : 0;

  return (
    <div className="min-h-screen px-3 py-5 pb-24 sm:px-6 sm:py-6 md:px-8 md:py-8 md:pb-8">
      <div className="mx-auto max-w-7xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.45,
          }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-pink-500 text-white shadow-lg shadow-pink-500/20 sm:h-14 sm:w-14">
              <MessageCircle
                size={25}
                className="sm:hidden"
              />

              <MessageCircle
                size={29}
                className="hidden sm:block"
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                Japanese Expressions
              </h1>

              <p className="mt-1 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
                Useful Japanese expressions for everyday life.
              </p>
            </div>
          </div>
        </motion.div>

        {/* =================================================
            STATS
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
            delay: 0.08,
          }}
          className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          <StatCard
            label="Total Expressions"
            value={totalExpressions}
          />

          <StatCard
            label="Learned"
            value={learnedCount}
            accent="green"
          />

          <StatCard
            label="Remaining"
            value={remainingCount}
            accent="pink"
          />

          <StatCard
            label="Progress"
            value={`${progress}%`}
            accent="purple"
          />
        </motion.div>

        {/* =================================================
            CATEGORY SELECTOR
        ================================================= */}

        <motion.section
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.12,
          }}
          className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="mb-4">
            <h2 className="font-bold text-slate-900 dark:text-white">
              Expression Categories
            </h2>

            <p className="mt-1 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
              Choose a category to practice.
            </p>
          </div>

          {/* =================================================
              RESPONSIVE CATEGORY GRID
          ================================================= */}

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {categories.map((category) => {
              const active =
                selectedCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() =>
                    setSelectedCategory(category)
                  }
                  className={`flex min-w-0 items-center justify-center gap-1.5 rounded-xl px-2.5 py-3 text-xs font-bold transition-all sm:px-3 sm:text-sm ${
                    active
                      ? "bg-pink-500 text-white shadow-md shadow-pink-500/20"
                      : "border border-slate-200 bg-slate-50 text-slate-600 hover:border-pink-300 hover:bg-pink-50 hover:text-pink-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-pink-500 dark:hover:bg-slate-700"
                  }`}
                >
                  <span className="min-w-0 truncate">
                    {category}
                  </span>

                  <span
                    className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] ${
                      active
                        ? "bg-white/20 text-white"
                        : "bg-black/5 dark:bg-white/10"
                    }`}
                  >
                    {categoryCount(category)}
                  </span>
                </button>
              );
            })}
          </div>

          {/* CATEGORY PROGRESS */}

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-500 dark:text-slate-400">
                {selectedCategory} Progress
              </span>

              <span className="font-bold text-pink-500">
                {currentCategoryLearned} /{" "}
                {currentCategoryTotal}
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <motion.div
                initial={{
                  width: 0,
                }}
                animate={{
                  width: `${categoryProgress}%`,
                }}
                transition={{
                  duration: 0.6,
                }}
                className="h-full rounded-full bg-pink-500"
              />
            </div>
          </div>
        </motion.section>

        {/* =================================================
            SEARCH
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
            delay: 0.16,
          }}
          className="relative mb-6"
        >
          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search Japanese, romaji, meaning..."
            className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-11 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:ring-pink-500/10"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-pink-500 dark:hover:bg-slate-800"
            >
              <X size={17} />
            </button>
          )}
        </motion.div>

        {/* =================================================
            RESULT INFO
        ================================================= */}

        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-800 dark:text-white">
              {selectedCategory}
            </p>

            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {filteredExpressions.length} expressions found
            </p>
          </div>

          {search && (
            <span className="rounded-full bg-pink-50 px-3 py-1.5 text-[10px] font-bold text-pink-600 dark:bg-pink-500/10 dark:text-pink-400">
              Search Active
            </span>
          )}
        </div>

        {/* =================================================
            EMPTY STATE
        ================================================= */}

        {filteredExpressions.length === 0 ? (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            className="rounded-3xl border border-dashed border-slate-300 py-16 text-center dark:border-slate-700"
          >
            <Search
              className="mx-auto mb-3 text-slate-400"
              size={38}
            />

            <h3 className="font-semibold text-slate-900 dark:text-white">
              No expressions found
            </h3>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Try another search or category.
            </p>

            {(search ||
              selectedCategory !== "All") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("All");
                }}
                className="mt-4 rounded-xl bg-pink-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-pink-600"
              >
                Clear Filters
              </button>
            )}
          </motion.div>
        ) : (
          /* =================================================
             CARDS
          ================================================= */

          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {filteredExpressions.map(
              (item, index) => {
                const isLearned =
                  learned.includes(item.id);

                return (
                  <ExpressionCard
                    key={item.id}
                    item={item}
                    index={index}
                    isLearned={isLearned}
                    onOpen={() =>
                      setSelectedExpression(item)
                    }
                    onLearned={() =>
                      toggleLearned(item.id)
                    }
                    onSpeak={() =>
                      speakJapanese(item.japanese)
                    }
                  />
                );
              },
            )}
          </div>
        )}
      </div>

      {/* =====================================================
          MODAL
      ===================================================== */}

      <AnimatePresence>
        {selectedExpression && (
          <ExpressionModal
            expression={selectedExpression}
            isLearned={learned.includes(
              selectedExpression.id,
            )}
            onClose={() =>
              setSelectedExpression(null)
            }
            onLearned={() =>
              toggleLearned(selectedExpression.id)
            }
            onSpeak={() =>
              speakJapanese(
                selectedExpression.japanese,
              )
            }
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* =====================================================
   STAT CARD
===================================================== */

function StatCard({
  label,
  value,
  accent = "slate",
}: {
  label: string;
  value: string | number;
  accent?: "slate" | "green" | "pink" | "purple";
}) {
  const colors = {
    slate: "text-slate-900 dark:text-white",
    green: "text-green-500",
    pink: "text-pink-500",
    purple: "text-purple-500",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="text-[11px] font-medium text-slate-500 sm:text-xs dark:text-slate-400">
        {label}
      </p>

      <p
        className={`mt-1 text-2xl font-bold ${colors[accent]}`}
      >
        {value}
      </p>
    </div>
  );
}

/* =====================================================
   EXPRESSION CARD
===================================================== */

function ExpressionCard({
  item,
  index,
  isLearned,
  onOpen,
  onLearned,
  onSpeak,
}: {
  item: ExpressionItem;
  index: number;
  isLearned: boolean;
  onOpen: () => void;
  onLearned: () => void;
  onSpeak: () => void;
}) {
  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 18,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: index * 0.035,
        duration: 0.3,
      }}
      whileHover={{
        y: -4,
      }}
      className={`group relative flex flex-col overflow-hidden rounded-3xl border bg-white shadow-sm transition-shadow hover:shadow-xl dark:bg-slate-900 ${
        isLearned
          ? "border-green-300 dark:border-green-800"
          : "border-slate-200 dark:border-slate-800"
      }`}
    >
      {/* TOP ACCENT */}

      <div
        className={`h-1 ${
          isLearned
            ? "bg-green-500"
            : "bg-pink-500"
        }`}
      />

      <div className="flex flex-1 flex-col p-4 sm:p-5">

        {/* HEADER */}

        <div className="mb-4 flex items-center justify-between gap-2">
          <span className="max-w-[70%] truncate rounded-lg bg-pink-50 px-2.5 py-1 text-[10px] font-bold text-pink-600 dark:bg-pink-500/10 dark:text-pink-400">
            {item.category}
          </span>

          {isLearned ? (
            <span className="flex shrink-0 items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-[10px] font-bold text-green-600 dark:bg-green-500/10 dark:text-green-400">
              <CheckCircle2 size={13} />
              Learned
            </span>
          ) : (
            <span className="shrink-0 text-[10px] font-medium text-slate-400">
              Expression
            </span>
          )}
        </div>

        {/* MAIN CONTENT */}

        <button
          type="button"
          onClick={onOpen}
          className="flex-1 text-left"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="break-words text-2xl font-bold leading-relaxed text-slate-900 transition-colors group-hover:text-pink-500 sm:text-3xl dark:text-white">
                {item.japanese}
              </h2>

              <p className="mt-2 break-words text-xs font-medium leading-5 text-slate-500 sm:text-sm dark:text-slate-400">
                {item.romaji}
              </p>
            </div>

            <div className="mt-1 shrink-0 rounded-full bg-slate-50 p-2 text-slate-400 transition group-hover:bg-pink-50 group-hover:text-pink-500 dark:bg-slate-800 dark:group-hover:bg-pink-500/10">
              <ChevronRight size={16} />
            </div>
          </div>

          <p className="mt-4 line-clamp-2 text-sm font-bold leading-6 text-slate-800 dark:text-slate-200">
            {item.meaning}
          </p>

          {/* EXAMPLE */}

          {item.example && (
            <div className="mt-4 rounded-2xl bg-slate-50 p-3.5 dark:bg-slate-800/70">
              <p className="line-clamp-2 text-sm font-semibold leading-6 text-slate-700 dark:text-slate-300">
                {item.example}
              </p>

              {item.exampleRomaji && (
                <p className="mt-1 line-clamp-1 text-[11px] leading-5 text-slate-400">
                  {item.exampleRomaji}
                </p>
              )}
            </div>
          )}
        </button>

        {/* ACTIONS */}

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={onSpeak}
            aria-label="Listen"
            className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 py-3 text-xs font-semibold text-slate-600 transition hover:border-pink-300 hover:bg-pink-50 hover:text-pink-500 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Volume2 size={15} />
            <span>Listen</span>
          </button>

          <button
            type="button"
            onClick={onLearned}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-3 text-xs font-bold transition ${
              isLearned
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-pink-500 text-white hover:bg-pink-600"
            }`}
          >
            {isLearned ? (
              <>
                <Check size={16} />
                Learned
              </>
            ) : (
              <>
                <GraduationCap size={16} />
                Mark as Learned
              </>
            )}
          </button>
        </div>
      </div>
    </motion.article>
  );
}

/* =====================================================
   MODAL
===================================================== */

function ExpressionModal({
  expression,
  isLearned,
  onClose,
  onLearned,
  onSpeak,
}: {
  expression: ExpressionItem;
  isLearned: boolean;
  onClose: () => void;
  onLearned: () => void;
  onSpeak: () => void;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-4"
    >
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.94,
          y: 20,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          scale: 0.94,
          y: 20,
        }}
        transition={{
          duration: 0.22,
        }}
        onClick={(event) =>
          event.stopPropagation()
        }
        className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl dark:bg-slate-900"
      >
        {/* MODAL HEADER */}

        <div className="relative overflow-hidden bg-gradient-to-br from-pink-500 via-pink-500 to-purple-500 p-5 text-white sm:p-7">
          <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

          <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

          {/* CLOSE */}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 rounded-full bg-black/15 p-2 backdrop-blur transition hover:bg-black/25 sm:right-4 sm:top-4"
          >
            <X size={19} />
          </button>

          {/* CATEGORY */}

          <span className="relative inline-flex rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold backdrop-blur-sm">
            {expression.category}
          </span>

          {/* JAPANESE */}

          <h2 className="relative mt-5 break-words text-3xl font-bold leading-relaxed sm:text-5xl">
            {expression.japanese}
          </h2>

          {/* ROMAJI */}

          <p className="relative mt-2 break-words text-sm font-medium text-white/80 sm:text-base">
            {expression.romaji}
          </p>
        </div>

        {/* MODAL BODY */}

        <div className="p-4 sm:p-6">

          {/* MEANING */}

          <section className="mb-5 sm:mb-6">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Meaning
            </p>

            <p className="text-xl font-bold leading-7 text-slate-900 dark:text-white">
              {expression.meaning}
            </p>
          </section>

          {/* EXAMPLE */}

          {expression.example && (
            <section className="rounded-2xl border border-pink-100 bg-pink-50/70 p-4 sm:p-5 dark:border-pink-500/20 dark:bg-pink-500/5">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-wider text-pink-500">
                  Example
                </p>

                <button
                  type="button"
                  onClick={onSpeak}
                  aria-label="Listen to expression"
                  className="rounded-xl bg-white p-2 text-pink-500 shadow-sm transition hover:bg-pink-50 dark:bg-slate-900 dark:hover:bg-slate-800"
                >
                  <Volume2 size={17} />
                </button>
              </div>

              <p className="mt-3 text-lg font-bold leading-7 text-slate-900 dark:text-white">
                {expression.example}
              </p>

              {expression.exampleRomaji && (
                <p className="mt-2 text-sm font-medium leading-6 text-pink-600 dark:text-pink-400">
                  {expression.exampleRomaji}
                </p>
              )}

              {expression.exampleMeaning && (
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {expression.exampleMeaning}
                </p>
              )}
            </section>
          )}

          {/* LISTEN */}

          <button
            type="button"
            onClick={onSpeak}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-pink-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-pink-500/20 transition hover:bg-pink-600 sm:mt-6"
          >
            <Volume2 size={19} />
            Listen to Expression
          </button>

          {/* LEARNED */}

          <button
            type="button"
            onClick={onLearned}
            className={`mt-3 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold text-white transition ${
              isLearned
                ? "bg-green-500 hover:bg-green-600"
                : "bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600"
            }`}
          >
            {isLearned ? (
              <>
                <Check size={19} />
                Expression Learned
              </>
            ) : (
              <>
                <GraduationCap size={19} />
                Mark as Learned
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Expressions;