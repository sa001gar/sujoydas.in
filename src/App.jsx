import { useCallback, useEffect, useState } from "react";
import { MotionConfig, motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { MotionEnabledContext } from "./components/common";
import { ProjectDialog } from "./components/ProjectDialog";
import { Portfolio } from "./components/Portfolio";
import { About, Breakdown, Contact, Footer, Journey, Recognition } from "./components/Sections";
import { Hero, SiteHeader } from "./components/SiteChrome";

function readMotionPreference() {
  try {
    return window.localStorage.getItem("sujoydas-motion") !== "off";
  } catch {
    return true;
  }
}

export default function App() {
  const prefersReducedMotion = useReducedMotion();
  const [motionPreference, setMotionPreference] = useState(readMotionPreference);
  const [activeProject, setActiveProject] = useState(null);
  const motionEnabled = motionPreference && !prefersReducedMotion;
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 28,
    restDelta: 0.001,
  });

  useEffect(() => {
    document.documentElement.dataset.motion = motionEnabled ? "on" : "off";
  }, [motionEnabled]);

  const toggleMotion = () => {
    setMotionPreference((current) => {
      const next = !current;
      try {
        window.localStorage.setItem("sujoydas-motion", next ? "on" : "off");
      } catch {
        // Motion preference still applies for this page view when storage is unavailable.
      }
      return next;
    });
  };
  const closeProject = useCallback(() => setActiveProject(null), []);

  return (
    <MotionEnabledContext.Provider value={motionEnabled}>
      <MotionConfig
        reducedMotion={motionEnabled ? "user" : "always"}
        transition={{ ease: [0.22, 1, 0.36, 1] }}
      >
        <a className="skip-link" href="#portfolio">Skip to work</a>
        <motion.div
          className="reading-progress"
          style={{ scaleX: motionEnabled ? smoothProgress : scrollYProgress }}
        />
        <SiteHeader motionEnabled={motionEnabled} onMotionToggle={toggleMotion} />
        <main>
          <Hero onProject={setActiveProject} />
          <Portfolio onProject={setActiveProject} />
          <Recognition onProject={setActiveProject} />
          <Breakdown />
          <About />
          <Journey onProject={setActiveProject} />
          <Contact onProject={setActiveProject} />
        </main>
        <Footer />
        <AnimatePresence>
          {activeProject && (
            <ProjectDialog
              key={`${activeProject.title}-${activeProject.category}`}
              project={activeProject}
              onClose={closeProject}
            />
          )}
        </AnimatePresence>
      </MotionConfig>
    </MotionEnabledContext.Provider>
  );
}
