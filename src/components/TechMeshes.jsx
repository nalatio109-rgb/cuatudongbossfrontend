import React, { useEffect, useState } from "react";

export default function TechMeshes() {
  const [stage, setStage] = useState("hidden");

  useEffect(() => {
    const handleScroll = () => {
      const productsEl = document.getElementById("products");
      const projectsEl = document.getElementById("projects");

      if (!productsEl || !projectsEl) return;

      const productsRect = productsEl.getBoundingClientRect();
      const projectsRect = projectsEl.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Trigger stage based on viewport position
      if (projectsRect.top <= windowHeight * 0.75 && projectsRect.bottom >= 0) {
        setStage("projects");
      } else if (productsRect.top <= windowHeight * 0.85 && productsRect.bottom >= 100) {
        setStage("products");
      } else if (projectsRect.bottom < 0) {
        setStage("past");
      } else {
        setStage("hidden");
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`tech-meshes-container stage-${stage}`}>
      {/* Left Mesh: Starts Top-Left at Products -> Moves Down & Right to Bottom-Right at Projects */}
      <div className="mesh-item mesh-item-left">
        <svg xmlns="http://www.w3.org/2000/svg" width="200" height="260" viewBox="0 0 300 400">
          <g stroke="#004d32" strokeWidth="0.6" fill="none">
            <polygon points="30,50 180,80 80,160" fill="#10b981" fillOpacity="0.08" stroke="none" />
            <polygon points="180,80 250,130 80,160" fill="#004d32" fillOpacity="0.02" stroke="none" />
            <polygon points="80,160 150,220 50,280" fill="#059669" fillOpacity="0.11" stroke="none" />
            <polygon points="150,220 280,320 250,130" fill="#10b981" fillOpacity="0.05" stroke="none" />
            <polygon points="50,280 150,220 120,360" fill="#34d399" fillOpacity="0.09" stroke="none" />
            <line x1="30" y1="50" x2="180" y2="80" strokeOpacity="0.45" />
            <line x1="180" y1="80" x2="80" y2="160" strokeOpacity="0.45" />
            <line x1="80" y1="160" x2="30" y2="50" strokeOpacity="0.45" />
            <line x1="180" y1="80" x2="250" y2="130" strokeOpacity="0.45" />
            <line x1="250" y1="130" x2="80" y2="160" strokeOpacity="0.45" />
            <line x1="80" y1="160" x2="150" y2="220" strokeOpacity="0.45" />
            <line x1="150" y1="220" x2="50" y2="280" strokeOpacity="0.45" />
            <line x1="50" y1="280" x2="80" y2="160" strokeOpacity="0.45" />
            <line x1="250" y1="130" x2="150" y2="220" strokeOpacity="0.45" />
            <line x1="150" y1="220" x2="280" y2="320" strokeOpacity="0.45" />
            <line x1="280" y1="320" x2="250" y2="130" strokeOpacity="0.45" />
            <line x1="50" y1="280" x2="120" y2="360" strokeOpacity="0.45" />
            <line x1="120" y1="360" x2="150" y2="220" strokeOpacity="0.45" />
            <line x1="280" y1="320" x2="120" y2="360" strokeOpacity="0.45" />
            <line x1="30" y1="50" x2="-10" y2="-10" strokeOpacity="0.45" />
            <line x1="250" y1="130" x2="320" y2="100" strokeOpacity="0.45" />
            <line x1="50" y1="280" x2="-20" y2="250" strokeOpacity="0.45" />
            <line x1="120" y1="360" x2="100" y2="420" strokeOpacity="0.45" />
            <circle cx="30" cy="50" r="3.5" strokeOpacity="0.6" />
            <circle cx="30" cy="50" r="1" fill="#004d32" fillOpacity="0.7" stroke="none" />
            <circle cx="180" cy="80" r="3.5" strokeOpacity="0.6" />
            <circle cx="180" cy="80" r="1" fill="#004d32" fillOpacity="0.7" stroke="none" />
            <circle cx="80" cy="160" r="3.5" strokeOpacity="0.6" />
            <circle cx="80" cy="160" r="1" fill="#004d32" fillOpacity="0.7" stroke="none" />
            <circle cx="250" cy="130" r="3.5" strokeOpacity="0.6" />
            <circle cx="250" cy="130" r="1" fill="#004d32" fillOpacity="0.7" stroke="none" />
            <circle cx="50" cy="280" r="3.5" strokeOpacity="0.6" />
            <circle cx="50" cy="280" r="1" fill="#004d32" fillOpacity="0.7" stroke="none" />
            <circle cx="150" cy="220" r="3.5" strokeOpacity="0.6" />
            <circle cx="150" cy="220" r="1" fill="#004d32" fillOpacity="0.7" stroke="none" />
            <circle cx="280" cy="320" r="3.5" strokeOpacity="0.6" />
            <circle cx="280" cy="320" r="1" fill="#004d32" fillOpacity="0.7" stroke="none" />
            <circle cx="120" cy="360" r="3.5" strokeOpacity="0.6" />
            <circle cx="120" cy="360" r="1" fill="#004d32" fillOpacity="0.7" stroke="none" />
          </g>
        </svg>
      </div>

      {/* Right Mesh: Starts Top-Right at Products -> Moves Down & Left to Bottom-Left at Projects */}
      <div className="mesh-item mesh-item-right">
        <svg xmlns="http://www.w3.org/2000/svg" width="200" height="260" viewBox="0 0 300 400">
          <g stroke="#004d32" strokeWidth="0.6" fill="none">
            <polygon points="30,50 180,80 80,160" fill="#10b981" fillOpacity="0.08" stroke="none" />
            <polygon points="180,80 250,130 80,160" fill="#004d32" fillOpacity="0.02" stroke="none" />
            <polygon points="80,160 150,220 50,280" fill="#059669" fillOpacity="0.11" stroke="none" />
            <polygon points="150,220 280,320 250,130" fill="#10b981" fillOpacity="0.05" stroke="none" />
            <polygon points="50,280 150,220 120,360" fill="#34d399" fillOpacity="0.09" stroke="none" />
            <line x1="30" y1="50" x2="180" y2="80" strokeOpacity="0.45" />
            <line x1="180" y1="80" x2="80" y2="160" strokeOpacity="0.45" />
            <line x1="80" y1="160" x2="30" y2="50" strokeOpacity="0.45" />
            <line x1="180" y1="80" x2="250" y2="130" strokeOpacity="0.45" />
            <line x1="250" y1="130" x2="80" y2="160" strokeOpacity="0.45" />
            <line x1="80" y1="160" x2="150" y2="220" strokeOpacity="0.45" />
            <line x1="150" y1="220" x2="50" y2="280" strokeOpacity="0.45" />
            <line x1="50" y1="280" x2="80" y2="160" strokeOpacity="0.45" />
            <line x1="250" y1="130" x2="150" y2="220" strokeOpacity="0.45" />
            <line x1="150" y1="220" x2="280" y2="320" strokeOpacity="0.45" />
            <line x1="280" y1="320" x2="250" y2="130" strokeOpacity="0.45" />
            <line x1="50" y1="280" x2="120" y2="360" strokeOpacity="0.45" />
            <line x1="120" y1="360" x2="150" y2="220" strokeOpacity="0.45" />
            <line x1="280" y1="320" x2="120" y2="360" strokeOpacity="0.45" />
            <line x1="30" y1="50" x2="-10" y2="-10" strokeOpacity="0.45" />
            <line x1="250" y1="130" x2="320" y2="100" strokeOpacity="0.45" />
            <line x1="50" y1="280" x2="-20" y2="250" strokeOpacity="0.45" />
            <line x1="120" y1="360" x2="100" y2="420" strokeOpacity="0.45" />
            <circle cx="30" cy="50" r="3.5" strokeOpacity="0.6" />
            <circle cx="30" cy="50" r="1" fill="#004d32" fillOpacity="0.7" stroke="none" />
            <circle cx="180" cy="80" r="3.5" strokeOpacity="0.6" />
            <circle cx="180" cy="80" r="1" fill="#004d32" fillOpacity="0.7" stroke="none" />
            <circle cx="80" cy="160" r="3.5" strokeOpacity="0.6" />
            <circle cx="80" cy="160" r="1" fill="#004d32" fillOpacity="0.7" stroke="none" />
            <circle cx="250" cy="130" r="3.5" strokeOpacity="0.6" />
            <circle cx="250" cy="130" r="1" fill="#004d32" fillOpacity="0.7" stroke="none" />
            <circle cx="50" cy="280" r="3.5" strokeOpacity="0.6" />
            <circle cx="50" cy="280" r="1" fill="#004d32" fillOpacity="0.7" stroke="none" />
            <circle cx="150" cy="220" r="3.5" strokeOpacity="0.6" />
            <circle cx="150" cy="220" r="1" fill="#004d32" fillOpacity="0.7" stroke="none" />
            <circle cx="280" cy="320" r="3.5" strokeOpacity="0.6" />
            <circle cx="280" cy="320" r="1" fill="#004d32" fillOpacity="0.7" stroke="none" />
            <circle cx="120" cy="360" r="3.5" stroke-opacity="0.6" />
            <circle cx="120" cy="360" r="1" fill="#004d32" fillOpacity="0.7" stroke="none" />
          </g>
        </svg>
      </div>
    </div>
  );
}
