import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Coins,
  Hash,
  Search,
  Volume2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  allNumberData,
  type NumberCategory,
  type NumberItem,
} from "@/data/numbers";

const STORAGE_KEY = "yomiko-numbers-learned";

const ITEMS_PER_PAGE = 20;

const categories: {
  label: string;
  value: NumberCategory;
  icon: typeof Hash;
}[] = [
  {
    label: "Numbers",
    value: "Numbers",
    icon: Hash,
  },
  {
    label: "Time",
    value: "Time",
    icon: Clock3,
  },
  {
    label: "Days",
    value: "Days",
    icon: CalendarDays,
  },
  {
    label: "Months",
    value: "Months",
    icon: CalendarDays,
  },
  {
    label: "Dates",
    value: "Dates",
    icon: CalendarDays,
  },
  {
    label: "Money",
    value: "Money",
    icon: Coins,
  },
];

function speak(text: string) {
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ja-JP";
  utterance.rate = 0.85;

  window.speechSynthesis.speak(utterance);
}

function getLearnedIds(): number[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return [];

    const parsed = JSON.parse(saved);

    if (!Array.isArray(parsed)) return [];

    return parsed
      .map(Number)
      .filter((id: number) => Number.isFinite(id));
  } catch {
    return [];
  }
}

function Numbers() {
  const [selectedCategory, setSelectedCategory] =
    useState<NumberCategory>("Numbers");

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [learnedIds, setLearnedIds] = useState<number[]>([]);
  const [selectedItem, setSelectedItem] = useState<NumberItem | null>(null);

  useEffect(() => {
    setLearnedIds(getLearnedIds());
  }, []);

  /* =========================================================
     ESCAPE KEY
  ========================================================= */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedItem(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  /* =========================================================
     FILTER DATA
  ========================================================= */
  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return allNumberData.filter((item) => {
      if (item.category !== selectedCategory) {
        return false;
      }

      if (!query) {
        return true;
      }

      return [
        item.japanese,
        item.romaji,
        item.meaning,
        String(item.value ?? ""),
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [selectedCategory, search]);

  /* =========================================================
     PAGINATION
  ========================================================= */
  const totalPages = Math.max(
    1,
    Math.ceil(filteredItems.length / ITEMS_PER_PAGE),
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;

  const endIndex = Math.min(
    startIndex + ITEMS_PER_PAGE,
    filteredItems.length,
  );

  const currentItems = filteredItems.slice(startIndex, endIndex);

  /* =========================================================
     STATS
  ========================================================= */
  const categoryItems = allNumberData.filter(
    (item) => item.category === selectedCategory,
  );

  const categoryTotal = categoryItems.length;

  const categoryLearned = categoryItems.filter((item) =>
    learnedIds.includes(item.id),
  ).length;

  const overallLearned = allNumberData.filter((item) =>
    learnedIds.includes(item.id),
  ).length;

  const overallProgress =
    allNumberData.length > 0
      ? Math.round((overallLearned / allNumberData.length) * 100)
      : 0;

  const categoryProgress =
    categoryTotal > 0
      ? Math.round((categoryLearned / categoryTotal) * 100)
      : 0;

  /* =========================================================
     CHANGE CATEGORY
  ========================================================= */
  const handleCategoryChange = (category: NumberCategory) => {
    setSelectedCategory(category);
    setSearch("");
    setCurrentPage(1);
  };

  /* =========================================================
     SEARCH
  ========================================================= */
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearch("");
    setCurrentPage(1);
  };

  /* =========================================================
     PAGINATION FUNCTIONS
  ========================================================= */
  const goToPreviousPage = () => {
    setCurrentPage((page) => Math.max(1, page - 1));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const goToNextPage = () => {
    setCurrentPage((page) => Math.min(totalPages, page + 1));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================================================
     LEARNED
  ========================================================= */
  const toggleLearned = (id: number) => {
    setLearnedIds((current) => {
      const next = current.includes(id)
        ? current.filter((itemId) => itemId !== id)
        : [...current, id];

      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));

      return next;
    });
  };

  return (
    <div className="min-h-screen px-4 py-5 pb-24 sm:px-6 sm:py-7 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* =====================================================
            HEADER
        ===================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-600 dark:bg-pink-500/10 dark:text-pink-400">
                <Hash className="h-3.5 w-3.5" />
                Japanese Numbers
              </div>

              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                Numbers & Time
              </h1>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
                Learn Japanese numbers, time, days, dates, months and money.
              </p>
            </div>

            {/* Overall Progress */}
            <div className="w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:w-72">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Overall Progress
                </span>

                <span className="text-sm font-bold text-pink-500">
                  {overallProgress}%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${overallProgress}%` }}
                  transition={{ duration: 0.7 }}
                  className="h-full rounded-full bg-pink-500"
                />
              </div>

              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                {overallLearned} / {allNumberData.length} learned
              </p>
            </div>
          </div>
        </motion.div>

        {/* =====================================================
            CATEGORY NAVIGATION
            Mobile 2 columns
            Tablet 3 columns
            Desktop 6 columns
        ===================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-6">
            {categories.map((category) => {
              const Icon = category.icon;

              const active = selectedCategory === category.value;

              const total = allNumberData.filter(
                (item) => item.category === category.value,
              ).length;

              const learned = allNumberData.filter(
                (item) =>
                  item.category === category.value &&
                  learnedIds.includes(item.id),
              ).length;

              return (
                <button
                  key={category.value}
                  type="button"
                  onClick={() => handleCategoryChange(category.value)}
                  className={`group flex min-h-[64px] items-center justify-between rounded-2xl border px-3 py-3 text-left transition-all duration-200 sm:min-h-[70px] sm:px-4 ${
                    active
                      ? "border-pink-500 bg-pink-500 text-white shadow-lg shadow-pink-500/20"
                      : "border-slate-200 bg-white text-slate-600 hover:border-pink-300 hover:text-pink-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-pink-500/50"
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                        active
                          ? "bg-white/15"
                          : "bg-slate-100 dark:bg-slate-800"
                      }`}
                    >
                      <Icon
                        className={`h-4.5 w-4.5 ${
                          active
                            ? "text-white"
                            : "text-slate-500 dark:text-slate-400"
                        }`}
                      />
                    </div>

                    <span className="truncate text-sm font-semibold">
                      {category.label}
                    </span>
                  </div>

                  <span
                    className={`ml-2 shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${
                      active
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                  >
                    {learned}/{total}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* =====================================================
            STATS
        ===================================================== */}
        <div className="mb-5 grid grid-cols-3 gap-2 sm:gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-4">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Category
            </p>

            <p className="mt-1 text-xl font-bold sm:text-2xl">
              {categoryTotal}
            </p>

            <p className="mt-0.5 text-[10px] text-slate-400 sm:text-xs">
              items
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-4">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Learned
            </p>

            <p className="mt-1 text-xl font-bold text-green-500 sm:text-2xl">
              {categoryLearned}
            </p>

            <p className="mt-0.5 text-[10px] text-slate-400 sm:text-xs">
              completed
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-4">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Progress
            </p>

            <p className="mt-1 text-xl font-bold text-pink-500 sm:text-2xl">
              {categoryProgress}%
            </p>

            <p className="mt-0.5 text-[10px] text-slate-400 sm:text-xs">
              category
            </p>
          </div>
        </div>

        {/* =====================================================
            SEARCH
        ===================================================== */}
        <div className="mb-5">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="Search Japanese, romaji or meaning..."
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-11 text-sm outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-500/10 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            />

            {search && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* =====================================================
            PAGE INFO
        ===================================================== */}
        {filteredItems.length > 0 && (
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm">
              Showing{" "}
              <span className="font-bold text-slate-700 dark:text-slate-200">
                {startIndex + 1}-{endIndex}
              </span>{" "}
              of{" "}
              <span className="font-bold text-slate-700 dark:text-slate-200">
                {filteredItems.length}
              </span>{" "}
              items
            </p>

            <p className="text-xs font-semibold text-pink-500 sm:text-sm">
              Page {safeCurrentPage} of {totalPages}
            </p>
          </div>
        )}

        {/* =====================================================
            NUMBER CARDS
            Mobile = 2 columns
        ===================================================== */}
        {currentItems.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {currentItems.map((item, index) => {
                const learned = learnedIds.includes(item.id);

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      duration: 0.2,
                      delay: Math.min(index * 0.02, 0.25),
                    }}
                    className={`group relative overflow-hidden rounded-2xl border bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900 ${
                      learned
                        ? "border-green-300 dark:border-green-500/30"
                        : "border-slate-200 dark:border-slate-800"
                    }`}
                  >
                    {/* Learned Badge */}
                    {learned && (
                      <div className="absolute right-2 top-2 z-10">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white shadow-sm">
                          <Check className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    )}

                    {/* Card */}
                    <button
                      type="button"
                      onClick={() => setSelectedItem(item)}
                      className="block w-full text-left"
                    >
                      <div className="p-3 sm:p-4">
                        <div className="flex min-h-[70px] items-center justify-center rounded-xl bg-slate-50 px-2 dark:bg-slate-800/70 sm:min-h-[90px]">
                          <span className="text-3xl font-bold tracking-wide text-slate-800 dark:text-white sm:text-4xl">
                            {item.japanese}
                          </span>
                        </div>

                        <div className="mt-3 text-center">
                          <p className="truncate text-sm font-semibold text-pink-500 sm:text-base">
                            {item.romaji}
                          </p>

                          <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                            {item.meaning}
                          </p>
                        </div>
                      </div>
                    </button>

                    {/* Actions */}
                    <div className="flex border-t border-slate-100 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => speak(item.japanese)}
                        className="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-slate-500 transition hover:bg-slate-50 hover:text-pink-500 dark:hover:bg-slate-800"
                      >
                        <Volume2 className="h-4 w-4" />
                        <span>Listen</span>
                      </button>

                      <div className="w-px bg-slate-100 dark:bg-slate-800" />

                      <button
                        type="button"
                        onClick={() => toggleLearned(item.id)}
                        className={`flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition ${
                          learned
                            ? "text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10"
                            : "text-slate-500 hover:bg-slate-50 hover:text-pink-500 dark:hover:bg-slate-800"
                        }`}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        <span>{learned ? "Learned" : "Mark"}</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          /* Empty State */
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center dark:border-slate-700 dark:bg-slate-900">
            <Search className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-600" />

            <h3 className="mt-3 font-semibold">No results found</h3>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Try another Japanese word, romaji or meaning.
            </p>

            {search && (
              <button
                type="button"
                onClick={clearSearch}
                className="mt-4 rounded-xl bg-pink-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-pink-600"
              >
                Clear Search
              </button>
            )}
          </div>
        )}

        {/* =====================================================
            PAGINATION
        ===================================================== */}
        {filteredItems.length > ITEMS_PER_PAGE && (
          <div className="mt-7 flex items-center justify-center">
            <div className="flex w-full max-w-md items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              {/* Previous */}
              <button
                type="button"
                onClick={goToPreviousPage}
                disabled={safeCurrentPage === 1}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                  safeCurrentPage === 1
                    ? "cursor-not-allowed text-slate-300 dark:text-slate-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-pink-500 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                <ArrowLeft className="h-4 w-4" />

                <span>Previous</span>
              </button>

              {/* Page */}
              <div className="flex shrink-0 flex-col items-center px-2">
                <span className="text-sm font-bold text-pink-500">
                  {safeCurrentPage}
                </span>

                <span className="text-[10px] text-slate-400">
                  of {totalPages}
                </span>
              </div>

              {/* Next */}
              <button
                type="button"
                onClick={goToNextPage}
                disabled={safeCurrentPage === totalPages}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                  safeCurrentPage === totalPages
                    ? "cursor-not-allowed text-slate-300 dark:text-slate-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-pink-500 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                <span>Next</span>

                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Bottom page info */}
        {filteredItems.length > ITEMS_PER_PAGE && (
          <p className="mt-3 text-center text-xs text-slate-400">
            {ITEMS_PER_PAGE} items per page
          </p>
        )}
      </div>

      {/* =======================================================
          DETAIL MODAL
      ======================================================= */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setSelectedItem(null);
              }
            }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white shadow-2xl dark:bg-slate-900"
            >
              {/* Close */}
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-xl bg-white/90 text-slate-500 shadow-sm transition hover:text-pink-500 dark:bg-slate-800/90"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Modal Hero */}
              <div className="bg-slate-50 px-6 py-10 text-center dark:bg-slate-800">
                <p className="text-6xl font-bold text-slate-800 dark:text-white">
                  {selectedItem.japanese}
                </p>

                <p className="mt-3 text-lg font-semibold text-pink-500">
                  {selectedItem.romaji}
                </p>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {selectedItem.meaning}
                </p>
              </div>

              <div className="p-5 sm:p-6">
                {/* Info */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Category
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {selectedItem.category}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Value
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {selectedItem.value ?? "—"}
                    </p>
                  </div>
                </div>

                {/* Listen */}
                <button
                  type="button"
                  onClick={() => speak(selectedItem.japanese)}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-pink-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-pink-600 active:scale-[0.98]"
                >
                  <Volume2 className="h-4 w-4" />
                  Listen Pronunciation
                </button>

                {/* Learned */}
                <button
                  type="button"
                  onClick={() => toggleLearned(selectedItem.id)}
                  className={`mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                    learnedIds.includes(selectedItem.id)
                      ? "border-green-300 bg-green-50 text-green-600 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-400"
                      : "border-slate-200 bg-white text-slate-600 hover:border-pink-300 hover:text-pink-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4" />

                  {learnedIds.includes(selectedItem.id)
                    ? "Learned"
                    : "Mark as Learned"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Numbers;