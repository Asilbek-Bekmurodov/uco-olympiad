type StepBarProps = {
  status: "active" | "done" | "default";
};

const StepBar = ({ status }: StepBarProps) => {
  return (
    <div className="ml-[1.8rem] my-[0.8rem]">
      <div
        className={`
          w-[0.4rem] h-[3.2rem] rounded-full
          ${
            status === "done"
              ? "bg-main-gradient"
              : status === "active"
                ? "bg-purple-400"
                : "bg-purple-200"
          }
        `}
      />
    </div>
  );
};

export default StepBar;
