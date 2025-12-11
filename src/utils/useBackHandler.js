import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * Custom hook to handle browser back button and swipe gestures
 * - On home page: allows default browser behavior (exit to previous site)
 * - On other pages: navigates back within the app
 */
export function useBackHandler(isHomePage = false) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handlePopState = (event) => {
      // If on home page, let browser handle it naturally (will exit app)
      if (isHomePage) {
        return;
      }

      // On other pages, prevent default and navigate within app
      event.preventDefault();
      navigate(-1);
    };

    // Listen to popstate event (triggered by back button/swipe)
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isHomePage, navigate, location]);
}
