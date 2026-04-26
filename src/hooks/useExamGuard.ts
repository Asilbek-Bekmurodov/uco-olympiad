import { useEffect, useRef } from "react";

interface Options {
  onViolation: () => void;
}

export function useExamGuard({ onViolation }: Options) {
  const violatedRef = useRef(false);

  const triggerViolation = () => {
    if (violatedRef.current) return;
    violatedRef.current = true;
    onViolation();
  };

  useEffect(() => {
    // ── Fullscreen ──────────────────────────────────────────────
    const enterFullscreen = () => {
      const el = document.documentElement;
      if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
    };
    enterFullscreen();

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) triggerViolation();
    };

    // ── Tab / window visibility ──────────────────────────────────
    const handleVisibility = () => {
      if (document.visibilityState === "hidden") triggerViolation();
    };

    const handleBlur = () => triggerViolation();

    // ── Keyboard blocking ────────────────────────────────────────
    const BLOCKED_KEYS = new Set([
      "F1","F2","F3","F4","F5","F6","F7","F8","F9","F10","F11","F12",
    ]);

    const handleKeyDown = (e: KeyboardEvent) => {
      // F-keys
      if (BLOCKED_KEYS.has(e.key)) { e.preventDefault(); e.stopPropagation(); return; }
      // Ctrl/Cmd combos
      if (e.ctrlKey || e.metaKey) {
        const k = e.key.toLowerCase();
        // block: C, X, V (copy/cut/paste), U (view-source), S (save),
        //        Shift+I, Shift+J, Shift+C (DevTools), Shift+K
        if (["c","x","v","u","s","a","p"].includes(k)) {
          e.preventDefault(); e.stopPropagation(); return;
        }
        if (e.shiftKey && ["i","j","c","k"].includes(k)) {
          e.preventDefault(); e.stopPropagation(); return;
        }
      }
      // Alt+F4, Alt+Tab
      if (e.altKey && ["F4","Tab"].includes(e.key)) {
        e.preventDefault(); e.stopPropagation();
      }
    };

    // ── Copy / paste / cut / context-menu ───────────────────────
    const block = (e: Event) => e.preventDefault();

    // ── DevTools size-based detection ────────────────────────────
    let devtoolsTimer: ReturnType<typeof setInterval>;
    const THRESHOLD = 160;
    const detectDevTools = () => {
      const widthDiff  = window.outerWidth  - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;
      if (widthDiff > THRESHOLD || heightDiff > THRESHOLD) triggerViolation();
    };
    devtoolsTimer = setInterval(detectDevTools, 1000);

    // ── Console override ─────────────────────────────────────────
    const noop = () => {};
    const originalLog   = console.log;
    const originalWarn  = console.warn;
    const originalError = console.error;
    const originalInfo  = console.info;
    const originalDebug = console.debug;
    console.log = console.warn = console.error = console.info = console.debug = noop;

    // ── Event listeners ──────────────────────────────────────────
    document.addEventListener("fullscreenchange",   handleFullscreenChange);
    document.addEventListener("visibilitychange",   handleVisibility);
    window  .addEventListener("blur",               handleBlur);
    document.addEventListener("keydown",            handleKeyDown,   { capture: true });
    document.addEventListener("copy",               block,           { capture: true });
    document.addEventListener("cut",                block,           { capture: true });
    document.addEventListener("paste",              block,           { capture: true });
    document.addEventListener("contextmenu",        block,           { capture: true });
    document.addEventListener("selectstart",        block,           { capture: true });

    return () => {
      clearInterval(devtoolsTimer);
      document.exitFullscreen?.().catch(() => {});

      document.removeEventListener("fullscreenchange",   handleFullscreenChange);
      document.removeEventListener("visibilitychange",   handleVisibility);
      window  .removeEventListener("blur",               handleBlur);
      document.removeEventListener("keydown",            handleKeyDown,   { capture: true });
      document.removeEventListener("copy",               block,           { capture: true });
      document.removeEventListener("cut",                block,           { capture: true });
      document.removeEventListener("paste",              block,           { capture: true });
      document.removeEventListener("contextmenu",        block,           { capture: true });
      document.removeEventListener("selectstart",        block,           { capture: true });

      console.log   = originalLog;
      console.warn  = originalWarn;
      console.error = originalError;
      console.info  = originalInfo;
      console.debug = originalDebug;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
