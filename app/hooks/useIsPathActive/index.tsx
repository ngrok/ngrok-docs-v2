import { useLocation } from "@remix-run/react";
import { useState, useEffect } from "react";
import { doNormalizedPathsMatch } from "~/utils/redirects/pathMethods";

export function useIsPathActive(pathToCheck: string | undefined): boolean {
  if (!pathToCheck) return false; // If no path is provided, return false immediately
  const { pathname } = useLocation();  
  const [isPathActive, setIsPathActive] = useState(doNormalizedPathsMatch(pathToCheck, pathname));

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setIsPathActive(doNormalizedPathsMatch(pathToCheck, pathname));
  }, [pathToCheck, pathname]);

  return isPathActive;
}