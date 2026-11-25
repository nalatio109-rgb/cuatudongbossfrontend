
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

    // Nếu trình duyệt hỗ trợ IntersectionObserver (mọi điện thoại hiện đại),
    // kích hoạt hiệu ứng khi người dùng thực sự cuộn tới phần tử đó
    let observer = null;
    if (typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting || entry.intersectionRatio > 0) {
            setIsVisible(true);
            if (observer && element) {
              observer.unobserve(element);
            }
          }
        },
        {
          threshold: 0.05,
          rootMargin: "0px 0px -40px 0px", // Kích hoạt khi phần tử tiệm cận tầm mắt màn hình
        }
      );

      observer.observe(element);
    } else {
      // Fallback an toàn cho trình duyệt quá cũ không có IntersectionObserver
      setIsVisible(true);
    }

    return () => {
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
