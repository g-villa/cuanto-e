import { useEffect } from "react";

/**
 * Hook que corrige el comportamiento del teclado en iOS Safari.
 * Cuando el teclado aparece, iOS no reduce el viewport sino que lo superpone.
 * Este hook usa la Visual Viewport API para detectarlo y hacer scroll al elemento enfocado.
 */
export function useKeyboardFix() {
  useEffect(() => {
    if (!window.visualViewport) return;

    const handleResize = () => {
      const focused = document.activeElement;
      if (!focused || focused === document.body) return;

      // Espera que el teclado termine de aparecer
      requestAnimationFrame(() => {
        focused.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    };

    window.visualViewport.addEventListener("resize", handleResize);
    return () =>
      window.visualViewport.removeEventListener("resize", handleResize);
  }, []);
}
