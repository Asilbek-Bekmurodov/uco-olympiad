import React from "react";

/* =======================
   TYPES
======================= */

interface FormInputProps {
  label: string;
  required?: boolean;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/* =======================
   COMPONENT
======================= */

const FormInput: React.FC<FormInputProps> = ({
  label,
  required = false,
  type = "text",
  placeholder,
  value,
  onChange,
}) => {
  return (
    <div>
      <label className="block text-[1.4rem] font-medium text-[#1C1C28] mb-[0.8rem]">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="
          w-full
          h-[5.6rem]
          px-[1.6rem]
          rounded-[1.6rem]
          border border-[#E6E6F0]
          text-[1.5rem]
          placeholder:text-[#9A9AAF]
          outline-none
          focus:border-[#6C4DFF]
        "
      />
    </div>
  );
};

export default FormInput;
