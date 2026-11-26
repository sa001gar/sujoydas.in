import projectData from "./data/projects.json";

export const projects = projectData;
export const categories = [
  "All",
  "VFX",
  "Film",
  "3D",
  "Commercial",
  "Photography",
  "Visual",
  "Manipulation",
  "Websites",
];
export const featuredProjects = [
  "wgGEoeSLR3g",
  "4iOvfP2j-qo",
  "CYBERPUNK ENVIRONMENT",
]
  .map((key) => projects.find((project) => project.media === key || project.title === key))
  .filter(Boolean);

export const experience = [
  {
    date: "2026 · PRESENT",
    title: "Freelance Creative",
    place: "Film and branded content",
    text: "Developing concepts and scripts for short films, and producing cinematic content for café, fashion, and hijab brands. From storytelling through final visuals.",
  },
  {
    date: "2023 – 2025",
    title: "VFX Artist",
    place: "Film and commercial production",
    text: "Compositing, CGI, matchmove, rotoscoping, and editing breakdowns. Involved in shoot supervision for post-production needs.",
  },
  {
    date: "2023 · 6 MONTHS",
    title: "VFX Internship",
    place: "Dalang Digital Studio",
    text: "Involved in film and advertising production, learning studio pipelines, and collaborating in visual-effects and animation workflows.",
  },
  {
    date: "2022 – 2023",
    title: "Freelance Editor",
    place: "Video, photography & film",
    text: "Editing hotel review videos for YouTube, photographing weddings, and collaborating on short films as editor and actor.",
  },
  {
    date: "2018 · PRESENT",
    title: "Content Creator",
    place: "DuingZ Studio",
    text: "Creating gaming, coding, short-film, and VFX content. A place to try ideas and continue developing storytelling.",
  },
];

export const certificates = [
  { title: "1st Place, Movie Event", year: "2025", image: "./Asset/img/SERTIFIKAT/shortmovie.jpeg" },
  { title: "Second Best Graduate", year: "2024", image: "./Asset/img/SERTIFIKAT/juara2.jpg" },
  { title: "Dalang Digital Studio", year: "2023", image: "./Asset/img/SERTIFIKAT/dalang.jpg" },
  { title: "Videolabs E-Course", year: "2024", image: "./Asset/img/SERTIFIKAT/videolabs.jpg" },
];

export const awards = [
  { year: "2025", title: "1st Place", event: "Indramayu Film Festival" },
  { year: "2024", title: "Best Competency Exam", event: "Animation Program" },
  { year: "2023", title: "Best Short Film", event: "Golkar Party" },
  { year: "2022", title: "1st Place, Short Film", event: "Hero Theme" },
  { year: "2021", title: "1st Place, Short Film", event: "Hero Theme" },
  { year: "2020", title: "Best Creative Video", event: "Creative Video Competition" },
];

export const brands = [
  { file: "Netflix.svg", name: "Netflix" },
  { file: "magma.png", name: "Magma Entertainment" },
  { file: "raincreation.png", name: "Rain Creation" },
  { file: "Extrajoss.png", name: "Extra Joss" },
  { file: "pemda.png", name: "PEMDA Indramayu" },
  { file: "diskominfo.png", name: "Diskominfo Indramayu" },
  { file: "dpmptsp.png", name: "DPMPTSP Indramayu" },
  { file: "seven.png", name: "Seven Coffee" },
  { file: "SevenDragon.png", name: "Seven Dragon" },
  { file: "vianos.png", name: "Vianos Club" },
  { file: "jeta.png", name: "Jeta Indonesia" },
  { file: "hara.png", name: "Hara Hijab" },
  { file: "mbc.png", name: "MBC" },
  { file: "Whatsin.png", name: "WhatsIn Indramayu" },
  { file: "logogatsu.png", name: "SMK 1 Indramayu" },
  { file: "unwir.png", name: "Universitas Wiralodra" },
  { file: "sma2indramayu.png", name: "SMA 2 Indramayu" },
  { file: "sma1seragen.png", name: "SMA 1 Seragen" },
];

export const processSteps = [
  ["01", "THE IDEA", "Listening to your story. Defining the message, visual direction, and feeling."],
  ["02", "THE PLAN", "Developing concepts, references, and a workflow tailored to production needs."],
  ["03", "THE CRAFT", "Editing, compositing, and visual effects, shaping every detail into one story."],
  ["04", "THE POLISH", "Bringing together color, rhythm, and sound to make every frame work as it should."],
  ["05", "THE FINAL FRAME", "Review together, refine the details, and deliver work ready for your audience."],
];
