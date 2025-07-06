"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ScrollIndicatorProps {
  totalSections: number;
}

export default function ScrollIndicator({ totalSections }: ScrollIndicatorProps) {
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const newActiveSection = Math.floor((scrollPosition + windowHeight / 2) / windowHeight);
      setActiveSection(newActiveSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDotClick = (index: number) => {
    const sectionElement = document.getElementById(`section-${index}`);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50">
      <div className="flex flex-col gap-3">
        {Array.from({ length: totalSections }).map((_, index) => (
          <motion.button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              activeSection === index 
                ? "bg-white shadow-lg shadow-pink-300/50 scale-150" 
                : "bg-white/50"
            }`}
            whileHover={{ scale: 1.4 }}
            whileTap={{ scale: 0.9 }}
            aria-label={`Ir para seção ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}