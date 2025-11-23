import { useState, useEffect } from "react";
import {
  MOBILE_BREAKPOINT,
  TABS_BREAKPOINT,
  DESKTOP_BREAKPOINT,
} from "./constants";

export default function useMediaQuery() {
  const [width, setWidth] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 0,
  );

  useEffect(() => {
    function handleResize() {
      const w = window.innerWidth;
      setWidth((prev) => (prev === w ? prev : w));
    }
    window.addEventListener("resize", handleResize);
    // initial log
    console.log("width:", window.innerWidth);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = width <= MOBILE_BREAKPOINT;
  const isTablet = width > MOBILE_BREAKPOINT && width < DESKTOP_BREAKPOINT;
  const isDesktop = width >= DESKTOP_BREAKPOINT;
  const shortenTab = width <= TABS_BREAKPOINT;
  return { shortenTab, isTablet, isMobile, isDesktop };
}
