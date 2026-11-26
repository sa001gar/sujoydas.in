import { useContext, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  Download,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Play,
  Youtube,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  awards,
  certificates,
  experience,
  featuredProjects,
  processSteps,
} from "../data";
import { MediaImage, MotionEnabledContext, Reveal } from "./common";

export function Recognition({ onProject }) {
  const [expanded, setExpanded] = useState(false);
  const certificate = certificates[0];

  return (
    <section
      id="awards"
      className={`recognition section-wrap ${expanded ? "awards-expanded" : ""}`}
    >
      <Reveal className="recognition-intro">
        <span className="eyebrow">RECOGNITION &amp; AWARDS</span>
        <h2 className="display">
          THE WORK.<br />
          <span className="accent">THE RECOGNITION.</span>
        </h2>
        <div className="award-total">
          <AwardBranch />
          <span className="display">10<span>+</span></span>
          <AwardBranch mirrored />
          <span className="award-total-label">AWARDS WON</span>
        </div>
        <p>Stories made with heart.<br />Awards that inspire us to keep creating.</p>
        <button
          className="text-link award-proof"
          onClick={() =>
            onProject({
              ...certificate,
              type: "image",
              media: certificate.image,
              category: "Award",
              description: "1st place at the Indramayu Movie Event, 2025.",
            })
          }
        >
          VIEW CERTIFICATE <ArrowUpRight size={18} />
        </button>
      </Reveal>
      <div className="recognition-list">
        <div className="recognition-list-head">
          <span>SELECTED RECOGNITION</span>
          <span>2020 – 2025</span>
        </div>
        <ol id="recognition-list">
          {awards.map((award, index) => (
            <Reveal
              as="li"
              className={`recognition-row ${index > 2 ? "additional-award" : ""}`}
              delay={index * 0.045}
              key={`${award.year}-${award.event}`}
            >
              <span className="award-index">0{index + 1}</span>
              <div>
                <h3>{award.title}</h3>
                <p>{award.event}</p>
              </div>
              <span className="award-year display">{award.year}</span>
            </Reveal>
          ))}
        </ol>
        <button
          className="award-expand"
          aria-expanded={expanded}
          aria-controls="recognition-list"
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? "Award summary" : "View other awards"}
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>
    </section>
  );
}

function AwardBranch({ mirrored = false }) {
  return (
    <svg
      viewBox="0 0 60 100"
      aria-hidden="true"
      style={mirrored ? { transform: "scaleX(-1)" } : undefined}
    >
      <path
        d="M48 94C8 68 9 30 35 5M22 61C8 60 3 49 3 44c12 0 19 6 19 17zm-5-19C5 35 6 23 8 19c11 5 13 14 9 23zm7-20C15 12 20 3 24 0c7 8 6 16 0 22zM31 79C17 79 8 70 7 64c13-2 22 4 24 15zm-3-18c-5-10-2-19 7-25 5 11 1 20-7 25zm10 24c-6-11-4-20 5-27 6 9 5 20-5 27z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Breakdown() {
  const enabled = useContext(MotionEnabledContext);
  const project = featuredProjects.find((item) => item.type === "render");
  const sectionRef = useRef(null);
  const [manual, setManual] = useState(false);
  const [position, setPosition] = useState(65);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const headingX = useTransform(scrollYProgress, [0, 1], [30, -30]);

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (!manual && enabled) setPosition(Math.round(90 - progress * 80));
  });

  if (!project?.renders?.[0]) return null;
  const imageUrl = (url) =>
    url?.replace("/upload/", "/upload/c_scale,w_1200,q_auto,f_auto/");
  const render = project.renders[0];

  return (
    <section
      className="breakdown section-wrap"
      ref={sectionRef}
      aria-labelledby="breakdown-title"
    >
      <Reveal className="breakdown-copy">
        <span className="eyebrow">A LOOK UNDER THE SURFACE</span>
        <motion.h2
          id="breakdown-title"
          className="display"
          style={enabled ? { x: headingX } : {}}
        >
          FROM RAW.<br />
          <span className="accent">TO REAL.</span>
        </motion.h2>
        <p>
          One scene. Layers of process.
          <br />
          See how a 3D environment transforms from a basic form into a living world.
        </p>
        <span className="breakdown-credit">
          CYBERPUNK ENVIRONMENT / 2025
          <br />
          3D ARTIST · LIGHTING · RENDERING
        </span>
      </Reveal>
      <Reveal className="comparison">
        <div className="comparison-stage" style={{ "--cut": `${enabled || manual ? position : 50}%` }}>
          <MediaImage
            src={imageUrl(render.solid)}
            alt="Cyberpunk environment before materials and lighting"
          />
          <div className="comparison-final">
            <MediaImage
              src={imageUrl(render.final)}
              alt="Final render of the cyberpunk environment"
            />
          </div>
          <span className="comparison-label raw-label">SOLID VIEW</span>
          <span className="comparison-label final-label">FINAL RENDER</span>
          <div className="comparison-divider">
            <span><ArrowLeft size={14} /><ArrowRight size={14} /></span>
          </div>
          <input
            aria-label="Before-and-after render comparison"
            aria-valuetext={`${position}% solid, ${100 - position}% final render`}
            type="range"
            min="0"
            max="100"
            value={position}
            onChange={(event) => {
              setManual(true);
              setPosition(Number(event.target.value));
            }}
          />
        </div>
        <div className="comparison-caption">
          <span>DRAG TO EXPLORE THE PROCESS</span>
          <span>DRAG / SCROLL</span>
        </div>
      </Reveal>
    </section>
  );
}

export function About() {
  const enabled = useContext(MotionEnabledContext);
  const aboutRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: aboutRef,
    offset: ["start 75%", "end 75%"],
  });

  return (
    <section id="about" className="about section-wrap" ref={aboutRef}>
      <Reveal className="about-lead">
        <div>
          <span className="eyebrow">02 / BEHIND THE FRAMES</span>
          <h2 className="display">
            MORE THAN JUST DESIGN.<br />
            THROUGH <span className="accent">STORYTELLING.</span>
          </h2>
        </div>
        <p>
          I am Sujoy Das, a graphic and UI/UX designer from Indramayu. I combine
          visual thinking and interaction design to create clear, useful, and
          memorable digital experiences.
        </p>
      </Reveal>
      <div className="studio-grid">
        <Reveal className="education-panel">
          <h3 className="panel-heading">EDUCATION &amp; SKILLS</h3>
          <p className="eyebrow accent">EDUCATION</p>
          <div className="education-row">
            <strong>SMKN 1 Indramayu</strong>
            <span>Animation</span>
            <p>Animation, visual effects, CGI &amp; digital media.</p>
          </div>
          <div className="education-row">
            <strong>Dalang Digital Studio</strong>
            <span>2023</span>
            <p>6-month VFX &amp; post-production internship.</p>
          </div>
          <div className="education-row">
            <strong>Courses &amp; Workshops</strong>
            <p>Videolabs · RifqiArt · Mindplace</p>
          </div>
          <p className="eyebrow accent skills-heading">CREATIVE TOOLKIT</p>
          <div className="skill-tags">
            {[
              "VFX & CGI",
              "Compositing",
              "3D Environment",
              "Video Editing",
              "Color Grading",
              "Storytelling",
              "Photography",
              "Web Development",
            ].map((skill) => <span key={skill}>{skill}</span>)}
          </div>
          <div className="software-row">
            {[
              ["pr", "Premiere Pro"],
              ["ae", "After Effects"],
              ["bl", "Blender"],
              ["ps", "Photoshop"],
              ["lr", "Lightroom"],
              ["cc", "CapCut"],
            ].map(([file, label]) => (
              <img
                key={file}
                src={`./Asset/svg/${file}.svg`}
                alt={label}
                title={label}
                loading="lazy"
                width="28"
                height="28"
              />
            ))}
          </div>
        </Reveal>
        <div className="process-panel">
          <Reveal><h3 className="panel-heading">FROM IDEA TO FINAL FRAME</h3></Reveal>
          <div className="process-list">
            <div className="process-track">
              <motion.div style={{ scaleY: enabled ? scrollYProgress : 1 }} />
            </div>
            {processSteps.map(([number, title, description], index) => (
              <Reveal
                className="process-row"
                delay={index * 0.035}
                key={number}
              >
                <span className="process-num display">{number}</span>
                <span className="process-node" />
                <div>
                  <h4>{title}</h4>
                  <p>{description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <Reveal className="quote-panel">
          <span className="quote-mark display">“</span>
          <blockquote>
            From concept<br />
            and storytelling,<br />
            <em>to cinematic<br />visuals.</em>
          </blockquote>
          <span className="handwriting">Sujoy Das</span>
          <div className="quote-bottom">
            LET’S MAKE<br />
            THE NEXT FRAME COUNT.
            <span className="quote-symbol" aria-hidden="true">✳</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Journey({ onProject }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="experience" className="journey section-wrap">
      <Reveal className="section-heading">
        <div>
          <span className="eyebrow">03 / THE JOURNEY</span>
          <h2>KEEP MOVING. KEEP CREATING<span className="accent">.</span></h2>
        </div>
        <a
          className="text-link"
          href="./Asset/cv/Sujoy Das_Editor_VFX.pdf.pdf"
          download
        >
          RESUME <Download size={16} />
        </a>
      </Reveal>
      <div className="journey-grid">
        <div className="experience-list">
          {experience.map((item, index) => (
            <Reveal
              className={`experience-row ${openIndex === index ? "is-open" : ""}`}
              key={item.title}
            >
              <button
                aria-expanded={openIndex === index}
                aria-controls={`job-${index}`}
                onClick={() => setOpenIndex((current) => current === index ? null : index)}
              >
                <span className="experience-date">{item.date}</span>
                <span>
                  <h3>{item.title}</h3>
                  <span className="experience-place">{item.place}</span>
                </span>
                {openIndex === index ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    id={`job-${index}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <p>{item.text}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </Reveal>
          ))}
        </div>
        <Reveal className="awards-panel">
          <p className="eyebrow">A FEW MILESTONES</p>
          <h3 className="display">
            LITTLE WINS.<br />
            <span className="accent">BIG MEANING.</span>
          </h3>
          <div className="award-list">
            {certificates.map((certificate, index) => (
              <button
                key={certificate.title}
                onClick={() =>
                  onProject({
                    ...certificate,
                    type: "image",
                    media: certificate.image,
                    category: "Certificate",
                    description: "Certificate and recognition from Sujoy Das’s portfolio.",
                  })
                }
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span>{certificate.title}<small>{certificate.year}</small></span>
                <ArrowUpRight size={19} />
              </button>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Contact({ onProject }) {
  const [draftReady, setDraftReady] = useState(false);
  const showreel = featuredProjects[0];

  const submitBrief = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const message = `Hi Sujoy Das, I am ${formData.get("name")}.\n\nProject type: ${formData.get("type")}\n${formData.get("message")}`;
    window.open(
      `https://wa.me/6287786923444?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
    setDraftReady(true);
  };

  return (
    <section id="contact" className="contact section-wrap">
      <div className="contact-grid">
        <Reveal className="contact-intro">
          <span className="eyebrow">04 / YOUR NEXT STORY</span>
          <h2 className="display">
            LET’S WORK<br />
            TOGETHER<span className="accent">.</span>
          </h2>
          <p>
            Have a story you want to bring to life?
            <br />
            Let us create something worth watching.
          </p>
          <a
            href="https://wa.me/6287786923444"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-cta"
          >
            <span className="round-arrow"><ArrowUpRight size={21} /></span>
            START A CONVERSATION
          </a>
        </Reveal>
        <Reveal className="contact-links" delay={0.1}>
          <a href="mailto:hello@sujoydas.in">
            <Mail />
            <span><small>EMAIL</small>hello@sujoydas.in</span>
            <ArrowUpRight size={16} />
          </a>
          <a
            href="https://www.instagram.com/dododididaw/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Instagram />
            <span><small>INSTAGRAM</small>@dododididaw</span>
            <ArrowUpRight size={16} />
          </a>
          <a href="tel:+6287786923444">
            <Phone />
            <span><small>PHONE / WHATSAPP</small>+62 877-8692-3444</span>
            <ArrowUpRight size={16} />
          </a>
          <div>
            <MapPin />
            <span><small>BASED IN</small>Indramayu, Indonesia</span>
          </div>
        </Reveal>
        <Reveal className="contact-reel" delay={0.2}>
          <button
            onClick={() => onProject(showreel)}
            aria-label="Play Sujoy Das design showreel"
          >
            <div className="reel-screen">
              <span className="reel-screen-top">
                SUJOY DAS®<span>DESIGN / SHOWREEL</span>
              </span>
              <MediaImage src={showreel?.image} alt="Sujoy Das design showreel" />
              <span className="reel-screen-title display">
                DESIGN THAT<br />
                <span>WORKS WELL.</span>
              </span>
              <span className="play-circle"><Play size={18} fill="currentColor" /></span>
            </div>
            <span className="reel-caption">EXPLORE MY SELECTED WORK.</span>
          </button>
        </Reveal>
      </div>
      <Reveal>
        <details className="project-brief">
          <summary>Tell me about your project <ArrowDown size={19} /></summary>
          <form onSubmit={submitBrief}>
            <label>
              Your name
              <input
                name="name"
                required
                placeholder="Name or brand"
                autoComplete="name"
                maxLength="100"
              />
            </label>
            <label>
              Project type
              <select name="type">
                <option>Film and video editing</option>
                <option>VFX &amp; CGI</option>
                <option>3D &amp; Compositing</option>
                <option>Commercial Content</option>
                <option>Photography</option>
                <option>Website</option>
                <option>Other collaboration</option>
              </select>
            </label>
            <label className="brief-message">
              About your project
              <textarea
                name="message"
                required
                rows="3"
                placeholder="Tell me about your idea, needs, and expected timeline…"
                maxLength="3000"
              />
            </label>
            <button className="solid-button" type="submit">
              Continue to WhatsApp <ArrowUpRight size={18} />
            </button>
            <p className="form-note" role="status">
              {draftReady
                ? "Message draft ready in WhatsApp. Tap Send there to start the conversation."
                : "Your brief will open as a WhatsApp message draft."}
            </p>
          </form>
        </details>
      </Reveal>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <a className="wordmark" href="#home">SUJOY DAS<span>®</span></a>
      <span>© {new Date().getFullYear()} SUJOY DAS. EVERY FRAME HAS A PURPOSE.</span>
      <div>
        <a
          href="https://www.youtube.com/@DuingZStudio"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="YouTube DuingZ Studio"
        >
          <Youtube size={17} />
        </a>
        <a
          href="https://www.instagram.com/dododididaw/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram dododididaw"
        >
          <Instagram size={17} />
        </a>
        <a href="#home" aria-label="Back to top"><ArrowUpRight size={18} /></a>
      </div>
    </footer>
  );
}
