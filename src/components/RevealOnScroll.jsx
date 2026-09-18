import React, { useEffect, useRef, useState } from "react";

export default function RevealOnScroll({
  children,
  animation = "fade-up",
  delay = 0,
  duration = 750,
  threshold = 0.12,
  className = "",
  style = {}
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  const customStyle = {
    ...style,
    transitionDuration: `${duration}ms`,
    transitionDelay: `${delay}ms`
  };

  return (
    <div
      ref={ref}
      style={customStyle}
      className={`reveal-element reveal-${animation} ${isVisible ? "is-revealed" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
