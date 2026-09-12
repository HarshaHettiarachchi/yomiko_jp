import { useMemo, useState } from "react";
import {
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  Search,
  Volume2,
  X,
  type LucideIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { grammarData } from "@/data/grammar";
import type { GrammarItem } from "@/data/grammar";

const levels = ["All", "N5", "N4", "N3", "N2", "N1"] as const;

const LEARNED_KEY = "yomiko-grammar-learned";

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
   LEVEL ICON
===================================================== */

const levelIcons: Record<string, LucideIcon> = {
  All: BookOpen,
  N5: GraduationCap,
  N4: GraduationCap,
  N3: GraduationCap,
  N2: GraduationCap,
  N1: GraduationCap,
};

/* =====================================================
   MAIN COMPONENT
===================================================== */

function Grammar() {
  const [selectedLevel, setSelectedLevel] =
    useState<(typeof levels)[number]>("All");

  const [search, setSearch] = useState("");

  const [selectedGrammar, setSelectedGrammar] =
    useState<GrammarItem | null>(null);

  const [learned, setLearned] =
    useState<number[]>(readLearned);

  /* =====================================================
     FILTER
  ===================================================== */

  const filteredGrammar = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return grammarData.filter((item) => {
      const matchesLevel =
        selectedLevel === "All" ||
        item.level === selectedLevel;

      if (!keyword) {
        return matchesLevel;
      }

      const searchText = [
        item.pattern,
        item.meaning,
        item.romaji,
        item.example,
        item.exampleRomaji,
        item.exampleMeaning,
        item.usage,
      ]
        .join(" ")
        .toLowerCase();

      return (
        matchesLevel &&
        searchText.includes(keyword)
      );
    });
  }, [selectedLevel, search]);

  /* =====================================================
     TOGGLE LEARNED
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
     COUNTS
  ===================================================== */

  const levelCount = (level: string) => {
    if (level === "All") {
      return grammarData.length;
    }

    return grammarData.filter(
      (item) => item.level === level,
    ).length;
  };

  const currentLevelLearned =
    selectedLevel === "All"
      ? learned.filter((id) =>
          grammarData.some(
            (item) => item.id === id,
          ),
        ).length
      : learned.filter((id) =>
          grammarData.some(
            (item) =>
              item.id === id &&
              item.level === selectedLevel,
          ),
        ).length;

  const currentLevelTotal =
    selectedLevel === "All"
      ? grammarData.length
      : levelCount(selectedLevel);

  const progress =
    currentLevelTotal > 0
      ? Math.round(
          (currentLevelLearned /
            currentLevelTotal) *
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
              <BookOpen
                size={25}
                className="sm:hidden"
              />

              <BookOpen
                size={29}
                className="hidden sm:block"
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                Japanese Grammar
              </h1>

              <p className="mt-1 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
                Learn Japanese grammar patterns step by step.
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
            label="Total Grammar"
            value={grammarData.length}
            icon={BookOpen}
          />

          <StatCard
            label="Learned"
            value={learned.length}
            icon={CheckCircle2}
            accent="green"
          />

          <StatCard
            label="Remaining"
            value={Math.max(
              grammarData.length - learned.length,
              0,
            )}
            icon={GraduationCap}
            accent="pink"
          />

          <StatCard
            label="Progress"
            value={`${progress}%`}
            icon={Check}
            accent="purple"
          />

        </motion.div>

        {/* =================================================
            LEVEL SELECTOR
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
              Select JLPT Level
            </h2>

            <p className="mt-1 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
              Choose the grammar level you want to study.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {levels.map((level) => {
              const Icon = levelIcons[level];

              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => setSelectedLevel(level)}
                  className={`flex min-w-0 items-center justify-center gap-1.5 rounded-xl px-2.5 py-3 text-xs font-bold transition-all sm:px-3 sm:text-sm ${
                    selectedLevel === level
                      ? "bg-pink-500 text-white shadow-md shadow-pink-500/20"
                      : "border border-slate-200 bg-slate-50 text-slate-600 hover:border-pink-300 hover:bg-pink-50 hover:text-pink-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-pink-500 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon size={15} className="shrink-0" />
                  <span>{level}</span>
                  <span className="rounded-full bg-black/5 px-1.5 py-0.5 text-[10px] dark:bg-white/10">
                    {levelCount(level)}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Progress */}

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-500 dark:text-slate-400">
                {selectedLevel} Progress
              </span>

              <span className="font-bold text-pink-500">
                {currentLevelLearned} / {currentLevelTotal}
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <motion.div
                initial={{
                  width: 0,
                }}
                animate={{
                  width: `${progress}%`,
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
            placeholder="Search grammar, meaning, romaji..."
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
            RESULTS INFO
        ================================================= */}

        <div className="mb-5 flex items-center justify-between">

          <div>
            <p className="text-sm font-bold text-slate-800 dark:text-white">
              {selectedLevel} Grammar
            </p>

            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {filteredGrammar.length} grammar patterns
            </p>
          </div>

          {search && (
            <span className="rounded-full bg-pink-50 px-3 py-1.5 text-xs font-semibold text-pink-600 dark:bg-pink-500/10 dark:text-pink-400">
              Searching
            </span>
          )}

        </div>

        {/* =================================================
            EMPTY
        ================================================= */}

        {filteredGrammar.length === 0 ? (
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
              No grammar found
            </h3>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Try another search or JLPT level.
            </p>

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-4 rounded-xl bg-pink-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-pink-600"
              >
                Clear Search
              </button>
            )}
          </motion.div>
        ) : (

          /* =================================================
             CARDS
          ================================================= */

          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">

            {filteredGrammar.map(
              (item, index) => {
                const isLearned =
                  learned.includes(item.id);

                return (
                  <GrammarCard
                    key={item.id}
                    item={item}
                    index={index}
                    isLearned={isLearned}
                    onOpen={() =>
                      setSelectedGrammar(item)
                    }
                    onLearned={() =>
                      toggleLearned(item.id)
                    }
                    onSpeak={() =>
                      speakJapanese(item.example)
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
        {selectedGrammar && (
          <GrammarModal
            grammar={selectedGrammar}
            isLearned={learned.includes(
              selectedGrammar.id,
            )}
            onClose={() =>
              setSelectedGrammar(null)
            }
            onLearned={() =>
              toggleLearned(selectedGrammar.id)
            }
            onSpeak={() =>
              speakJapanese(
                selectedGrammar.example,
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
  icon: Icon,
  accent = "slate",
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent?: "slate" | "green" | "pink" | "purple";
}) {
  const accentClasses = {
    slate:
      "text-slate-600 dark:text-slate-300",
    green:
      "text-green-500",
    pink:
      "text-pink-500",
    purple:
      "text-purple-500",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">

      <div className="flex items-center justify-between">

        <p className="text-[11px] font-medium text-slate-500 sm:text-xs dark:text-slate-400">
          {label}
        </p>

        <Icon
          size={17}
          className={accentClasses[accent]}
        />

      </div>

      <p
        className={`mt-1 text-2xl font-bold ${accentClasses[accent]}`}
      >
        {value}
      </p>

    </div>
  );
}

/* =====================================================
   GRAMMAR CARD
===================================================== */

function GrammarCard({
  item,
  index,
  isLearned,
  onOpen,
  onLearned,
  onSpeak,
}: {
  item: GrammarItem;
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
      className={`group relative overflow-hidden rounded-3xl border bg-white shadow-sm transition-shadow hover:shadow-xl dark:bg-slate-900 ${
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

      <div className="p-4 sm:p-5">

        {/* HEADER */}

        <div className="mb-4 flex items-center justify-between">

          <span className="rounded-lg bg-pink-50 px-2.5 py-1 text-[10px] font-bold text-pink-600 dark:bg-pink-500/10 dark:text-pink-400">
            {item.level}
          </span>

          {isLearned ? (
            <span className="flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-bold text-green-600 dark:bg-green-500/10 dark:text-green-400">
              <CheckCircle2 size={13} />
              Learned
            </span>
          ) : (
            <span className="text-[10px] font-medium text-slate-400">
              Grammar
            </span>
          )}

        </div>

        {/* PATTERN */}

        <button
          type="button"
          onClick={onOpen}
          className="block w-full text-left"
        >
          <div className="flex items-start justify-between gap-3">

            <div className="min-w-0">

              <h2 className="text-2xl font-bold tracking-wide text-slate-900 transition-colors group-hover:text-pink-500 sm:text-3xl dark:text-white">
                {item.pattern}
              </h2>

              <p className="mt-2 truncate text-xs font-medium text-slate-500 sm:text-sm dark:text-slate-400">
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
        </button>

        {/* EXAMPLE */}

        <div className="mt-4 rounded-2xl bg-slate-50 p-3.5 dark:bg-slate-800/70">

          <div className="flex items-start justify-between gap-2">

            <div className="min-w-0">

              <p className="text-sm font-semibold leading-6 text-slate-800 dark:text-slate-200">
                {item.example}
              </p>

              <p className="mt-1 text-[11px] leading-5 text-slate-500 dark:text-slate-400">
                {item.exampleMeaning}
              </p>

            </div>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onSpeak();
              }}
              aria-label="Listen to example"
              className="shrink-0 rounded-xl bg-white p-2 text-pink-500 shadow-sm transition hover:bg-pink-50 dark:bg-slate-900 dark:hover:bg-slate-700"
            >
              <Volume2 size={16} />
            </button>

          </div>

        </div>

        {/* ACTIONS */}

        <div className="mt-4 flex gap-2">

          <button
            type="button"
            onClick={onOpen}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 py-3 text-xs font-semibold text-slate-600 transition hover:border-pink-300 hover:bg-pink-50 hover:text-pink-500 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <BookOpen size={15} />
            Details
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

function GrammarModal({
  grammar,
  isLearned,
  onClose,
  onLearned,
  onSpeak,
}: {
  grammar: GrammarItem;
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

        {/* =================================================
            MODAL HEADER
        ================================================= */}

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

          {/* LEVEL */}

          <span className="relative inline-flex rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold backdrop-blur-sm">
            JLPT {grammar.level}
          </span>

          {/* PATTERN */}

          <h2 className="relative mt-5 break-words text-4xl font-bold tracking-wide sm:text-5xl">
            {grammar.pattern}
          </h2>

          <p className="relative mt-2 text-sm font-medium text-white/80 sm:text-base">
            {grammar.romaji}
          </p>

        </div>

        {/* =================================================
            MODAL BODY
        ================================================= */}

        <div className="p-4 sm:p-6">

          {/* MEANING */}

          <section className="mb-5 sm:mb-6">

            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Meaning
            </p>

            <p className="text-xl font-bold text-slate-900 dark:text-white">
              {grammar.meaning}
            </p>

          </section>

          {/* USAGE */}

          <section className="mb-5 sm:mb-6">

            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Usage
            </p>

            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
              <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">
                {grammar.usage}
              </p>
            </div>

          </section>

          {/* EXAMPLE */}

          <section className="rounded-2xl border border-pink-100 bg-pink-50/70 p-4 sm:p-5 dark:border-pink-500/20 dark:bg-pink-500/5">

            <div className="flex items-center justify-between">

              <p className="text-[10px] font-bold uppercase tracking-wider text-pink-500">
                Example
              </p>

              <button
                type="button"
                onClick={onSpeak}
                className="rounded-xl bg-white p-2 text-pink-500 shadow-sm transition hover:bg-pink-50 dark:bg-slate-900 dark:hover:bg-slate-800"
                aria-label="Listen to example"
              >
                <Volume2 size={17} />
              </button>

            </div>

            <p className="mt-3 text-lg font-bold leading-7 text-slate-900 dark:text-white">
              {grammar.example}
            </p>

            <p className="mt-2 text-sm font-medium leading-6 text-pink-600 dark:text-pink-400">
              {grammar.exampleRomaji}
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              {grammar.exampleMeaning}
            </p>

          </section>

          {/* LEARNED */}

          <button
            type="button"
            onClick={onLearned}
            className={`mt-5 flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-bold transition sm:mt-6 sm:py-4 ${
              isLearned
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-pink-500 text-white hover:bg-pink-600"
            }`}
          >
            {isLearned ? (
              <>
                <Check size={19} />
                Grammar Learned
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

export default Grammar;