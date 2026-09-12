export interface PortfolioProject {
  id: number;
  title: string;
  description: string;
  category: string;
  technologies: string[];
  url: string;
  featured?: boolean;
}

export const portfolioProjects: PortfolioProject[] = [
  {
    id: 1,
    title: "Harsha Portfolio",
    description:
      "Personal portfolio website showcasing my skills, projects, background, and web development journey.",
    category: "Portfolio",
    technologies: ["HTML", "CSS", "JavaScript"],
    url: "https://harshahettiarachchi.github.io/harsha-portfolio/",
    featured: true,
  },

  {
    id: 2,
    title: "Lunelle Blooms",
    description:
      "A modern and elegant flower shop website designed to present floral collections and create a beautiful shopping experience.",
    category: "Recent Projects",
    technologies: ["HTML", "CSS", "JavaScript"],
    url: "https://harshahettiarachchi.github.io/Lunelle-Blooms/",
    featured: true,
  },

  {
    id: 3,
    title: "TaskFlow To-Do App",
    description:
      "A responsive task management application for creating, organizing, searching, and completing daily tasks.",
    category: "Web Applications",
    technologies: ["HTML", "CSS", "JavaScript", "LocalStorage"],
    url: "https://harshahettiarachchi.github.io/TaskFlow-ToDo-App/",
    featured: true,
  },

  {
    id: 4,
    title: "Calculator",
    description:
      "A simple and responsive calculator application with a clean user interface.",
    category: "Web Applications",
    technologies: ["HTML", "CSS", "JavaScript"],
    url: "https://harshahettiarachchi.github.io/calculator/",
  },

  {
    id: 5,
    title: "World Explorer",
    description:
      "An interactive web application for exploring countries and discovering useful information about different parts of the world.",
    category: "Web Applications",
    technologies: ["HTML", "CSS", "JavaScript", "API"],
    url: "https://harshahettiarachchi.github.io/world-explorer/",
  },

  {
    id: 6,
    title: "WeatherFlow",
    description:
      "A real-time weather application providing current weather information and a 5-day forecast.",
    category: "Web Applications",
    technologies: ["HTML", "CSS", "JavaScript", "Weather API"],
    url: "https://harshahettiarachchi.github.io/WeatherFlow/",
  },

  {
    id: 7,
    title: "ICT Academy Hub",
    description:
      "An educational website designed to provide ICT learning resources and support students.",
    category: "Individual Assignment",
    technologies: ["HTML", "CSS", "JavaScript"],
    url: "https://harshahettiarachchi.github.io/ICT-Academy-Hub/",
    featured: true,
  },

  {
    id: 8,
    title: "Lumera Weddings",
    description:
      "A photography portfolio website created for showcasing wedding, engagement, baby photography, packages, and booking services.",
    category: "Photography & Business",
    technologies: ["React", "TypeScript", "Vite", "Tailwind CSS"],
    url: "https://harshahettiarachchi.github.io/Lumera-Weddings/",
    featured: true,
  },

  {
    id: 9,
    title: "Final Assignment",
    description:
      "A group web development project created as part of the academic project development process.",
    category: "Group Projects",
    technologies: ["HTML", "CSS", "JavaScript"],
    url: "https://harshahettiarachchi.github.io/Final_Assignment/",
  },

  {
    id: 10,
    title: "Group Project 04",
    description:
      "An early-stage group web development project created as part of collaborative web development work.",
    category: "Group Projects",
    technologies: ["HTML", "CSS", "JavaScript"],
    url: "https://harshahettiarachchi.github.io/Group_Project04/",
  },
];

export const projectCategories = [
  "All",
  "Portfolio",
  "Recent Projects",
  "Web Applications",
  "Individual Assignment",
  "Photography & Business",
  "Group Projects",
];