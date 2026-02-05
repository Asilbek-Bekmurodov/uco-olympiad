type StepStatus = "active" | "done" | "default";

type StepProps = {
  id: number;
  title: string;
  desc: string;
  status: StepStatus;
};

import { FaCheck } from "react-icons/fa";

const StepNumber = ({ id, title, desc, status }: StepProps) => {
  const isActive = status === "active";
  const isDone = status === "done";

  return (
    <div className="flex gap-[1.6rem] items-center">
      {/* STEP ICON */}
      <div
        className={`
          w-[3.6rem] h-[3.6rem]
          flex items-center justify-center
          rounded-[1rem]
          shadow-element
          ${
            isActive
              ? "bg-main-gradient border border-border-active text-white"
              : isDone
                ? "bg-white text-green-500"
                : "bg-white text-purple-muted"
          }
        `}
      >
        {isDone ? (
          <FaCheck className="text-[1.6rem]" />
        ) : (
          <span className="font-bold text-[1.6rem]">{id}</span>
        )}
      </div>

      {/* TEXT */}
      <div>
        <h3
          className={`
            font-semibold text-[1.6rem]
            ${isActive ? "text-purple-dark" : "text-purple-muted"}
          `}
        >
          {title}
        </h3>
        <p className="text-purple-muted text-[1.2rem]">{desc}</p>
      </div>
    </div>
  );
};

export default StepNumber;
