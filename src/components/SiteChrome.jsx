import { useContext, useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Download,
  MapPin,
  Menu,
  Pause,
  Play,
  X,
} from "lucide-react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { featuredProjects } from "../data";
import { MotionEnabledContext } from "./common";

const navigation = [
  ["portfolio", "Work"],
  ["awards", "Awards"],
  ["about", "About"],
  ["experience", "Journey"],
  ["contact", "Contact"],
];

export function SiteHeader({ motionEnabled, onMotionToggle }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const sections = document.querySelectorAll("main > section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-15% 0px -65% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <header className="site-header">
      <a className="wordmark" href="#home" aria-label="Sujoy Das, home">
        SUJOY DAS<span>®</span>
      </a>
      <nav className="desktop-nav" aria-label="Main navigation">
        {navigation.map(([id, label]) => (
          <a key={id} href={`#${id}`} className={activeSection === id ? "active" : ""}>
            {label}
          </a>
        ))}
      </nav>
      <div className="header-actions">
        <button
          className="motion-toggle"
          onClick={onMotionToggle}
          aria-label={motionEnabled ? "Pause animation" : "Enable animation"}
          aria-pressed={!motionEnabled}
        >
          {motionEnabled ? <Pause size={13} /> : <Play size={13} />}
          <span>Motion {motionEnabled ? "on" : "off"}</span>
        </button>
        <a className="header-contact" href="#contact">
          Let’s talk <ArrowUpRight size={16} />
        </a>
        <button
          className="menu-toggle icon-button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>
      <AnimateMobileMenu open={menuOpen} onNavigate={() => setMenuOpen(false)} />
    </header>
  );
}

function AnimateMobileMenu({ open, onNavigate }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.nav
          id="mobile-menu"
          className="mobile-menu"
          aria-label="Mobile navigation"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
        >
          {["home", ...navigation.map(([id]) => id)].map((id, index) => {
            const label = id === "home" ? "Home" : navigation.find(([navId]) => navId === id)[1];
            return (
              <a key={id} href={`#${id}`} onClick={onNavigate}>
                <span>0{index + 1}</span>
                {label}
                <ArrowUpRight size={18} />
              </a>
            );
          })}
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

export function Hero({ onProject }) {
  const enabled = useContext(MotionEnabledContext);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const titleY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, 85]);
  const portraitScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const introY = useTransform(scrollYProgress, [0, 1], [0, -55]);

  return (
    <section id="home" className="hero" ref={heroRef}>
      <div className="hero-top">
        <span>
          GRAPHIC DESIGNER / UI/UX DESIGNER
          <br />
          <span className="muted">VISUAL STORYTELLER</span>
        </span>
        <span className="availability">
          <i />
          AVAILABLE FOR COLLABORATION
        </span>
      </div>
      <motion.div
        className="hero-title display"
        aria-hidden="true"
        style={enabled ? { y: titleY } : {}}
        initial={enabled ? { clipPath: "inset(0 0 100% 0)" } : false}
        animate={{ clipPath: "inset(0 0 0% 0)" }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      >
        PORTFOLIO
      </motion.div>
      <motion.div
        className="hero-portrait"
        style={enabled ? { y: portraitY, scale: portraitScale } : {}}
        initial={enabled ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.2 }}
      >
        <img
          src="./Asset/img/renando-portrait.png"
          alt="Sujoy Das wearing a black blazer with red studio lighting"
          width="1024"
          height="1536"
          fetchPriority="high"
        />
      </motion.div>
      <motion.div
        className="hero-intro"
        style={enabled ? { y: introY } : {}}
        initial={enabled ? { opacity: 0, x: -35 } : false}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="handwriting">Hello, I’m</p>
        <h1 className="display">
          SUJOY DAS<span>.</span>
        </h1>
        <p className="hero-role">
          GRAPHIC DESIGNER
          <br />
          UI/UX DESIGNER
        </p>
        <p className="hero-description">
          Designing visuals. Creating experiences.
          <br />
          I turn ideas into clear interfaces and distinctive visuals that users remember.
        </p>
        <a href="#portfolio" className="primary-link">
          View my work <ArrowRight size={17} />
        </a>
        <span className="hero-location">
          <MapPin size={12} /> INDRAMAYU, INDONESIA
        </span>
      </motion.div>
      <motion.div
        className="hero-side"
        initial={enabled ? { opacity: 0, x: 30 } : false}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="hero-manifesto">
          <span className="crosshair" aria-hidden="true">✳</span>
          <p>
            Every frame.
            <br />A different feeling.
          </p>
        </div>
        <div className="hero-stats">
          <div>
            <span className="display">3<span>+</span></span>
            <p>YEARS IN THE INDUSTRY<br />CREATIVE</p>
          </div>
          <div>
            <span className="display">20<span>+</span></span>
            <p>FILM PROJECTS<br />AND STORIES</p>
          </div>
          <div className="hero-award-stat">
            <span className="display">10<span>+</span></span>
            <a href="#awards" aria-label="View Sujoy Das awards">
              AWARDS WON <ArrowUpRight size={12} />
            </a>
          </div>
          <a href="./Asset/cv/Sujoy Das_Editor_VFX.pdf.pdf" download>
            <Download size={16} />
            <span>DOWNLOAD CV</span>
          </a>
        </div>
      </motion.div>
      <div className="hero-bottom">
        <button className="reel-button" onClick={() => onProject(featuredProjects[0])}>
          <span className="play-circle"><Play size={12} fill="currentColor" /></span>
          PLAY SHOWREEL <span className="muted">VFX / CGI</span>
        </button>
        <span className="hero-scroll">
          SCROLL TO DISCOVER <ArrowDown size={13} />
        </span>
        <span className="edition">SELECTED WORK / 2022–2026</span>
      </div>
    </section>
  );
}
