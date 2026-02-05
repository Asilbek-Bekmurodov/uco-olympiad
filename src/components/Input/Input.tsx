import React from "react";

interface InputProps {
  label: string;
  type?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({
  label,
  type = "text",
  placeholder,
  icon,
  onChange,
}) => {
  return (
    <div className="mb-[2rem]">
      <label className="block mb-[0.8rem] text-[1.4rem] font-medium">
        {label}
      </label>

      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          onChange={onChange}
          className="
            w-full
            h-[5.2rem]
            px-[1.6rem]
            border
            border-gray-300
            rounded-[1.2rem]
            outline-none
            focus:border-purple-500
          "
        />

        {icon && (
          <span className="absolute right-[1.6rem] top-1/2 -translate-y-1/2">
            {icon}
          </span>
        )}
      </div>
    </div>
  );
};

export default Input;
