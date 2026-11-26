import { useContext, useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Pause,
  Play,
  Search,
  X,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useIsPresent,
} from "framer-motion";
import { brands, categories, featuredProjects, projects } from "../data";
import { MediaImage, MotionEnabledContext, Reveal, useParallax } from "./common";

function ProjectCard({ project, index, onOpen }) {
  const enabled = useContext(MotionEnabledContext);
  const isPresent = useIsPresent();
  const cardRef = useRef(null);
  const parallaxY = useParallax(cardRef);
  const isVideo = ["youtube", "drive"].includes(project.type);
  const typeLabel =
    project.type === "render"
      ? "DESIGN PROCESS"
      : isVideo
        ? "UI / UX"
        : project.type === "website"
          ? "WEBSITE"
          : "STILL / IMAGE";

  return (
    <motion.article
      ref={cardRef}
      className="project-card"
      layout
      style={{ pointerEvents: isPresent ? "auto" : "none" }}
      aria-hidden={!isPresent}
      inert={!isPresent}
      initial={enabled ? { opacity: 0, y: 32 } : false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.08 }}
      transition={{
        duration: enabled ? 0.6 : 0,
        delay: (index % 3) * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      exit={{ opacity: 0, scale: 0.96 }}
    >
      <button
        className="project-open"
        onClick={() => onOpen(project)}
        aria-label={`View ${project.title}`}
      >
        <motion.div className="project-picture" style={enabled ? { y: parallaxY } : {}}>
          <MediaImage src={project.image} alt={project.title} />
        </motion.div>
        <span className="project-type">{typeLabel}</span>
        <span className="project-hover">
          {isVideo ? <Play fill="currentColor" size={18} /> : <ArrowUpRight size={22} />}
        </span>
        <span className="project-frame" aria-hidden="true" />
      </button>
      <button className="project-caption" onClick={() => onOpen(project)}>
        <span className="project-number display">{String(index + 1).padStart(2, "0")}</span>
        <span>
          <h3>{project.title}</h3>
          <span className="project-category">
            {project.category}{project.year ? ` / ${project.year}` : ""}
          </span>
        </span>
        <ArrowUpRight size={20} />
      </button>
    </motion.article>
  );
}

export function Portfolio({ onProject }) {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [limit, setLimit] = useState(9);
  const matchingProjects = projects.filter((project) => {
    const matchesCategory = category === "All" || project.category === category;
    const searchable = `${project.title} ${project.category} ${project.role}`.toLowerCase();
    return matchesCategory && searchable.includes(query.toLowerCase());
  });
  const visibleProjects =
    showAll || category !== "All" || query
      ? matchingProjects.slice(0, limit)
      : featuredProjects;

  const toggleAllWork = () => {
    if (showAll) {
      setShowAll(false);
      setCategory("All");
      setQuery("");
    } else {
      setShowAll(true);
      setLimit(9);
    }
  };

  return (
    <section id="portfolio" className="portfolio section-wrap">
      <Reveal className="section-heading">
        <div>
          <span className="eyebrow">01 / SELECTED WORK</span>
          <h2>WORK THAT SPEAKS<span className="accent">.</span></h2>
        </div>
        <button className="text-link" onClick={toggleAllWork}>
          {showAll ? "SELECTED WORK" : "ALL WORK"} <ArrowUpRight size={21} />
        </button>
      </Reveal>

      <Reveal className="portfolio-toolbar">
        <div className="filters" role="group" aria-label="Work category">
          {categories.map((item) => (
            <button
              key={item}
              className={category === item ? "selected" : ""}
              aria-pressed={category === item}
              onClick={() => {
                setCategory(item);
                setShowAll(true);
                setLimit(9);
              }}
            >
              {item}
              {item === category && (
                <motion.span className="filter-line" layoutId="filter-line" />
              )}
            </button>
          ))}
        </div>
        <label className="search-box">
          <Search size={15} />
          <span>Search</span>
          <input
            aria-label="Search work"
            type="search"
            placeholder="Title or category…"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setShowAll(true);
              setLimit(9);
            }}
          />
        </label>
      </Reveal>

      <motion.div className="project-grid" layout>
        <AnimatePresence mode="popLayout">
          {visibleProjects.map((project, index) => (
            <ProjectCard
              key={`${project.category}-${project.title}-${project.media ?? project.image}`}
              project={project}
              index={index}
              onOpen={onProject}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {visibleProjects.length === 0 && (
        <div className="empty-state">
          <p>No work found for “{query}”.</p>
          <button
            className="text-link"
            onClick={() => {
              setQuery("");
              setCategory("All");
              setShowAll(false);
            }}
          >
            Reset search <X size={15} />
          </button>
        </div>
      )}

      {showAll && matchingProjects.length > limit && (
        <div className="load-more">
          <button className="outline-button" onClick={() => setLimit((count) => count + 9)}>
            Show more work <ArrowDown size={16} />
          </button>
          <span>{visibleProjects.length} of {matchingProjects.length} projects</span>
        </div>
      )}
      <BrandStrip />
    </section>
  );
}

function BrandStrip() {
  const enabled = useContext(MotionEnabledContext);
  const viewportRef = useRef(null);
  const setWidthRef = useRef(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || expanded) return undefined;
    const measure = () => {
      setWidthRef.current = viewport.querySelector(".brand-set")?.getBoundingClientRect().width || 0;
    };
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    measure();
    return () => observer.disconnect();
  }, [expanded]);

  useAnimationFrame((_time, delta) => {
    const viewport = viewportRef.current;
    if (!enabled || paused || hovered || expanded || !viewport || !setWidthRef.current) return;
    viewport.scrollLeft += Math.min(delta, 40) * 0.038;
    if (viewport.scrollLeft >= setWidthRef.current) {
      viewport.scrollLeft -= setWidthRef.current;
    }
  });

  const scroll = (direction) => {
    setPaused(true);
    viewportRef.current?.scrollBy({
      left: direction * (viewportRef.current.clientWidth * 0.7),
      behavior: enabled ? "smooth" : "auto",
    });
  };

  return (
    <Reveal className="brand-section">
      <div className="brand-heading">
        <p>BEEN PART OF<br /><strong>THE BIGGER PICTURE.</strong></p>
        <div>
          <button
            className="brand-all"
            onClick={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
            aria-controls="brand-collection"
          >
            {expanded ? "SHOW AS A STRIP" : `VIEW ALL (${brands.length})`}
            {expanded ? <ArrowUpRight size={14} /> : <ArrowDown size={14} />}
          </button>
          {!expanded && (
            <>
              <button
                className="icon-button brand-pause"
                aria-label={paused ? "Play logo animation" : "Pause logo animation"}
                aria-pressed={paused}
                onClick={() => setPaused((value) => !value)}
              >
                {paused ? <Play size={13} /> : <Pause size={13} />}
              </button>
              <button className="icon-button" onClick={() => scroll(-1)} aria-label="Previous logo">
                <ArrowLeft size={17} />
              </button>
              <button className="icon-button" onClick={() => scroll(1)} aria-label="Next logo">
                <ArrowRight size={17} />
              </button>
            </>
          )}
        </div>
      </div>
      <div
        id="brand-collection"
        className={expanded ? "brand-full-grid" : "brand-viewport"}
        ref={viewportRef}
        onPointerEnter={(event) => event.pointerType === "mouse" && setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onPointerDown={() => setPaused(true)}
        onFocusCapture={() => setHovered(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setHovered(false);
        }}
        tabIndex={expanded ? undefined : 0}
        role={expanded ? "list" : "region"}
        aria-label="Client and organization logos. Scroll to see them all."
      >
        {expanded ? (
          brands.map((brand) => (
            <div className="brand-logo" role="listitem" key={brand.file}>
              <img
                src={`./Asset/svg/brand/${brand.file}`}
                alt={brand.name}
                title={brand.name}
                width="150"
                height="60"
                loading="lazy"
              />
              <span>{brand.name}</span>
            </div>
          ))
        ) : (
          <div className="brand-rail">
            {[0, 1].map((copy) => (
              <div className="brand-set" key={copy} aria-hidden={copy === 1 || undefined}>
                {brands.map((brand) => (
                  <div className="brand-logo" key={brand.file}>
                    <img
                      src={`./Asset/svg/brand/${brand.file}`}
                      alt={copy ? "" : brand.name}
                      title={brand.name}
                      width="150"
                      height="60"
                      loading="lazy"
                      draggable="false"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </Reveal>
  );
}
