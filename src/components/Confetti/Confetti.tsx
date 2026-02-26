"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

type ConfettiSideCannonsProps = {
  auto?: boolean;
  showButton?: boolean;
};

export function ConfettiSideCannons({
  auto = true,
  showButton = true,
}: ConfettiSideCannonsProps) {
  const handleClick = () => {
    const end = Date.now() + 3 * 1000; // 3 seconds
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

    const frame = () => {
      if (Date.now() > end) return;

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });

      requestAnimationFrame(frame);
    };

    frame();
  };

  useEffect(() => {
    if (auto) handleClick();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto]);

  return (
    <div className="relative">
      {showButton && (
        <button
          type="button"
          onClick={handleClick}
          className="px-4 py-2 rounded-md bg-blue-600 text-white font-semibold"
        >
          Trigger Side Cannons
        </button>
      )}
    </div>
  );
}
