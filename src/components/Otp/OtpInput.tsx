import { useEffect, useRef } from "react";

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (val: string) => void;
}

const OtpInput = ({ length = 6, value, onChange }: OtpInputProps) => {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  // Keep refs length in sync
  useEffect(() => {
    inputsRef.current = inputsRef.current.slice(0, length);
  }, [length]);

  const focusInput = (idx: number) => {
    const input = inputsRef.current[idx];
    input?.focus();
    input?.select();
  };

  const handleChange = (digit: string, idx: number) => {
    const clean = digit.replace(/\D/g, "").slice(0, 1);
    const chars = value.padEnd(length, " ").split("");
    chars[idx] = clean;
    const nextValue = chars.join("").trimEnd();
    onChange(nextValue);
    if (clean && idx < length - 1) focusInput(idx + 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    const isBackspace = e.key === "Backspace";
    if (isBackspace && !value[idx] && idx > 0) {
      e.preventDefault();
      const chars = value.padEnd(length, " ").split("");
      chars[idx - 1] = "";
      onChange(chars.join("").trimEnd());
      focusInput(idx - 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    onChange(pasted);
    const targetIndex = Math.min(pasted.length, length - 1);
    focusInput(targetIndex);
  };

  return (
    <div className="flex justify-between gap-2 md:gap-3">
      {Array.from({ length }).map((_, idx) => (
        <input
          key={idx}
          ref={(el) => (inputsRef.current[idx] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[idx] ?? ""}
          onChange={(e) => handleChange(e.target.value, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          onPaste={handlePaste}
          className="w-12 h-14 md:w-13 md:h-15 rounded-[1.4rem] border border-[#e7e9ff] bg-white text-center text-base md:text-lg font-semibold text-[#3a3a4d] shadow-[0_10px_26px_-18px_rgba(66,71,112,0.38)] focus:outline-none focus:border-[#6C4DFF] focus:shadow-[0_12px_30px_-18px_rgba(108,77,255,0.5)] transition"
        />
      ))}
    </div>
  );
};

export default OtpInput;
