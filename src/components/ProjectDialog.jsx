import { useContext, useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { MediaImage, MotionEnabledContext } from "./common";

const renderModes = [
  ["layout", "Layout"],
  ["solid", "Solid"],
  ["material", "Material"],
  ["lighting", "Lighting"],
  ["final", "Final render"],
];

export function ProjectDialog({ project, onClose }) {
  const dialogRef = useRef(null);
  const [mode, setMode] = useState("final");
  const [shotIndex, setShotIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [reloadId, setReloadId] = useState(0);
  const motionEnabled = useContext(MotionEnabledContext);
  const renderShot = project.type === "render" ? project.renders?.[shotIndex] : null;
  const mediaType = renderShot?.video
    ? "youtube"
    : renderShot?.drive
      ? "drive"
      : project.type;
  const mediaValue = renderShot?.video ?? renderShot?.drive ?? project.media;
  const driveId = typeof mediaValue === "string"
    ? mediaValue.match(/\/d\/([^/]+)/)?.[1] ?? mediaValue
    : "";
  const isEmbeddedMedia = ["youtube", "drive"].includes(mediaType);
  const availableModes = renderModes.filter(
    ([key]) => renderShot?.[key] && !(key === "solid" && renderShot.hideSolidMode),
  );
  const selectedMode = availableModes.find(([key]) => key === mode)?.[0]
    ?? availableModes[0]?.[0];
  const image = renderShot?.[selectedMode] ?? renderShot?.image ?? project.image;
  const embedId = mediaType === "youtube" ? mediaValue : driveId;
  const embedUrl = mediaType === "youtube"
    ? `https://www.youtube-nocookie.com/embed/${embedId}?autoplay=1&rel=0`
    : `https://drive.google.com/file/d/${embedId}/preview`;
  const sourceUrl = mediaType === "youtube"
    ? `https://www.youtube.com/watch?v=${embedId}`
    : mediaType === "drive"
      ? `https://drive.google.com/file/d/${driveId}/view`
      : project.type === "website"
        ? project.media || project.image
        : project.type === "render"
          ? image
          : project.media || project.image;

  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = [
        ...dialogRef.current.querySelectorAll(
          "button, a[href], input, select, textarea, iframe",
        ),
      ].filter((element) => !element.disabled && element.getClientRects().length);
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus?.();
    };
  }, [onClose]);

  useEffect(() => {
    if (!isEmbeddedMedia || loaded) return undefined;
    const timeout = window.setTimeout(() => setFailed(true), 14000);
    return () => window.clearTimeout(timeout);
  }, [isEmbeddedMedia, loaded, reloadId, embedId]);

  const changeShot = (index) => {
    setMode("final");
    setLoaded(false);
    setFailed(false);
    setShotIndex(index);
  };

  const retryEmbed = () => {
    setLoaded(false);
    setFailed(false);
    setReloadId((id) => id + 1);
  };

  return (
    <motion.div
      className="dialog-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.div
        ref={dialogRef}
        className="project-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        tabIndex="-1"
        initial={motionEnabled ? { y: 45, scale: 0.97 } : false}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="dialog-heading">
          <span className="eyebrow">
            {project.category} {project.year && ` / ${project.year}`}
          </span>
          <button onClick={onClose} className="icon-button" aria-label="Close work">
            <X />
          </button>
        </div>
        <div className={`dialog-media ${isEmbeddedMedia ? "" : "still"}`}>
          {isEmbeddedMedia ? (
            <>
              {!loaded && (
                <div className="media-loading" role="status">
                  {failed ? (
                    <>
                      <p>Preview could not be loaded. Open the original source to view it.</p>
                      <button className="outline-button" onClick={retryEmbed}>Try again</button>
                    </>
                  ) : (
                    <>
                      <span className={`loading-ring ${motionEnabled ? "" : "paused"}`} />
                      <p>Loading video…</p>
                    </>
                  )}
                </div>
              )}
              <iframe
                key={`${embedId}-${reloadId}`}
                src={embedUrl}
                title={project.title}
                width="1280"
                height="720"
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                onLoad={() => {
                  setLoaded(true);
                  setFailed(false);
                }}
                onError={() => setFailed(true)}
              />
            </>
          ) : (
            <MediaImage src={image} alt={project.title} priority />
          )}
        </div>

        {project.type === "render" && (availableModes.length > 0 || project.renders?.length > 1) && (
          <div className="render-controls">
            <div role="group" aria-label="Render stage">
              {availableModes.map(([key, label]) => (
                <button
                  key={key}
                  className={selectedMode === key ? "selected" : ""}
                  onClick={() => setMode(key)}
                  aria-pressed={selectedMode === key}
                >
                  {label}
                </button>
              ))}
            </div>
            {project.renders.length > 1 && (
              <div className="shot-controls">
                <button
                  className="icon-button"
                  aria-label="Previous shot"
                  onClick={() => changeShot((shotIndex - 1 + project.renders.length) % project.renders.length)}
                >
                  <ChevronLeft />
                </button>
                <span>SHOT {shotIndex + 1} / {project.renders.length}</span>
                <button
                  className="icon-button"
                  aria-label="Next shot"
                  onClick={() => changeShot((shotIndex + 1) % project.renders.length)}
                >
                  <ChevronRight />
                </button>
              </div>
            )}
          </div>
        )}

        <div className="dialog-description">
          <div>
            <h2 id="dialog-title">{project.title}</h2>
            {project.role && <span className="accent">{project.role}</span>}
            <p>{project.description}</p>
          </div>
          {sourceUrl && (
            <a className="outline-button" href={sourceUrl} target="_blank" rel="noopener noreferrer">
              {project.type === "website" ? "Visit website" : "Open original source"}
              <ArrowUpRight size={15} />
            </a>
          )}
        </div>
        {isEmbeddedMedia && (
          <p className="embed-note">
            If the video is restricted by its owner, use “Open original source.”
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}
