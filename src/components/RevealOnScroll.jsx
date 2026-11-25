
import React, { useEffect, useRef, useState } from "react";

export default function RevealOnScroll({
  children,
  animation = "fade-up",
  delay = 0,
  className = "",
}) {
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Safety fallback: Tự động hiển thị sau tối đa 600ms nếu observer chưa kích hoạt
    // Đảm bảo không bao giờ có phần tử nào bị kẹt ẩn (opacity: 0)
    const safetyTimer = setTimeout(() => {
      setIsVisible(true);
    }, 600);

    let observer = null;
    if (typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting || entry.intersectionRatio > 0) {
            setIsVisible(true);
            clearTimeout(safetyTimer);
            if (observer && element) {
              observer.unobserve(element);
            }
          }
        },
        {
          threshold: 0.01,
          rootMargin: "50px 0px 0px 0px",
        }
      );

      observer.observe(element);
    } else {
      setIsVisible(true);
    }

    return () => {
      clearTimeout(safetyTimer);
      if (observer) observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={elementRef}
      className={[
        "reveal-element",
        `reveal-${animation}`,
        isVisible ? "is-revealed" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        "--reveal-delay": `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
