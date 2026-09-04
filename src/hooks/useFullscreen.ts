import { useState, useEffect, useCallback, type RefObject } from "react";

export function useFullscreen(ref: RefObject<HTMLElement | null>) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(document.fullscreenElement === ref.current);
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [ref]);

  const enter = useCallback(async () => {
    if (!ref.current || document.fullscreenElement) return;

    await ref.current.requestFullscreen();
  }, [ref]);

  const exit = useCallback(async () => {
    if (!document.fullscreenElement) return;

    await document.exitFullscreen();
  }, []);

  const toggle = useCallback(() => {
    if (document.fullscreenElement) {
      exit();
      return;
    }

    enter();
  }, [enter, exit]);

  return { isFullscreen, enter, exit, toggle };
}
