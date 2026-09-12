import {
  LayoutDashboard,
  BookOpen,
  Languages,
  Headphones,
  CircleHelp,
  BarChart3,
  Settings,
  X,
  MessageCircle,
  RefreshCw,
  Sparkles,
  Hash,
  UserRound,
} from "lucide-react";

import { NavLink } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuSections = [
  {
    title: "MAIN",
    items: [
      {
        name: "Dashboard",
        path: "/",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "LEARN",
    items: [
      {
        name: "Kanji",
        path: "/kanji",
        icon: BookOpen,
      },
      {
        name: "Vocabulary",
        path: "/vocabulary",
        icon: Languages,
      },
      {
        name: "Grammar",
        path: "/grammar",
        icon: BookOpen,
      },
      {
        name: "Expressions",
        path: "/expressions",
        icon: MessageCircle,
      },
      {
        name: "Verbs",
        path: "/verbs",
        icon: RefreshCw,
      },
      {
        name: "Adjectives",
        path: "/adjectives",
        icon: Sparkles,
      },
      {
        name: "Numbers & Time",
        path: "/numbers",
        icon: Hash,
      },
      {
        name: "Kana",
        path: "/kana",
        icon: Languages,
      },
    ],
  },
  {
    title: "PRACTICE",
    items: [
      {
        name: "Listening",
        path: "/listening",
        icon: Headphones,
      },
      {
        name: "Quiz",
        path: "/quiz",
        icon: CircleHelp,
      },
    ],
  },
  {
    title: "PROGRESS",
    items: [
      {
        name: "Progress",
        path: "/progress",
        icon: BarChart3,
      },
      {
        name: "Settings",
        path: "/settings",
        icon: Settings,
      },
    ],
  },
];

function Sidebar({
  isOpen,
  onClose,
}: SidebarProps) {
  return (
    <>
      {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}

      {isOpen && (
        <div
          aria-hidden="true"
          onClick={onClose}
          className="
            fixed
            inset-0
            z-[55]
            bg-black/60
            backdrop-blur-[3px]
            md:hidden
          "
        />
      )}

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={`
          fixed
          left-0
          top-[76px]
          bottom-0
          z-[60]

          w-[min(20rem,calc(100vw-3rem))]

          border-r
          border-slate-200
          bg-white

          shadow-2xl

          transition-transform
          duration-300
          ease-out

          dark:border-slate-800
          dark:bg-slate-950

          ${
            isOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }

          md:sticky
          md:top-[76px]
          md:z-30
          md:h-[calc(100vh-76px)]
          md:w-64
          md:translate-x-0
          md:shadow-none
        `}
      >
        {/* =====================================================
            MOBILE HEADER
        ===================================================== */}

        <div
          className="
            flex
            shrink-0
            items-center
            justify-between
            border-b
            border-slate-200
            px-5
            py-5
            dark:border-slate-800
            md:hidden
          "
        >
          <div>
            <p
              className="
                text-lg
                font-bold
                text-slate-900
                dark:text-white
              "
            >
              Menu
            </p>

            <p
              className="
                mt-0.5
                text-xs
                text-slate-500
                dark:text-slate-500
              "
            >
              Learn Japanese
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              text-slate-500
              transition-all
              hover:bg-slate-100
              hover:text-pink-500
              dark:text-slate-400
              dark:hover:bg-slate-800
              dark:hover:text-pink-400
            "
          >
            <X
              size={24}
              strokeWidth={2}
            />
          </button>
        </div>

        {/* =====================================================
            NAVIGATION
        ===================================================== */}

        <nav
          className="
            h-[calc(100%-81px)]
            overflow-y-auto
            px-4
            py-6

            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden

            md:h-full
            md:px-3
            md:py-5
          "
        >
          <div className="space-y-7 pb-32 md:pb-8">

            {menuSections.map(
              (section) => (
                <div
                  key={section.title}
                >
                  {/* Section title */}

                  <div className="mb-3 px-3">
                    <p
                      className="
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-[0.18em]
                        text-slate-400
                        dark:text-slate-600
                      "
                    >
                      {section.title}
                    </p>
                  </div>

                  {/* Section items */}

                  <div className="space-y-1.5">

                    {section.items.map(
                      (item) => {
                        const Icon =
                          item.icon;

                        return (
                          <NavLink
                            key={item.path}
                            to={item.path}
                            end={
                              item.path === "/"
                            }
                            onClick={
                              onClose
                            }
                            className={({
                              isActive,
                            }) =>
                              `
                              group
                              flex
                              items-center
                              gap-3
                              rounded-2xl
                              px-4
                              py-3.5
                              text-[15px]
                              font-semibold
                              transition-all
                              duration-200

                              ${
                                isActive
                                  ? `
                                    bg-pink-50
                                    text-pink-600
                                    shadow-sm
                                    dark:bg-pink-500/10
                                    dark:text-pink-400
                                  `
                                  : `
                                    text-slate-600
                                    hover:bg-slate-50
                                    hover:text-pink-500
                                    dark:text-slate-400
                                    dark:hover:bg-slate-900
                                    dark:hover:text-pink-400
                                  `
                              }
                            `
                            }
                          >
                            <div
                              className="
                                flex
                                h-7
                                w-7
                                shrink-0
                                items-center
                                justify-center
                              "
                            >
                              <Icon
                                size={21}
                                strokeWidth={2}
                                className="
                                  transition-transform
                                  duration-200
                                  group-hover:scale-110
                                "
                              />
                            </div>

                            <span className="truncate">
                              {item.name}
                            </span>
                          </NavLink>
                        );
                      },
                    )}

                  </div>
                </div>
              ),
            )}

            {/* =================================================
                ABOUT CREATOR
            ================================================= */}

            <div>
              <div className="mb-3 px-3">
                <p
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.18em]
                    text-slate-400
                    dark:text-slate-600
                  "
                >
                  YOMIKO
                </p>
              </div>

              <NavLink
                to="/about-creator"
                onClick={onClose}
                className={({ isActive }) =>
                  `
                  group
                  flex
                  items-center
                  gap-3
                  rounded-2xl
                  px-4
                  py-3.5
                  text-[15px]
                  font-semibold
                  transition-all
                  duration-200

                  ${
                    isActive
                      ? `
                        bg-pink-50
                        text-pink-600
                        shadow-sm
                        dark:bg-pink-500/10
                        dark:text-pink-400
                      `
                      : `
                        text-slate-600
                        hover:bg-slate-50
                        hover:text-pink-500
                        dark:text-slate-400
                        dark:hover:bg-slate-900
                        dark:hover:text-pink-400
                      `
                  }
                `
                }
              >
                <div
                  className="
                    flex
                    h-7
                    w-7
                    shrink-0
                    items-center
                    justify-center
                  "
                >
                  <UserRound
                    size={21}
                    strokeWidth={2}
                    className="
                      transition-transform
                      duration-200
                      group-hover:scale-110
                    "
                  />
                </div>

                <span className="truncate">
                  About Creator
                </span>
              </NavLink>
            </div>

          </div>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;