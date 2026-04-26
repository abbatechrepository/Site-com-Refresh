"use client";

import { useEffect, useState } from "react";

export function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsVisible(window.scrollY > 300);
    }

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  if (!isVisible) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Voltar ao topo da página"
      title="Voltar ao topo"
      className="
        fixed bottom-6 right-6 z-50
        flex h-12 w-12 items-center justify-center
        rounded-full
        bg-[#0c67ad] text-white
        shadow-lg shadow-black/20
        transition-all duration-300 ease-in-out
        hover:-translate-y-1 hover:bg-[#09558f] hover:shadow-xl
        focus:outline-none focus:ring-4 focus:ring-[#0c67ad]/30
        active:scale-95
        md:bottom-8 md:right-8
      "
    >
      <span className="text-2xl leading-none" aria-hidden="true">
        ↑
      </span>
    </button>
  );
}