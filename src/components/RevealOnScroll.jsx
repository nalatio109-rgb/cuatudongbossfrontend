
import React, { useEffect, useRef, useState } from "react";

export default function RevealOnScroll({
  children,
  animation = "fade-up",
  delay = 0,
  className = "",
  once = false, // Mặc định false: hiệu ứng kích hoạt cả khi load lại trang lẫn khi lướt lên lướt xuống
}) {
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    let observer = null;
    if (typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting || entry.intersectionRatio > 0) {
              setIsVisible(true);
              if (once && observer && element) {
                observer.unobserve(element);
              }
            } else if (!once) {
              // Khi cuộn ra khỏi tầm nhìn, reset lại để khi lướt lên/xuống trở lại thì hiệu ứng chuyển động lại tiếp tục hiện ra
              setIsVisible(false);
            }
          });
        },
        {
          threshold: 0.05,
          rootMargin: "0px 0px -30px 0px", // Kích hoạt mượt mà khi chạm tầm mắt
        }
      );

      observer.observe(element);
    } else {
      // Fallback an toàn cho trình duyệt không hỗ trợ IntersectionObserver
      setIsVisible(true);
    }

    return () => {
      if (observer) observer.disconnect();
    };
  }, [once]);

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
