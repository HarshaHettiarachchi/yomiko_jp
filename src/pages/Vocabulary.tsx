import { useEffect, useMemo, useState } from "react";
import {
  Volume2,
  Search,
  Star,
  BookOpen,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  X,
  Sun,
  Moon,
  CircleHelp,
  Coffee,
  Utensils,
  Train,
  Car,
  School,
  GraduationCap,
  User,
  Users,
  Home,
  Dog,
  Cat,
  Bird,
  Fish,
  Droplets,
  Apple,
  Flower2,
  Mountain,
  Waves,
  CloudRain,
  Snowflake,
  CloudSun,
  Store,
  Wallet,
  Clock,
  Smartphone,
  Camera,
  Music,
  Film,
  Lightbulb,
  HeartPulse,
  Mail,
  CookingPot,
  Shirt,
  ShoppingBag,
  MapPin,
  CalendarDays,
  Bed,
  Briefcase,
  Plane,
  Bike,
  Footprints,
  type LucideIcon,
} from "lucide-react";

import { motion, AnimatePresence } from "motion/react";

import {
  getVocabularyByLevel,
  type Vocabulary as VocabularyType,
} from "@/services/vocabularyApi";

const levels = ["N5", "N4", "N3", "N2", "N1"];

const ITEMS_PER_PAGE = 12;

const FAVORITES_KEY = "yomiko-vocabulary-favorites";

/* =====================================================
   VOCABULARY ICON MAP
===================================================== */

const iconMap: Record<string, LucideIcon> = {
  毎朝: Sun,
  朝: Sun,
  昼: CloudSun,
  夜: Moon,

  問題: CircleHelp,

  お茶: Coffee,
  茶: Coffee,

  黒: CircleHelp,
  白: CircleHelp,
  赤: HeartPulse,
  青: Waves,

  台所: CookingPot,
  葉書: Mail,

  電気: Lightbulb,
  病気: HeartPulse,

  学校: School,
  学生: GraduationCap,
  先生: GraduationCap,

  本: BookOpen,

  車: Car,
  電車: Train,
  駅: MapPin,

  家: Home,

  犬: Dog,
  猫: Cat,
  鳥: Bird,
  魚: Fish,

  水: Droplets,

  食べる: Utensils,
  飲む: Coffee,
  ご飯: Utensils,
  野菜: Apple,
  果物: Apple,

  花: Flower2,
  山: Mountain,
  海: Waves,

  雨: CloudRain,
  雪: Snowflake,
  天気: CloudSun,

  人: User,
  男: User,
  女: User,
  子供: User,
  友達: Users,
  家族: Users,

  店: Store,
  お金: Wallet,
  時計: Clock,
  電話: Smartphone,

  写真: Camera,
  音楽: Music,
  映画: Film,

  料理: CookingPot,
  服: Shirt,
  買い物: ShoppingBag,

  仕事: Briefcase,
  会社: Briefcase,

  飛行機: Plane,
  自転車: Bike,
  歩く: Footprints,

  今日: CalendarDays,
  明日: CalendarDays,
  昨日: CalendarDays,

  寝る: Bed,
};

/* =====================================================
   ICON SELECTOR
===================================================== */

function getVocabularyIcon(
  word: string,
  meanings: string[],
): LucideIcon {
  if (iconMap[word]) {
    return iconMap[word];
  }

  const meaning = meanings.join(" ").toLowerCase();

  if (
    meaning.includes("morning") ||
    meaning.includes("sun")
  ) {
    return Sun;
  }

  if (
    meaning.includes("tea") ||
    meaning.includes("drink")
  ) {
    return Coffee;
  }

  if (
    meaning.includes("food") ||
    meaning.includes("eat")
  ) {
    return Utensils;
  }

  if (
    meaning.includes("school") ||
    meaning.includes("student") ||
    meaning.includes("teacher")
  ) {
    return School;
  }

  if (
    meaning.includes("train") ||
    meaning.includes("station")
  ) {
    return Train;
  }

  if (meaning.includes("car")) {
    return Car;
  }

  if (
    meaning.includes("house") ||
    meaning.includes("home")
  ) {
    return Home;
  }

  if (meaning.includes("dog")) {
    return Dog;
  }

  if (meaning.includes("cat")) {
    return Cat;
  }

  if (meaning.includes("fish")) {
    return Fish;
  }

  if (meaning.includes("flower")) {
    return Flower2;
  }

  if (meaning.includes("mountain")) {
    return Mountain;
  }

  if (
    meaning.includes("sea") ||
    meaning.includes("ocean")
  ) {
    return Waves;
  }

  if (meaning.includes("rain")) {
    return CloudRain;
  }

  if (meaning.includes("snow")) {
    return Snowflake;
  }

  if (meaning.includes("money")) {
    return Wallet;
  }

  if (meaning.includes("phone")) {
    return Smartphone;
  }

  if (meaning.includes("book")) {
    return BookOpen;
  }

  if (meaning.includes("music")) {
    return Music;
  }

  if (
    meaning.includes("movie") ||
    meaning.includes("film")
  ) {
    return Film;
  }

  return CircleHelp;
}

/* =====================================================
   MAIN COMPONENT
===================================================== */

function Vocabulary() {
  const [selectedLevel, setSelectedLevel] =
    useState("N5");

  const [vocabulary, setVocabulary] =
    useState<VocabularyType[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [selectedWord, setSelectedWord] =
    useState<VocabularyType | null>(null);

  const [favorites, setFavorites] =
    useState<string[]>(() => {
      try {
        const saved = JSON.parse(
          localStorage.getItem(
            FAVORITES_KEY,
          ) || "[]",
        );

        return Array.isArray(saved)
          ? saved
          : [];
      } catch {
        return [];
      }
    });

  /* =====================================================
     LOAD VOCABULARY
  ===================================================== */

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError("");
    setPage(1);
    setSearch("");
    setVocabulary([]);

    getVocabularyByLevel(selectedLevel)
      .then((data) => {
        if (!cancelled) {
          setVocabulary(data);
        }
      })
      .catch((err) => {
        console.error(
          "Vocabulary API Error:",
          err,
        );

        if (!cancelled) {
          setError(
            "Failed to load vocabulary. Please try again.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedLevel]);

  /* =====================================================
     SEARCH
  ===================================================== */

  const filteredVocabulary = useMemo(() => {
    const keyword =
      search.trim().toLowerCase();

    if (!keyword) {
      return vocabulary;
    }

    return vocabulary.filter((item) => {
      const word =
        item.word?.toLowerCase() || "";

      const reading =
        item.reading?.toLowerCase() || "";

      const meaning =
        item.meanings
          .join(" ")
          .toLowerCase();

      return (
        word.includes(keyword) ||
        reading.includes(keyword) ||
        meaning.includes(keyword)
      );
    });
  }, [vocabulary, search]);

  /* =====================================================
     PAGINATION
  ===================================================== */

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredVocabulary.length /
        ITEMS_PER_PAGE,
    ),
  );

  const startIndex =
    (page - 1) * ITEMS_PER_PAGE;

  const currentVocabulary =
    filteredVocabulary.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE,
    );

  useEffect(() => {
    setPage(1);
  }, [search]);

  /* =====================================================
     FAVORITE
  ===================================================== */

  const toggleFavorite = (
    word: string,
  ) => {
    setFavorites((current) => {
      const updated =
        current.includes(word)
          ? current.filter(
              (item) => item !== word,
            )
          : [...current, word];

      localStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(updated),
      );

      return updated;
    });
  };

  /* =====================================================
     SPEECH
  ===================================================== */

  const speakWord = (
    word: string,
  ) => {
    if (
      !("speechSynthesis" in window)
    ) {
      return;
    }

    window.speechSynthesis.cancel();

    const speech =
      new SpeechSynthesisUtterance(word);

    speech.lang = "ja-JP";
    speech.rate = 0.8;
    speech.pitch = 1;

    window.speechSynthesis.speak(
      speech,
    );
  };

  /* =====================================================
     PAGINATION CONTROLS
  ===================================================== */

  const handlePrevious = () => {
    if (page <= 1) return;

    setPage(
      (current) => current - 1,
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleNext = () => {
    if (page >= totalPages) return;

    setPage(
      (current) => current + 1,
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =====================================================
     RETRY
  ===================================================== */

  const handleRetry = () => {
    setVocabulary([]);
    setError("");
    setLoading(true);

    getVocabularyByLevel(selectedLevel)
      .then((data) => {
        setVocabulary(data);
      })
      .catch((err) => {
        console.error(
          "Vocabulary Retry Error:",
          err,
        );

        setError(
          "Failed to load vocabulary. Please try again.",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen px-3 py-5 pb-24 sm:px-6 sm:py-6 md:px-8 md:py-8 md:pb-8">
      <div className="mx-auto max-w-7xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <motion.header
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

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-pink-100 text-pink-500 shadow-sm dark:bg-pink-500/10 dark:text-pink-400 sm:h-14 sm:w-14">
              <BookOpen
                size={26}
                className="sm:hidden"
              />

              <BookOpen
                size={30}
                className="hidden sm:block"
              />
            </div>

            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                Vocabulary
              </h1>

              <p className="mt-1 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
                Build your Japanese vocabulary
              </p>
            </div>

          </div>
        </motion.header>

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
          className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:mb-6 sm:p-5 dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="mb-4">
            <h2 className="font-bold text-slate-900 dark:text-white">
              Select JLPT Level
            </h2>

            <p className="mt-1 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
              Choose your vocabulary level
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
            delay: 0.12,
          }}
          className="mb-5 sm:mb-6"
        >
          <div className="relative">

            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
              placeholder="Search word, reading or meaning..."
              className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-12 pr-12 text-sm text-slate-900 shadow-sm outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100 sm:py-4 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:ring-pink-500/10"
            />

            {search && (
              <button
                type="button"
                onClick={() =>
                  setSearch("")
                }
                aria-label="Clear search"
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-pink-500 dark:hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            )}

          </div>
        </motion.div>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <VocabularySkeleton />
        )}

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
              onClick={handleRetry}
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
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <p className="font-bold text-pink-700 dark:text-pink-400">
                    {selectedLevel} Vocabulary
                  </p>

                  <p className="mt-1 text-xs text-pink-600 sm:text-sm dark:text-pink-400/80">
                    {filteredVocabulary.length}{" "}
                    words found
                  </p>
                </div>

                <div className="flex items-center gap-2">

                  <div className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-pink-600 shadow-sm sm:px-4 sm:text-sm dark:bg-slate-900 dark:text-pink-400">
                    {favorites.filter((word) =>
                      vocabulary.some(
                        (item) =>
                          item.word === word,
                      ),
                    ).length}{" "}
                    favorites
                  </div>

                  <div className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-pink-600 shadow-sm sm:px-4 sm:text-sm dark:bg-slate-900 dark:text-pink-400">
                    {page} / {totalPages}
                  </div>

                </div>
              </div>
            </motion.div>

            {/* =================================================
                NO RESULTS
            ================================================= */}

            {currentVocabulary.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center sm:p-10 dark:border-slate-800 dark:bg-slate-900">

                <Search
                  size={40}
                  className="mx-auto mb-4 text-slate-300"
                />

                <h3 className="font-bold text-slate-900 dark:text-white">
                  No vocabulary found
                </h3>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Try a different search term.
                </p>

              </div>
            )}

            {/* =================================================
                VOCABULARY CARDS
                MOBILE = 2
                TABLET = 2
                DESKTOP = 3
                XL = 4
            ================================================= */}

            {currentVocabulary.length > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">

                {currentVocabulary.map(
                  (item, index) => (
                    <VocabularyCard
                      key={`${item.word}-${index}`}
                      vocabulary={item}
                      index={index}
                      isFavorite={favorites.includes(
                        item.word,
                      )}
                      onFavorite={() =>
                        toggleFavorite(
                          item.word,
                        )
                      }
                      onSpeak={() =>
                        speakWord(
                          item.reading ||
                            item.word,
                        )
                      }
                      onClick={() =>
                        setSelectedWord(item)
                      }
                    />
                  ),
                )}

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

                <div className="rounded-xl bg-pink-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-pink-200 sm:px-5 sm:py-3 sm:text-sm dark:shadow-none">
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
        {selectedWord && (
          <VocabularyDetail
            vocabulary={selectedWord}
            isFavorite={favorites.includes(
              selectedWord.word,
            )}
            onClose={() =>
              setSelectedWord(null)
            }
            onFavorite={() =>
              toggleFavorite(
                selectedWord.word,
              )
            }
            onSpeak={() =>
              speakWord(
                selectedWord.reading ||
                  selectedWord.word,
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

function VocabularySkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({
        length: 12,
      }).map((_, index) => (
        <div
          key={index}
          className="h-[310px] animate-pulse rounded-2xl border border-slate-200 bg-white sm:h-[360px] dark:border-slate-800 dark:bg-slate-900"
        />
      ))}
    </div>
  );
}

/* =====================================================
   VOCABULARY CARD
===================================================== */

function VocabularyCard({
  vocabulary,
  index,
  isFavorite,
  onFavorite,
  onSpeak,
  onClick,
}: {
  vocabulary: VocabularyType;
  index: number;
  isFavorite: boolean;
  onFavorite: () => void;
  onSpeak: () => void;
  onClick: () => void;
}) {
  const Icon = getVocabularyIcon(
    vocabulary.word,
    vocabulary.meanings,
  );

  return (
    <motion.article
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
          ICON HEADER
      ================================================= */}

      <button
        type="button"
        onClick={onClick}
        className="block w-full text-left"
      >
        <div className="relative h-40 overflow-hidden bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-indigo-500/20 sm:h-52 dark:from-pink-500/20 dark:via-purple-500/10 dark:to-indigo-500/20">

          {/* Decorative */}

          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-pink-500/10 blur-3xl sm:h-40 sm:w-40" />

          <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-purple-500/10 blur-3xl sm:h-40 sm:w-40" />

          {/* Icon */}

          <div className="absolute left-1/2 top-[45%] flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border border-pink-300/30 bg-white/10 shadow-xl backdrop-blur-sm transition duration-300 group-hover:scale-110 sm:h-28 sm:w-28 sm:rounded-[28px] dark:bg-slate-950/20">

            <Icon
              size={42}
              strokeWidth={1.6}
              className="text-pink-400 sm:h-[62px] sm:w-[62px]"
            />

          </div>

          {/* Word */}

          <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-5 sm:right-5">

            <h2 className="truncate text-2xl font-bold text-white drop-shadow-lg sm:text-4xl">
              {vocabulary.word}
            </h2>

            <p className="mt-0.5 truncate text-[11px] font-semibold text-pink-300 sm:mt-1 sm:text-sm">
              {vocabulary.reading}
            </p>

          </div>

        </div>

        {/* =================================================
            CARD DETAILS
        ================================================= */}

        <div className="p-3 sm:p-5">

          <p className="mb-1 text-[9px] font-bold uppercase tracking-wider text-slate-400 sm:text-[10px]">
            Meaning
          </p>

          <p className="line-clamp-2 min-h-[32px] text-xs font-semibold leading-5 text-slate-900 sm:min-h-[40px] sm:text-sm dark:text-white">
            {vocabulary.meanings.length > 0
              ? vocabulary.meanings
                  .slice(0, 3)
                  .join(", ")
              : "No meaning available"}
          </p>

          {vocabulary.partsOfSpeech.length >
            0 && (
            <div className="mt-3 flex flex-wrap gap-1.5 sm:mt-4 sm:gap-2">

              {vocabulary.partsOfSpeech
                .slice(0, 2)
                .map((part) => (
                  <span
                    key={part}
                    className="max-w-full truncate rounded-full bg-slate-100 px-2 py-1 text-[9px] font-medium text-slate-500 sm:px-2.5 sm:py-1 sm:text-xs dark:bg-slate-800 dark:text-slate-400"
                  >
                    {part}
                  </span>
                ))}

            </div>
          )}

        </div>
      </button>

      {/* =================================================
          CARD ACTIONS
      ================================================= */}

      <div className="absolute right-2 top-2 z-10 flex gap-1.5 sm:right-3 sm:top-3 sm:gap-2">

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onSpeak();
          }}
          aria-label="Listen"
          title="Listen"
          className="rounded-full bg-slate-950/75 p-1.5 text-white shadow-lg backdrop-blur transition hover:bg-pink-500 sm:p-2.5"
        >
          <Volume2
            size={14}
            className="sm:h-[17px] sm:w-[17px]"
          />
        </button>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onFavorite();
          }}
          aria-label={
            isFavorite
              ? "Remove favorite"
              : "Add favorite"
          }
          title={
            isFavorite
              ? "Remove favorite"
              : "Favorite"
          }
          className="rounded-full bg-slate-950/75 p-1.5 shadow-lg backdrop-blur transition hover:bg-pink-500 sm:p-2.5"
        >
          <Star
            size={14}
            className={`sm:h-[17px] sm:w-[17px] ${
              isFavorite
                ? "fill-yellow-400 text-yellow-400"
                : "text-white"
            }`}
          />
        </button>

      </div>
    </motion.article>
  );
}

/* =====================================================
   DETAIL MODAL
===================================================== */

function VocabularyDetail({
  vocabulary,
  isFavorite,
  onClose,
  onFavorite,
  onSpeak,
}: {
  vocabulary: VocabularyType;
  isFavorite: boolean;
  onClose: () => void;
  onFavorite: () => void;
  onSpeak: () => void;
}) {
  const Icon = getVocabularyIcon(
    vocabulary.word,
    vocabulary.meanings,
  );

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
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white shadow-2xl dark:bg-slate-900"
      >

        {/* =================================================
            MODAL HEADER
        ================================================= */}

        <div className="relative overflow-hidden bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 px-5 py-7 text-center text-white sm:px-8 sm:py-9">

          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

          {/* Close */}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 z-10 rounded-full bg-black/20 p-2 backdrop-blur transition hover:bg-black/30 sm:right-4 sm:top-4"
          >
            <X size={20} />
          </button>

          {/* Favorite */}

          <button
            type="button"
            onClick={onFavorite}
            aria-label={
              isFavorite
                ? "Remove favorite"
                : "Add favorite"
            }
            className="absolute left-3 top-3 z-10 rounded-full bg-black/20 p-2.5 backdrop-blur transition hover:bg-pink-500 sm:left-4 sm:top-4"
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

          {/* Icon */}

          <div className="relative mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-[28px] border border-white/20 bg-white/10 backdrop-blur-sm sm:mb-5 sm:h-28 sm:w-28">

            <Icon
              size={52}
              strokeWidth={1.5}
              className="text-white sm:h-[62px] sm:w-[62px]"
            />

          </div>

          <p className="mb-2 text-xs font-semibold opacity-80 sm:mb-3 sm:text-sm">
            Japanese Vocabulary
          </p>

          <h2 className="break-words text-5xl font-bold sm:text-6xl">
            {vocabulary.word}
          </h2>

          <p className="mt-2 text-base font-medium sm:mt-3 sm:text-xl">
            {vocabulary.reading}
          </p>

        </div>

        {/* =================================================
            MODAL BODY
        ================================================= */}

        <div className="p-4 sm:p-6">

          {/* Listen */}

          <button
            type="button"
            onClick={onSpeak}
            className="mb-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-pink-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-pink-200 transition hover:bg-pink-600 sm:mb-6 sm:py-4 dark:shadow-none"
          >
            <Volume2 size={20} />
            Listen to Pronunciation
          </button>

          {/* Meaning */}

          <div className="mb-5 sm:mb-6">

            <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:text-xs">
              Meaning
            </p>

            <div className="flex flex-wrap gap-2">

              {vocabulary.meanings.length >
              0 ? (
                vocabulary.meanings.map(
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
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  No meaning available
                </span>
              )}

            </div>
          </div>

          {/* Part of Speech */}

          {vocabulary.partsOfSpeech.length >
            0 && (
            <div className="mb-5 sm:mb-6">

              <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:text-xs">
                Part of Speech
              </p>

              <div className="flex flex-wrap gap-2">

                {vocabulary.partsOfSpeech.map(
                  (part) => (
                    <span
                      key={part}
                      className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600 sm:text-sm dark:bg-slate-800 dark:text-slate-300"
                    >
                      {part}
                    </span>
                  ),
                )}

              </div>
            </div>
          )}

          {/* =================================================
              INFO
              IMPORTANT: String() FIX
          ================================================= */}

          <div className="mb-5 grid grid-cols-2 gap-3 sm:mb-6">

            <InfoBox
              title="JLPT Level"
              value={String(
                vocabulary.level ??
                  selectedLevelFallback(
                    vocabulary,
                  ),
              )}
            />

            <InfoBox
              title="Reading"
              value={
                vocabulary.reading ||
                "—"
              }
            />

          </div>

          {/* Example */}

          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-4 dark:border-slate-700 dark:bg-slate-800/30">

            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Example Sentence
            </p>

            <p className="mt-2 text-xs leading-5 text-slate-500 sm:text-sm dark:text-slate-400">
              Example sentences will be added with the next vocabulary API enhancement.
            </p>

          </div>

        </div>
      </motion.div>
    </motion.div>
  );
}

/* =====================================================
   LEVEL FALLBACK
===================================================== */

function selectedLevelFallback(
  vocabulary: VocabularyType,
): string {
  const level =
    vocabulary.level;

  if (
    level !== undefined &&
    level !== null
  ) {
    return String(level);
  }

  return "—";
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
    <div className="min-w-0 rounded-2xl bg-slate-50 p-3 text-center dark:bg-slate-800 sm:p-4">

      <p className="text-[9px] font-medium uppercase tracking-wider text-slate-400 sm:text-xs">
        {title}
      </p>

      <p className="mt-1 truncate text-sm font-bold text-slate-900 sm:text-base dark:text-white">
        {value}
      </p>

    </div>
  );
}

export default Vocabulary;