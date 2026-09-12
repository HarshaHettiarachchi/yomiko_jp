import {
  Home,
  BookOpen,
  Headphones,
  BarChart3,
  MoreHorizontal,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const items = [
  {
    label: "Home",
    path: "/",
    icon: Home,
  },
  {
    label: "Learn",
    path: "/kanji",
    icon: BookOpen,
  },
  {
    label: "Practice",
    path: "/listening",
    icon: Headphones,
  },
  {
    label: "Progress",
    path: "/progress",
    icon: BarChart3,
  },
  {
    label: "More",
    path: "/settings",
    icon: MoreHorizontal,
  },
];

function MobileBottomNav() {
  return (
    <nav
      aria-label="Mobile navigation"
      className="
        fixed
        inset-x-0
        bottom-0
        z-[60]
        md:hidden

        border-t
        border-slate-200/80
        bg-white/95
        shadow-[0_-8px_30px_rgba(15,23,42,0.08)]
        backdrop-blur-2xl

        dark:border-slate-800/80
        dark:bg-slate-950/95
        dark:shadow-[0_-8px_30px_rgba(0,0,0,0.35)]
      "
    >
      {/* Safe area for iPhone */}
      <div
        className="
          mx-auto
          w-full
          max-w-xl
          px-2
          pt-1
          pb-[max(6px,env(safe-area-inset-bottom))]
        "
      >
        <div className="grid h-[64px] grid-cols-5">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                aria-label={item.label}
                className="
                  group
                  relative
                  flex
                  min-w-0
                  flex-col
                  items-center
                  justify-center
                  rounded-2xl
                  px-1
                  py-1
                  text-center
                  transition-all
                  duration-200
                  active:scale-95
                "
              >
                {({ isActive }) => (
                  <>
                    {/* Active background */}
                    <div
                      className={`
                        absolute
                        top-1
                        h-9
                        w-14
                        rounded-2xl
                        transition-all
                        duration-200
                        ${
                          isActive
                            ? "scale-100 bg-pink-100 dark:bg-pink-500/10"
                            : "scale-90 bg-transparent"
                        }
                      `}
                    />

                    {/* Icon */}
                    <div
                      className={`
                        relative
                        z-10
                        flex
                        h-9
                        w-14
                        items-center
                        justify-center
                        rounded-2xl
                        transition-all
                        duration-200
                        ${
                          isActive
                            ? "text-pink-500"
                            : "text-slate-500 group-hover:text-pink-500 dark:text-slate-400 dark:group-hover:text-pink-400"
                        }
                      `}
                    >
                      <Icon
                        className={`
                          h-[22px]
                          w-[22px]
                          transition-all
                          duration-200
                          ${
                            isActive
                              ? "scale-105 stroke-[2.5]"
                              : "stroke-[1.8]"
                          }
                        `}
                      />
                    </div>

                    {/* Label */}
                    <span
                      className={`
                        relative
                        z-10
                        mt-1
                        max-w-full
                        truncate
                        px-1
                        text-[11px]
                        font-semibold
                        leading-4
                        transition-colors
                        duration-200
                        ${
                          isActive
                            ? "text-pink-500 dark:text-pink-400"
                            : "text-slate-500 dark:text-slate-400"
                        }
                      `}
                    >
                      {item.label}
                    </span>

                    {/* Active indicator */}
                    {isActive && (
                      <span
                        className="
                          absolute
                          bottom-0.5
                          h-1
                          w-1
                          rounded-full
                          bg-pink-500
                          dark:bg-pink-400
                        "
                      />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export default MobileBottomNav;