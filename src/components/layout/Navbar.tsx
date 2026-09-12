import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
} from "react";

import {
  Menu,
  Moon,
  Sun,
  User,
  Settings,
  X,
  BarChart3,
  Sparkles,
  RotateCcw,
  ChevronRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

import logo from "@/assets/JpLogo.png";

/* =========================================================
   PROPS
========================================================= */

interface NavbarProps {
  onMenuClick: () => void;
  darkMode: boolean;
  onThemeToggle: () => void;
}

/* =========================================================
   PROFILE MENU
========================================================= */

const profileItems = [
  {
    label: "Profile",
    description: "Your learner profile",
    icon: User,
    path: "/settings",
  },
  {
    label: "Progress",
    description: "View your learning progress",
    icon: BarChart3,
    path: "/progress",
  },
  {
    label: "Settings",
    description: "Manage your Yomiko settings",
    icon: Settings,
    path: "/settings",
  },
  {
    label: "About Creator",
    description: "Learn about Yomiko",
    icon: Sparkles,
    path: "/about-creator",
  },
];

/* =========================================================
   RESET KEYS
========================================================= */

const RESET_KEYS = [
  "yomiko-learned",
  "yomiko-kana-learned",
  "yomiko-favorites",
  "yomiko-vocabulary-favorites",
  "yomiko-numbers-learned",
  "yomiko-grammar-learned",
  "yomiko-expressions-learned",
  "yomiko-verbs-learned",
  "yomiko-adjectives-learned",

  "yomiko-quiz-score",
  "yomiko-quiz-total",
  "yomiko-quiz-history",
  "yomiko-quiz-attempts",
  "yomiko-quiz-best-score",
  "yomiko-quiz-questions",
  "yomiko-quiz-correct",
  "yomiko-quiz-category-stats",

  "yomiko-listening-completed",
  "yomiko-listening-completed-ids",

  "yomiko-streak",
  "yomiko-xp",

  "yomiko-daily-completed",
  "yomiko-activity-date",
  "yomiko-last-activity",
];

/* =========================================================
   NAVBAR
========================================================= */

function Navbar({
  onMenuClick,
  darkMode,
  onThemeToggle,
}: NavbarProps) {
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  /* =======================================================
     CLOSE PROFILE WHEN CLICKING OUTSIDE
  ======================================================= */

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(
          event.target as Node,
        )
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );
    };
  }, []);

  /* =======================================================
     ESCAPE KEY
  ======================================================= */

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setProfileOpen(false);
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, []);

  /* =======================================================
     HOME
  ======================================================= */

  const handleHome = () => {
    setProfileOpen(false);
    navigate("/");
  };

  /* =======================================================
     MOBILE MENU
     
     IMPORTANT:
     Close profile BEFORE opening sidebar.
     This prevents profile/sidebar overlap.
  ======================================================= */

  const handleMenuClick = () => {
    setProfileOpen(false);
    onMenuClick();
  };

  /* =======================================================
     PROFILE NAVIGATION
  ======================================================= */

  const handleNavigate = (path: string) => {
    setProfileOpen(false);
    navigate(path);
  };

  /* =======================================================
     RESET ALL PROGRESS
  ======================================================= */

  const handleReset = () => {
    const confirmed = window.confirm(
      "Are you sure you want to reset all Yomiko learning progress?",
    );

    if (!confirmed) {
      return;
    }

    RESET_KEYS.forEach((key) => {
      localStorage.removeItem(key);
    });

    setProfileOpen(false);

    window.location.reload();
  };

  return (
    <>
      {/* ===================================================
          HEADER
      =================================================== */}

      <header
        className="
          sticky
          top-0
          z-[100]
          w-full

          border-b
          border-slate-200

          bg-white/95
          backdrop-blur-xl

          dark:border-slate-800
          dark:bg-slate-950/95
        "
      >
        <div
          className="
            flex
            h-[76px]
            items-center
            justify-between

            px-4
            sm:px-5
            md:px-6
            lg:px-8
          "
        >
          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <div className="flex items-center gap-3">
            {/* =================================================
                MOBILE HAMBURGER
            ================================================= */}

            <Button
              variant="ghost"
              size="icon"
              onClick={handleMenuClick}
              aria-label="Open navigation menu"
              className="
                h-10
                w-10
                rounded-xl

                text-slate-600

                hover:bg-pink-50
                hover:text-pink-500

                dark:text-slate-300
                dark:hover:bg-pink-500/10
                dark:hover:text-pink-400

                md:hidden
              "
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* =================================================
                LOGO
            ================================================= */}

            <button
              type="button"
              onClick={handleHome}
              aria-label="Go to Yomiko home"
              className="
                group
                flex
                items-center
                gap-3
                rounded-xl
                outline-none
              "
            >
              <img
                src={logo}
                alt="Yomiko"
                className="
                  h-11
                  w-11
                  rounded-xl
                  object-cover

                  shadow-sm

                  transition
                  duration-200

                  group-hover:scale-105
                "
              />

              <div className="hidden text-left sm:block">
                <p
                  className="
                    text-lg
                    font-bold
                    tracking-tight

                    text-slate-900
                    dark:text-white
                  "
                >
                  Yomiko
                </p>

                <p
                  className="
                    text-[10px]
                    text-slate-400
                    dark:text-slate-500
                  "
                >
                  Read. Learn. Remember.
                </p>
              </div>
            </button>
          </div>

          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          <div className="flex items-center gap-2">
            {/* =================================================
                THEME BUTTON
            ================================================= */}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setProfileOpen(false);
                onThemeToggle();
              }}
              title={
                darkMode
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
              aria-label={
                darkMode
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
              className="
                h-10
                w-10
                rounded-xl

                border
                border-slate-200

                bg-slate-50
                text-slate-600

                transition-all
                duration-200

                hover:border-pink-300
                hover:bg-pink-50
                hover:text-pink-500

                dark:border-slate-700
                dark:bg-slate-900
                dark:text-slate-300

                dark:hover:border-pink-500/40
                dark:hover:bg-pink-500/10
                dark:hover:text-pink-400

                sm:h-11
                sm:w-11
              "
            >
              {darkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* =================================================
                PROFILE
            ================================================= */}

            <div
              ref={profileRef}
              className="relative"
            >
              {/* PROFILE BUTTON */}

              <button
                type="button"
                onClick={() =>
                  setProfileOpen(
                    (value) => !value,
                  )
                }
                aria-label="Open profile menu"
                aria-expanded={profileOpen}
                className={`
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full

                  text-sm
                  font-bold

                  shadow-sm

                  transition-all
                  duration-200

                  focus:outline-none
                  focus:ring-2
                  focus:ring-pink-500/40

                  sm:h-11
                  sm:w-11

                  ${
                    profileOpen
                      ? `
                        bg-pink-500
                        text-white
                        shadow-lg
                        shadow-pink-500/25
                      `
                      : `
                        bg-pink-100
                        text-pink-600

                        hover:scale-105
                        hover:bg-pink-200

                        dark:bg-pink-500/15
                        dark:text-pink-400
                        dark:hover:bg-pink-500/25
                      `
                  }
                `}
              >
                {profileOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  "H"
                )}
              </button>

              {/* =================================================
                  PROFILE DROPDOWN

                  IMPORTANT:
                  It is only a small dropdown.
                  No fixed full-screen panel.
              ================================================= */}

              {profileOpen && (
                <div
                  className="
                    absolute
                    right-0
                    top-[calc(100%+10px)]

                    z-[200]

                    w-[275px]

                    overflow-hidden
                    rounded-2xl

                    border
                    border-slate-200

                    bg-white

                    shadow-xl
                    shadow-slate-900/15

                    dark:border-slate-700
                    dark:bg-slate-900
                    dark:shadow-black/40

                    sm:w-[290px]
                  "
                >
                  <ProfileMenu
                    onNavigate={handleNavigate}
                    onReset={handleReset}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

/* =========================================================
   PROFILE MENU
========================================================= */

function ProfileMenu({
  onNavigate,
  onReset,
}: {
  onNavigate: (path: string) => void;
  onReset: () => void;
}) {
  return (
    <div className="w-full">
      {/* =====================================================
          USER HEADER
      ===================================================== */}

      <div
        className="
          border-b
          border-slate-200

          px-4
          py-3.5

          dark:border-slate-700
        "
      >
        <div className="flex items-center gap-3">
          {/* AVATAR */}

          <div
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center

              rounded-xl

              bg-gradient-to-br
              from-pink-500
              to-purple-600

              text-lg
              font-bold
              text-white

              shadow-md
              shadow-pink-500/20
            "
          >
            H
          </div>

          {/* USER INFO */}

          <div className="min-w-0">
            <p
              className="
                truncate

                text-sm
                font-bold

                text-slate-900
                dark:text-white
              "
            >
              Harsha
            </p>

            <p
              className="
                mt-0.5

                text-xs

                text-slate-500
                dark:text-slate-400
              "
            >
              Yomiko Learner
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          MENU ITEMS
      ===================================================== */}

      <div className="p-2">
        <div className="space-y-0.5">
          {profileItems.map((item) => {
            const Icon = item.icon;

            return (
              <ProfileItem
                key={item.label}
                icon={Icon}
                label={item.label}
                description={item.description}
                onClick={() =>
                  onNavigate(item.path)
                }
              />
            );
          })}
        </div>

        {/* ===================================================
            DIVIDER
        =================================================== */}

        <div
          className="
            my-2
            h-px

            bg-slate-200
            dark:bg-slate-700
          "
        />

        {/* ===================================================
            RESET
        =================================================== */}

        <button
          type="button"
          onClick={onReset}
          className="
            group
            flex
            w-full
            items-center
            gap-3

            rounded-xl

            px-2.5
            py-2.5

            text-left

            transition-colors

            hover:bg-red-50

            dark:hover:bg-red-500/10
          "
        >
          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center

              rounded-lg

              bg-red-50
              text-red-500

              dark:bg-red-500/10
              dark:text-red-400
            "
          >
            <RotateCcw className="h-4 w-4" />
          </div>

          <div className="min-w-0 flex-1">
            <p
              className="
                text-xs
                font-semibold

                text-red-500
                dark:text-red-400
              "
            >
              Reset Progress
            </p>

            <p
              className="
                mt-0.5
                truncate

                text-[10px]

                text-slate-400
              "
            >
              Clear all learning data
            </p>
          </div>

          <ChevronRight
            className="
              h-3.5
              w-3.5
              shrink-0

              text-slate-300

              transition

              group-hover:translate-x-0.5
              group-hover:text-red-400

              dark:text-slate-600
            "
          />
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   PROFILE ITEM
========================================================= */

function ProfileItem({
  icon: Icon,
  label,
  description,
  onClick,
}: {
  icon: ComponentType<{
    className?: string;
  }>;
  label: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group
        flex
        w-full
        items-center
        gap-3

        rounded-xl

        px-2.5
        py-2.5

        text-left

        transition-colors

        hover:bg-slate-100

        dark:hover:bg-slate-800
      "
    >
      {/* ICON */}

      <div
        className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center

          rounded-lg

          bg-slate-100
          text-slate-500

          transition-colors

          group-hover:bg-pink-50
          group-hover:text-pink-500

          dark:bg-slate-800
          dark:text-slate-400

          dark:group-hover:bg-pink-500/10
          dark:group-hover:text-pink-400
        "
      >
        <Icon className="h-4 w-4" />
      </div>

      {/* TEXT */}

      <div className="min-w-0 flex-1">
        <p
          className="
            text-xs
            font-semibold

            text-slate-700

            dark:text-slate-200
          "
        >
          {label}
        </p>

        <p
          className="
            mt-0.5
            truncate

            text-[10px]

            text-slate-400
            dark:text-slate-500
          "
        >
          {description}
        </p>
      </div>

      {/* ARROW */}

      <ChevronRight
        className="
          h-3.5
          w-3.5
          shrink-0

          text-slate-300

          transition-all
          duration-200

          group-hover:translate-x-0.5
          group-hover:text-pink-500

          dark:text-slate-600
        "
      />
    </button>
  );
}

export default Navbar;