import { useState, type ReactNode } from "react";

import {
  ExternalLink,
  GitBranch,
  Globe,
  Code2,
  GraduationCap,
  BriefcaseBusiness,
  MapPin,
  UserRound,
  Sparkles,
  Layers3,
} from "lucide-react";

import { motion } from "motion/react";

import {
  portfolioProjects,
  projectCategories,
} from "@/data/portfolio";

function AboutCreator() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects =
    activeCategory === "All"
      ? portfolioProjects
      : portfolioProjects.filter(
          (project) => project.category === activeCategory,
        );

  return (
    <div
      className="
        min-h-screen
        bg-slate-50
        px-4
        py-8
        transition-colors
        dark:bg-slate-950
        sm:px-6
        md:px-8
        lg:px-10
      "
    >
      <div className="mx-auto max-w-7xl">

        {/* =====================================================
            HERO
        ===================================================== */}

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="
            relative
            overflow-hidden
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-6
            shadow-sm
            dark:border-slate-800
            dark:bg-slate-900
            sm:p-8
            md:p-10
          "
        >
          {/* Decorative background */}
          <div
            className="
              pointer-events-none
              absolute
              -right-24
              -top-24
              h-72
              w-72
              rounded-full
              bg-pink-500/10
              blur-3xl
            "
          />

          <div
            className="
              relative
              flex
              flex-col
              gap-7
              md:flex-row
              md:items-center
            "
          >
            {/* Avatar */}
            <div
              className="
                flex
                h-24
                w-24
                shrink-0
                items-center
                justify-center
                rounded-3xl
                bg-gradient-to-br
                from-pink-500
                to-fuchsia-600
                text-4xl
                font-bold
                text-white
                shadow-lg
                shadow-pink-500/20
                sm:h-28
                sm:w-28
              "
            >
              H
            </div>

            {/* Introduction */}
            <div className="min-w-0 flex-1">
              <div
                className="
                  mb-3
                  flex
                  items-center
                  gap-2
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  text-pink-500
                  sm:text-sm
                "
              >
                <Sparkles className="h-4 w-4" />
                About the Creator
              </div>

              <h1
                className="
                  text-3xl
                  font-bold
                  tracking-tight
                  text-slate-900
                  dark:text-white
                  sm:text-4xl
                  md:text-5xl
                "
              >
                Harsha Hettiarachchi
              </h1>

              <p
                className="
                  mt-3
                  text-base
                  font-semibold
                  text-pink-500
                  sm:text-lg
                "
              >
                Web Developer & IT Professional
              </p>

              <p
                className="
                  mt-4
                  max-w-3xl
                  text-sm
                  leading-7
                  text-slate-600
                  dark:text-slate-400
                  sm:text-base
                "
              >
                I am an IT professional and aspiring web developer
                who enjoys turning ideas into modern, responsive,
                and user-friendly web experiences. I created Yomiko
                as a practical Japanese learning platform while
                continuing to improve my skills through real-world
                projects.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <div
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-full
                    bg-slate-100
                    px-4
                    py-2
                    text-sm
                    text-slate-600
                    dark:bg-slate-800
                    dark:text-slate-300
                  "
                >
                  <MapPin className="h-4 w-4 text-pink-500" />
                  Based in Japan
                </div>

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-full
                    bg-slate-100
                    px-4
                    py-2
                    text-sm
                    text-slate-600
                    dark:bg-slate-800
                    dark:text-slate-300
                  "
                >
                  <Code2 className="h-4 w-4 text-pink-500" />
                  Web Development
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* =====================================================
            ABOUT CARDS
        ===================================================== */}

        <section className="mt-8 grid gap-5 md:grid-cols-3">
          <InfoCard
            icon={<Code2 className="h-6 w-6" />}
            title="Web Developer"
            text="Building responsive websites and interactive web applications using modern technologies."
            delay={0}
          />

          <InfoCard
            icon={<GraduationCap className="h-6 w-6" />}
            title="IT Professional"
            text="Continuously learning software development, web technologies, databases, and modern IT concepts."
            delay={0.05}
          />

          <InfoCard
            icon={<BriefcaseBusiness className="h-6 w-6" />}
            title="Project Based Learning"
            text="Improving practical skills by creating real websites, applications, assignments, and group projects."
            delay={0.1}
          />
        </section>

        {/* =====================================================
            WHY YOMIKO
        ===================================================== */}

        <motion.section
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{
            once: true,
            amount: 0.15,
          }}
          className="
            mt-10
            rounded-3xl
            border
            border-pink-100
            bg-gradient-to-br
            from-pink-50
            to-white
            p-6
            dark:border-pink-500/10
            dark:from-pink-500/10
            dark:to-slate-900
            md:p-10
          "
        >
          <div className="flex flex-col gap-5 sm:flex-row">
            <div
              className="
                flex
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-pink-500
                text-white
                shadow-lg
                shadow-pink-500/20
              "
            >
              <Sparkles className="h-6 w-6" />
            </div>

            <div>
              <h2
                className="
                  text-2xl
                  font-bold
                  text-slate-900
                  dark:text-white
                "
              >
                Why I Created Yomiko
              </h2>

              <p
                className="
                  mt-3
                  max-w-4xl
                  text-sm
                  leading-7
                  text-slate-600
                  dark:text-slate-400
                  sm:text-base
                "
              >
                Yomiko was created to make Japanese learning more
                practical, organized, and enjoyable. The platform
                brings vocabulary, kanji, grammar, expressions,
                verbs, adjectives, numbers, listening practice,
                quizzes, and progress tracking into one learning
                experience.
              </p>

              <p
                className="
                  mt-3
                  max-w-4xl
                  text-sm
                  leading-7
                  text-slate-600
                  dark:text-slate-400
                  sm:text-base
                "
              >
                This project also gives me an opportunity to
                continuously practice React, TypeScript, API
                integration, component-based development,
                responsive UI design, and state management.
              </p>
            </div>
          </div>
        </motion.section>

        {/* =====================================================
            TECHNOLOGIES
        ===================================================== */}

        <section className="mt-10">
          <div className="mb-5">
            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-wider
                text-pink-500
                sm:text-sm
              "
            >
              Technology
            </p>

            <h2
              className="
                mt-1
                text-2xl
                font-bold
                text-slate-900
                dark:text-white
                sm:text-3xl
              "
            >
              Technologies I Work With
            </h2>
          </div>

          <div className="flex flex-wrap gap-3">
            {[
              "HTML5",
              "CSS3",
              "JavaScript",
              "TypeScript",
              "React",
              "Vite",
              "Tailwind CSS",
              "REST APIs",
              "Git",
              "GitHub",
              "Responsive Design",
            ].map((technology) => (
              <span
                key={technology}
                className="
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  text-slate-700
                  shadow-sm
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:border-pink-300
                  hover:text-pink-500
                  dark:border-slate-800
                  dark:bg-slate-900
                  dark:text-slate-300
                  dark:hover:border-pink-500/40
                  dark:hover:text-pink-400
                "
              >
                {technology}
              </span>
            ))}
          </div>
        </section>

        {/* =====================================================
            PROJECTS
        ===================================================== */}

        <section className="mt-12">
          <div className="mb-6">
            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-wider
                text-pink-500
                sm:text-sm
              "
            >
              My Work
            </p>

            <h2
              className="
                mt-1
                text-2xl
                font-bold
                text-slate-900
                dark:text-white
                sm:text-3xl
              "
            >
              Projects & Websites
            </h2>

            <p
              className="
                mt-2
                text-sm
                text-slate-500
                dark:text-slate-400
                sm:text-base
              "
            >
              A collection of websites and applications I have
              developed.
            </p>
          </div>

          {/* Category Filters */}
          <div
            className="
              mb-7
              grid
              grid-cols-2
              gap-2
              sm:grid-cols-3
              md:grid-cols-4
              xl:grid-cols-6
            "
          >
            {projectCategories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`
                  w-full
                  rounded-xl
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  transition-all
                  duration-200
                  ${
                    activeCategory === category
                      ? "bg-pink-500 text-white shadow-lg shadow-pink-500/20"
                      : "bg-white text-slate-600 hover:bg-pink-50 hover:text-pink-500 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-pink-500/10 dark:hover:text-pink-400"
                  }
                `}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Project Grid */}
          {filteredProjects.length > 0 ? (
            <div
              className="
                grid
                gap-5
                sm:grid-cols-2
                xl:grid-cols-3
              "
            >
              {filteredProjects.map((project, index) => (
                <motion.article
                  key={project.id}
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.1,
                  }}
                  transition={{
                    delay: index * 0.04,
                  }}
                  className="
                    group
                    flex
                    flex-col
                    overflow-hidden
                    rounded-3xl
                    border
                    border-slate-200
                    bg-white
                    shadow-sm
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-pink-200
                    hover:shadow-xl
                    dark:border-slate-800
                    dark:bg-slate-900
                    dark:hover:border-pink-500/30
                  "
                >
                  {/* Project Header */}
                  <div
                    className="
                      relative
                      flex
                      h-36
                      items-center
                      justify-center
                      overflow-hidden
                      bg-gradient-to-br
                      from-pink-500/10
                      via-fuchsia-500/10
                      to-purple-500/10
                      dark:from-pink-500/10
                      dark:via-purple-500/10
                      dark:to-slate-800
                    "
                  >
                    <div
                      className="
                        relative
                        flex
                        h-16
                        w-16
                        items-center
                        justify-center
                        rounded-2xl
                        bg-white
                        text-pink-500
                        shadow-lg
                        transition-transform
                        duration-300
                        group-hover:scale-110
                        dark:bg-slate-800
                      "
                    >
                      {project.category === "Portfolio" ? (
                        <UserRound className="h-7 w-7" />
                      ) : project.category === "Web Applications" ? (
                        <Layers3 className="h-7 w-7" />
                      ) : project.category === "Individual Assignment" ? (
                        <GraduationCap className="h-7 w-7" />
                      ) : project.category === "Photography & Business" ? (
                        <Globe className="h-7 w-7" />
                      ) : (
                        <Code2 className="h-7 w-7" />
                      )}
                    </div>

                    {project.featured && (
                      <span
                        className="
                          absolute
                          right-4
                          top-4
                          rounded-full
                          bg-pink-500
                          px-3
                          py-1
                          text-[10px]
                          font-bold
                          uppercase
                          tracking-wider
                          text-white
                        "
                      >
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Project Content */}
                  <div
                    className="
                      flex
                      flex-1
                      flex-col
                      p-5
                    "
                  >
                    <h3
                      className="
                        text-xl
                        font-bold
                        text-slate-900
                        dark:text-white
                      "
                    >
                      {project.title}
                    </h3>

                    <span
                      className="
                        mb-3
                        mt-2
                        w-fit
                        rounded-lg
                        bg-pink-50
                        px-2.5
                        py-1
                        text-xs
                        font-semibold
                        text-pink-600
                        dark:bg-pink-500/10
                        dark:text-pink-400
                      "
                    >
                      {project.category}
                    </span>

                    <p
                      className="
                        flex-1
                        text-sm
                        leading-6
                        text-slate-600
                        dark:text-slate-400
                      "
                    >
                      {project.description}
                    </p>

                    {/* Technologies */}
                    <div className="mt-5 flex flex-wrap gap-2">
                      {project.technologies.map((technology) => (
                        <span
                          key={technology}
                          className="
                            rounded-lg
                            bg-slate-100
                            px-2.5
                            py-1
                            text-[11px]
                            font-medium
                            text-slate-600
                            dark:bg-slate-800
                            dark:text-slate-400
                          "
                        >
                          {technology}
                        </span>
                      ))}
                    </div>

                    {/* View Project */}
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        mt-5
                        flex
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-slate-900
                        px-4
                        py-3
                        text-sm
                        font-semibold
                        text-white
                        transition-all
                        hover:bg-pink-500
                        dark:bg-slate-800
                        dark:hover:bg-pink-500
                      "
                    >
                      <ExternalLink className="h-4 w-4" />
                      View Project
                    </a>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <div
              className="
                rounded-3xl
                border
                border-dashed
                border-slate-300
                bg-white
                p-10
                text-center
                dark:border-slate-700
                dark:bg-slate-900
              "
            >
              <p className="text-slate-500 dark:text-slate-400">
                No projects found in this category.
              </p>
            </div>
          )}
        </section>

        {/* =====================================================
            CONNECT
        ===================================================== */}

        <section
          className="
            mt-12
            rounded-3xl
            bg-slate-900
            p-7
            text-white
            dark:border
            dark:border-slate-800
            md:p-10
          "
        >
          <div
            className="
              flex
              flex-col
              gap-6
              md:flex-row
              md:items-center
              md:justify-between
            "
          >
            <div>
              <p
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  text-pink-400
                  sm:text-sm
                "
              >
                Let's Connect
              </p>

              <h2
                className="
                  mt-2
                  text-2xl
                  font-bold
                  md:text-3xl
                "
              >
                Explore more of my work
              </h2>

              <p
                className="
                  mt-2
                  max-w-xl
                  text-sm
                  leading-6
                  text-slate-400
                  sm:text-base
                "
              >
                Visit my portfolio and social profiles to learn
                more about my skills, background, projects, and
                web development journey.
              </p>
            </div>

            {/* Social Links */}
            <div className="flex flex-wrap gap-3">

              {/* Portfolio */}
              <a
                href="https://harshahettiarachchi.github.io/harsha-portfolio/"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-pink-500
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-pink-400
                "
              >
                <Globe className="h-4 w-4" />
                Portfolio
              </a>

              {/* GitHub */}
              <a
                href="https://github.com/HarshaHettiarachchi"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-slate-700
                  bg-slate-800
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:border-pink-500
                  hover:text-pink-400
                "
              >
                <GitBranch className="h-4 w-4" />
                GitHub
              </a>

              {/* LinkedIn */}
              <a href="https://www.linkedin.com/in/harsha-hettiarachchi-b0a30826b/"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-slate-700
                  bg-slate-800
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:border-pink-500
                  hover:text-pink-400
                "
              >
                <span
                  className="
                    flex
                    h-5
                    w-5
                    items-center
                    justify-center
                    rounded-sm
                    bg-white
                    text-[11px]
                    font-bold
                    text-slate-900
                  "
                >
                  in
                </span>
                LinkedIn
              </a>

            </div>
          </div>
        </section>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <div
          className="
            py-8
            text-center
            text-sm
            text-slate-400
          "
        >
          Built with passion by Harsha Hettiarachchi
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   INFO CARD
========================================================= */

function InfoCard({
  icon,
  title,
  text,
  delay,
}: {
  icon: ReactNode;
  title: string;
  text: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 15,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.15,
      }}
      transition={{
        delay,
      }}
      className="
        rounded-3xl
        border
        border-slate-200
        bg-white
        p-6
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-lg
        dark:border-slate-800
        dark:bg-slate-900
      "
    >
      <div
        className="
          mb-4
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-2xl
          bg-pink-50
          text-pink-500
          dark:bg-pink-500/10
          dark:text-pink-400
        "
      >
        {icon}
      </div>

      <h3
        className="
          text-lg
          font-bold
          text-slate-900
          dark:text-white
        "
      >
        {title}
      </h3>

      <p
        className="
          mt-2
          text-sm
          leading-6
          text-slate-500
          dark:text-slate-400
        "
      >
        {text}
      </p>
    </motion.div>
  );
}

export default AboutCreator;