import { useCallback, useEffect, useState } from "react";
import {
  BookOpen,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Star,
  X,
  Check,
  GraduationCap,
  Volume2,
  CircleCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import {
  getKanjiByLevel,
  getKanjiDetails,
  type Kanji as KanjiType,
} from "@/services/kanjiApi";

import { useLearning } from "@/context/LearningContext";

const levels = ["N5", "N4", "N3", "N2", "N1"];

const ITEMS_PER_PAGE = 12;

const FAVORITES_KEY = "yomiko-favorites";
const LEARNED_KEY = "yomiko-learned";

function speakJapanese(text: string) {
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ja-JP";
  utterance.rate = 0.8;
  utterance.pitch = 1;

  window.speechSynthesis.speak(utterance);
}

function readStorageArray(key: string): string[] {
  try {
    const saved = JSON.parse(
      localStorage.getItem(key) || "[]",
    );

    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function Kanji() {
  const {
    jlptLevel,
    addKanjiLearned,
    removeKanjiLearned,
  } = useLearning();

  const [selectedLevel, setSelectedLevel] =
    useState(jlptLevel);

  const [kanjiList, setKanjiList] =
    useState<string[]>([]);

  const [kanjiDetails, setKanjiDetails] =
    useState<KanjiType[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [detailsLoading, setDetailsLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [selectedKanji, setSelectedKanji] =
    useState<KanjiType | null>(null);

  const [favorites, setFavorites] =
    useState<string[]>(() =>
      readStorageArray(FAVORITES_KEY),
    );

  const [learned, setLearned] =
    useState<string[]>(() =>
      readStorageArray(LEARNED_KEY),
    );

  /* =====================================================
     SYNC JLPT LEVEL
  ===================================================== */

  useEffect(() => {
    setSelectedLevel(jlptLevel);
  }, [jlptLevel]);

  /* =====================================================
     FETCH KANJI
  ===================================================== */

  const fetchKanji = useCallback(async () => {
    setLoading(true);
    setError("");
    setPage(1);
    setKanjiList([]);
    setKanjiDetails([]);

    try {
      const data =
        await getKanjiByLevel(selectedLevel);

      setKanjiList(data);
    } catch (err) {
      console.error(
        "Kanji list error:",
        err,
      );

      setKanjiList([]);
      setKanjiDetails([]);

      setError(
        "Failed to load Kanji. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [selectedLevel]);

  useEffect(() => {
    fetchKanji();
  }, [fetchKanji]);

  /* =====================================================
     PAGINATION
  ===================================================== */

  const totalPages = Math.ceil(
    kanjiList.length / ITEMS_PER_PAGE,
  );

  const startIndex =
    (page - 1) * ITEMS_PER_PAGE;

  const currentKanji =
    kanjiList.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE,
    );

  /* =====================================================
     FETCH CURRENT PAGE DETAILS
  ===================================================== */

  useEffect(() => {
    if (currentKanji.length === 0) {
      setKanjiDetails([]);
      return;
    }

    let cancelled = false;

    const loadDetails = async () => {
      setDetailsLoading(true);
      setKanjiDetails([]);

      try {
        const results =
          await Promise.allSettled(
            currentKanji.map((character) =>
              getKanjiDetails(character),
            ),
          );

        if (cancelled) return;

        const successful = results
          .filter(
            (
              result,
            ): result is PromiseFulfilledResult<KanjiType> =>
              result.status === "fulfilled",
          )
          .map((result) => result.value);

        setKanjiDetails(successful);
      } catch (err) {
        if (!cancelled) {
          console.error(
            "Kanji details error:",
            err,
          );

          setKanjiDetails([]);
        }
      } finally {
        if (!cancelled) {
          setDetailsLoading(false);
        }
      }
    };

    loadDetails();

    return () => {
      cancelled = true;
    };
  }, [page, kanjiList]);

  /* =====================================================
     FAVORITE
  ===================================================== */

  const toggleFavorite = (kanji: string) => {
    setFavorites((current) => {
      const isFavorite =
        current.includes(kanji);

      const updated = isFavorite
        ? current.filter(
            (item) => item !== kanji,
          )
        : [...current, kanji];

      localStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(updated),
      );

      return updated;
    });
  };

  /* =====================================================
     LEARNED
  ===================================================== */

  const toggleLearned = (kanji: string) => {
    setLearned((current) => {
      const isLearned =
        current.includes(kanji);

      const updated = isLearned
        ? current.filter(
            (item) => item !== kanji,
          )
        : [...current, kanji];

      localStorage.setItem(
        LEARNED_KEY,
        JSON.stringify(updated),
      );

      if (isLearned) {
        removeKanjiLearned();
      } else {
        addKanjiLearned();
      }

      return updated;
    });
  };

  /* =====================================================
     PAGINATION
  ===================================================== */

  const handlePrevious = () => {
    if (page <= 1) return;

    setPage((current) => current - 1);

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  const handleNext = () => {
    if (page >= totalPages) return;

    setPage((current) => current + 1);

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  /* =====================================================
     PROGRESS
  ===================================================== */

  const levelLearned =
    kanjiList.filter((kanji) =>
      learned.includes(kanji),
    ).length;

  const levelProgress =
    kanjiList.length > 0
      ? Math.round(
          (levelLearned /
            kanjiList.length) *
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

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-pink-100 text-pink-500 dark:bg-pink-500/10 dark:text-pink-400 sm:h-14 sm:w-14">
              <BookOpen
                size={26}
                className="sm:hidden"
              />

              <BookOpen
                size={30}
                className="hidden sm:block"
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                Kanji
              </h1>

              <p className="mt-1 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
                Learn Japanese Kanji by JLPT level
              </p>
            </div>

          </div>
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
            delay: 0.08,
          }}
          className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:mb-8 sm:p-5 dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="mb-4">
            <h2 className="font-bold text-slate-900 dark:text-white">
              Select JLPT Level
            </h2>

            <p className="mt-1 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
              Choose your Japanese level
            </p>
          </div>

          <div className="grid grid-cols-5 gap-2 sm:flex sm:gap-3">
            {levels.map((level) => (
              <button
                key={level}
                type="button"
                onClick={() =>
                  setSelectedLevel(level)
                }
                className={`rounded-xl px-2 py-3 text-xs font-bold transition-all sm:px-5 sm:text-sm ${
                  selectedLevel === level
                    ? "bg-pink-500 text-white shadow-lg shadow-pink-200 dark:shadow-none"
                    : "border border-slate-200 bg-slate-50 text-slate-700 hover:border-pink-300 hover:bg-pink-50 hover:text-pink-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-pink-500"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </motion.section>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading && <KanjiSkeleton />}

        {/* =================================================
            ERROR
        ================================================= */}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center sm:p-8 dark:border-red-500/20 dark:bg-red-500/5">

            <p className="font-semibold text-red-600 dark:text-red-400">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchKanji}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
            >
              <RefreshCw size={17} />
              Try Again
            </button>

          </div>
        )}

        {/* =================================================
            CONTENT
        ================================================= */}

        {!loading && !error && (
          <>
            {/* INFO */}

            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              className="mb-5 rounded-2xl border border-pink-100 bg-pink-50 p-4 sm:mb-6 sm:p-5 dark:border-pink-500/20 dark:bg-pink-500/5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <p className="font-bold text-pink-700 dark:text-pink-400">
                    {selectedLevel} Kanji
                  </p>

                  <p className="mt-1 text-xs text-pink-600 sm:text-sm dark:text-pink-400/80">
                    {kanjiList.length} Kanji available
                  </p>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">

                  <div className="flex-1 rounded-full bg-white px-3 py-2 text-center text-xs font-semibold text-pink-600 shadow-sm sm:flex-none sm:px-4 sm:text-sm dark:bg-slate-900 dark:text-pink-400">
                    {levelLearned} / {kanjiList.length} learned
                  </div>

                  <div className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-pink-600 shadow-sm sm:px-4 sm:text-sm dark:bg-slate-900 dark:text-pink-400">
                    {levelProgress}%
                  </div>

                </div>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-pink-100 dark:bg-pink-500/10">
                <motion.div
                  initial={{
                    width: 0,
                  }}
                  animate={{
                    width: `${levelProgress}%`,
                  }}
                  transition={{
                    duration: 0.6,
                  }}
                  className="h-full rounded-full bg-pink-500"
                />
              </div>
            </motion.div>

            {/* =================================================
                KANJI CARDS
            ================================================= */}

            {detailsLoading ? (
              <KanjiSkeleton />
            ) : kanjiDetails.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">

                {kanjiDetails.map(
                  (item, index) => (
                    <KanjiCard
                      key={item.kanji}
                      kanji={item}
                      index={index}
                      isFavorite={favorites.includes(
                        item.kanji,
                      )}
                      isLearned={learned.includes(
                        item.kanji,
                      )}
                      onClick={() =>
                        setSelectedKanji(item)
                      }
                      onFavorite={() =>
                        toggleFavorite(
                          item.kanji,
                        )
                      }
                      onLearned={() =>
                        toggleLearned(
                          item.kanji,
                        )
                      }
                      onSpeak={() =>
                        speakJapanese(
                          item.kanji,
                        )
                      }
                    />
                  ),
                )}

              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
                <p className="font-semibold text-slate-700 dark:text-slate-300">
                  No Kanji found.
                </p>
              </div>
            )}

            {/* =================================================
                PAGINATION
            ================================================= */}

            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2 sm:gap-3">

                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={page === 1}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 transition hover:border-pink-300 hover:text-pink-500 disabled:cursor-not-allowed disabled:opacity-40 sm:gap-2 sm:px-4 sm:py-3 sm:text-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                >
                  <ChevronLeft size={17} />
                  <span>Previous</span>
                </button>

                <div className="rounded-xl bg-pink-500 px-4 py-2.5 text-xs font-bold text-white sm:px-5 sm:py-3 sm:text-sm">
                  {page} / {totalPages}
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={
                    page === totalPages
                  }
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 transition hover:border-pink-300 hover:text-pink-500 disabled:cursor-not-allowed disabled:opacity-40 sm:gap-2 sm:px-4 sm:py-3 sm:text-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                >
                  <span>Next</span>
                  <ChevronRight size={17} />
                </button>

              </div>
            )}
          </>
        )}
      </div>

      {/* =====================================================
          DETAIL MODAL
      ===================================================== */}

      <AnimatePresence>
        {selectedKanji && (
          <KanjiDetailModal
            kanji={selectedKanji}
            isFavorite={favorites.includes(
              selectedKanji.kanji,
            )}
            isLearned={learned.includes(
              selectedKanji.kanji,
            )}
            onClose={() =>
              setSelectedKanji(null)
            }
            onFavorite={() =>
              toggleFavorite(
                selectedKanji.kanji,
              )
            }
            onLearned={() =>
              toggleLearned(
                selectedKanji.kanji,
              )
            }
            onSpeak={() =>
              speakJapanese(
                selectedKanji.kanji,
              )
            }
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* =====================================================
   SKELETON
===================================================== */

function KanjiSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 12 }).map(
        (_, index) => (
          <div
            key={index}
            className="h-[360px] animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
          />
        ),
      )}
    </div>
  );
}

/* =====================================================
   KANJI CARD
===================================================== */

function KanjiCard({
  kanji,
  index,
  isFavorite,
  isLearned,
  onClick,
  onFavorite,
  onLearned,
  onSpeak,
}: {
  kanji: KanjiType;
  index: number;
  isFavorite: boolean;
  isLearned: boolean;
  onClick: () => void;
  onFavorite: () => void;
  onLearned: () => void;
  onSpeak: () => void;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 16,
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
      className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
    >

      {/* =================================================
          ACTION BUTTONS
      ================================================= */}

      <div className="absolute right-2 top-2 z-20 flex gap-1.5 sm:right-3 sm:top-3 sm:gap-2">

        <button
          type="button"
          onClick={onSpeak}
          aria-label={`Pronounce ${kanji.kanji}`}
          className="rounded-full bg-white/90 p-1.5 text-pink-500 shadow-sm backdrop-blur transition hover:bg-pink-50 sm:p-2 dark:bg-slate-900/90 dark:hover:bg-slate-800"
          title="Pronounce"
        >
          <Volume2
            size={15}
            className="sm:h-[17px] sm:w-[17px]"
          />
        </button>

        <button
          type="button"
          onClick={onFavorite}
          aria-label={
            isFavorite
              ? "Remove favorite"
              : "Add favorite"
          }
          className="rounded-full bg-white/90 p-1.5 shadow-sm backdrop-blur transition hover:bg-slate-50 sm:p-2 dark:bg-slate-900/90 dark:hover:bg-slate-800"
          title={
            isFavorite
              ? "Remove favorite"
              : "Favorite"
          }
        >
          <Star
            size={15}
            className={`sm:h-[17px] sm:w-[17px] ${
              isFavorite
                ? "fill-yellow-400 text-yellow-400"
                : "text-slate-400"
            }`}
          />
        </button>

      </div>

      {/* =================================================
          CLICKABLE KANJI CONTENT
      ================================================= */}

      <button
        type="button"
        onClick={onClick}
        className="block w-full text-left"
      >
        {/* KANJI AREA */}

        <div className="relative flex h-32 items-center justify-center bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 sm:h-40 dark:from-pink-500/10 dark:via-rose-500/5 dark:to-pink-500/10">

          <span className="text-5xl font-bold text-slate-800 transition-transform duration-300 group-hover:scale-110 sm:text-7xl dark:text-white">
            {kanji.kanji}
          </span>

          {/* JLPT */}

          <span className="absolute bottom-2 left-2 rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-pink-500 shadow-sm sm:bottom-3 sm:left-3 sm:px-3 sm:text-[11px] dark:bg-slate-900">
            N{kanji.jlpt ?? "?"}
          </span>

          {/* LEARNED BADGE */}

          {isLearned && (
            <span className="absolute bottom-2 right-2 flex items-center gap-0.5 rounded-full bg-green-500 px-1.5 py-1 text-[9px] font-bold text-white sm:bottom-3 sm:right-3 sm:gap-1 sm:px-2 sm:text-[11px]">
              <CircleCheck
                size={11}
                className="sm:h-[13px] sm:w-[13px]"
              />

              <span className="hidden min-[400px]:inline">
                Learned
              </span>
            </span>
          )}

        </div>

        {/* DETAILS */}

        <div className="p-3 sm:p-5">

          <p className="mb-1 text-[9px] font-bold uppercase tracking-wider text-slate-400 sm:text-[10px]">
            Meaning
          </p>

          <p className="line-clamp-2 min-h-[34px] text-xs font-semibold leading-5 text-slate-900 sm:min-h-[40px] sm:text-sm dark:text-white">
            {kanji.meanings.length > 0
              ? kanji.meanings
                  .slice(0, 3)
                  .join(", ")
              : "No meaning available"}
          </p>

          {/* ON / KUN */}

          <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-4 sm:gap-2.5">

            <ReadingBox
              title="ON"
              value={
                kanji.on_readings.length > 0
                  ? kanji.on_readings
                      .slice(0, 2)
                      .join(", ")
                  : "—"
              }
            />

            <ReadingBox
              title="KUN"
              value={
                kanji.kun_readings.length > 0
                  ? kanji.kun_readings
                      .slice(0, 2)
                      .join(", ")
                  : "—"
              }
            />

          </div>

          {/* STROKES */}

          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 sm:mt-4 sm:pt-4 dark:border-slate-800">

            <span className="text-[10px] text-slate-500 sm:text-xs">
              Strokes
            </span>

            <span className="text-xs font-bold text-slate-900 sm:text-sm dark:text-white">
              {kanji.stroke_count}
            </span>

          </div>

        </div>
      </button>

      {/* =================================================
          MARK AS LEARNED BUTTON
      ================================================= */}

      <div className="px-3 pb-3 sm:px-5 sm:pb-5">

        <button
          type="button"
          onClick={onLearned}
          className={`flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold transition-all sm:py-3 sm:text-sm ${
            isLearned
              ? "bg-green-500 text-white shadow-sm hover:bg-green-600"
              : "bg-pink-500 text-white shadow-sm hover:bg-pink-600 hover:shadow-md"
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
    </motion.div>
  );
}

/* =====================================================
   READING BOX
===================================================== */

function ReadingBox({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-xl bg-slate-50 p-2.5 sm:p-3 dark:bg-slate-800">

      <p className="mb-1 text-[9px] font-bold text-slate-400 sm:text-[10px]">
        {title}
      </p>

      <p className="truncate text-[11px] text-slate-700 sm:text-sm dark:text-slate-200">
        {value}
      </p>

    </div>
  );
}

/* =====================================================
   DETAIL MODAL
===================================================== */

function KanjiDetailModal({
  kanji,
  isFavorite,
  isLearned,
  onClose,
  onFavorite,
  onLearned,
  onSpeak,
}: {
  kanji: KanjiType;
  isFavorite: boolean;
  isLearned: boolean;
  onClose: () => void;
  onFavorite: () => void;
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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-4"
      onClick={onClose}
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
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white shadow-2xl dark:bg-slate-900"
      >

        {/* HEADER */}

        <div className="relative flex h-48 items-center justify-center bg-gradient-to-br from-pink-500 via-pink-400 to-rose-300 sm:h-56">

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 rounded-full bg-white/20 p-2 text-white backdrop-blur transition hover:bg-white/30 sm:right-4 sm:top-4"
          >
            <X size={21} />
          </button>

          <button
            type="button"
            onClick={onFavorite}
            aria-label={
              isFavorite
                ? "Remove favorite"
                : "Add favorite"
            }
            className="absolute left-3 top-3 rounded-full bg-white/20 p-2.5 text-white backdrop-blur transition hover:bg-white/30 sm:left-4 sm:top-4 sm:p-3"
          >
            <Star
              size={20}
              className={
                isFavorite
                  ? "fill-yellow-300 text-yellow-300"
                  : ""
              }
            />
          </button>

          <div className="text-center text-white">

            <p className="mb-1 text-xs font-medium opacity-80 sm:mb-2 sm:text-sm">
              JLPT N{kanji.jlpt ?? "?"}
            </p>

            <h2 className="text-8xl font-bold leading-none sm:text-9xl">
              {kanji.kanji}
            </h2>

          </div>
        </div>

        {/* BODY */}

        <div className="p-4 sm:p-6">

          {/* PRONUNCIATION */}

          <button
            type="button"
            onClick={onSpeak}
            className="mb-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-pink-200 bg-pink-50 px-5 py-3 text-sm font-semibold text-pink-600 transition hover:bg-pink-100 sm:mb-6 sm:py-3.5 dark:border-pink-500/20 dark:bg-pink-500/10 dark:text-pink-400"
          >
            <Volume2 size={19} />
            Listen to Pronunciation
          </button>

          {/* MEANING */}

          <div className="mb-5 sm:mb-6">

            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Meaning
            </p>

            <div className="flex flex-wrap gap-2">

              {kanji.meanings.length > 0 ? (
                kanji.meanings.map(
                  (meaning) => (
                    <span
                      key={meaning}
                      className="rounded-full bg-pink-50 px-3 py-2 text-xs font-semibold text-pink-600 sm:text-sm dark:bg-pink-500/10 dark:text-pink-400"
                    >
                      {meaning}
                    </span>
                  ),
                )
              ) : (
                <span className="text-sm text-slate-500">
                  No meaning available
                </span>
              )}

            </div>
          </div>

          {/* READINGS */}

          <div className="mb-5 grid gap-3 sm:mb-6 sm:grid-cols-2 sm:gap-4">

            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">

              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                ON Reading
              </p>

              <p className="break-words text-base font-semibold text-slate-900 sm:text-lg dark:text-white">
                {kanji.on_readings.length > 0
                  ? kanji.on_readings.join(", ")
                  : "No ON reading"}
              </p>

            </div>

            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">

              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                KUN Reading
              </p>

              <p className="break-words text-base font-semibold text-slate-900 sm:text-lg dark:text-white">
                {kanji.kun_readings.length > 0
                  ? kanji.kun_readings.join(", ")
                  : "No KUN reading"}
              </p>

            </div>

          </div>

          {/* STATS */}

          <div className="mb-5 grid grid-cols-3 gap-2.5 sm:mb-6 sm:gap-3">

            <InfoBox
              title="Strokes"
              value={String(
                kanji.stroke_count,
              )}
            />

            <InfoBox
              title="Grade"
              value={
                kanji.grade
                  ? String(
                      kanji.grade,
                    )
                  : "—"
              }
            />

            <InfoBox
              title="JLPT"
              value={`N${
                kanji.jlpt ?? "?"
              }`}
            />

          </div>

          {/* LEARNED */}

          <button
            type="button"
            onClick={onLearned}
            className={`flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-bold transition sm:py-4 ${
              isLearned
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-pink-500 text-white hover:bg-pink-600"
            }`}
          >
            {isLearned ? (
              <>
                <Check size={20} />
                Learned
              </>
            ) : (
              <>
                <GraduationCap size={20} />
                Mark as Learned
              </>
            )}
          </button>

          {/* EXAMPLES */}

          <div className="mt-4 rounded-2xl border border-dashed border-slate-300 p-4 dark:border-slate-700">

            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Example Words
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
              Example vocabulary will be added with the vocabulary API.
            </p>

          </div>

        </div>
      </motion.div>
    </motion.div>
  );
}

/* =====================================================
   INFO BOX
===================================================== */

function InfoBox({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3 text-center sm:p-4 dark:bg-slate-800">

      <p className="text-[10px] font-medium text-slate-400 sm:text-xs">
        {title}
      </p>

      <p className="mt-1 text-base font-bold text-slate-900 sm:text-lg dark:text-white">
        {value}
      </p>

    </div>
  );
}

export default Kanji;