import { createContext, useContext, useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export const MotionEnabledContext = createContext(true);

export function Reveal({ as = "div", className = "", delay = 0, children, ...props }) {
  const enabled = useContext(MotionEnabledContext);
  const Component = motion[as] ?? motion.div;
  return (
    <Component
      className={className}
      initial={enabled ? { opacity: 0, y: 32 } : false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.12 }}
      transition={{ duration: enabled ? 0.75 : 0, delay, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {children}
    </Component>
  );
}

export function MediaImage({ src, alt, className = "", priority = false, ...props }) {
  const [status, setStatus] = useState("loading");
  const imageRef = useRef(null);

  useEffect(() => {
    const image = imageRef.current;
    setStatus(image?.complete ? (image.naturalWidth ? "loaded" : "error") : "loading");
  }, [src]);

  return (
    <span className={`media-image ${status} ${className}`}>
      {status === "error" && (
        <span className="image-fallback">
          <span className="display">S.</span>
          <span>Preview unavailable</span>
        </span>
      )}
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        width="960"
        height="600"
        onLoad={() => setStatus("loaded")}
        onError={(event) => {
          if (event.currentTarget.src.includes("maxresdefault.jpg")) {
            event.currentTarget.src = event.currentTarget.src.replace("maxresdefault.jpg", "hqdefault.jpg");
          } else {
            setStatus("error");
          }
        }}
        {...props}
      />
    </span>
  );
}

export function useParallax(ref, distance = 12) {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  return useTransform(scrollYProgress, [0, 1], [-distance, distance], {
    clamp: false,
  });
}
