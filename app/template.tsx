"use client";
import { useEffect } from "react";
export default function Template({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Function to handle scroll animations
    const handleAnimations = () => {
      const animatedElements = document.querySelectorAll(".animate-on-scroll");

      animatedElements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (elementTop < windowHeight * 0.9) {
          element.classList.add("animate-fade-in");
          element.classList.remove("opacity-0");
        }
      });
    };

    // Initial check for elements in view
    handleAnimations();

    // Add scroll event listener
    window.addEventListener("scroll", handleAnimations);

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleAnimations);
    };
  }, []);

  return <div>{children}</div>;
}
