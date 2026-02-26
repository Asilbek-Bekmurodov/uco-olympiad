import type { ReactNode } from "react";

type TimerBreakdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

type TimerCardProps = {
  breakdown: TimerBreakdown;
  status: ReactNode;
  formatTime: (value: number) => string;
};

const TimerCard = ({ breakdown, status, formatTime }: TimerCardProps) => {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[2.4rem] font-semibold text-[#24195a]">
            Imtihon sanog‘i
          </h2>
        </div>
      </div>
      <div className="bg-gradient-to-r from-[#6b7bff] to-[#4b32ff] text-white rounded-[2rem] p-6 shadow-[0_20px_44px_-18px_rgba(75,59,255,0.65)]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-[3rem] font-bold leading-none">
              {formatTime(breakdown.days)}
            </div>
            <p className="text-2xl opacity-80">Kun</p>
          </div>
          <div>
            <div className="text-[3rem] font-bold leading-none">
              {formatTime(breakdown.hours)}
            </div>
            <p className="text-2xl opacity-80">Soat</p>
          </div>
          <div>
            <div className="text-[3rem] font-bold leading-none">
              {formatTime(breakdown.minutes)}
            </div>
            <p className="text-2xl opacity-80">Daqiqa</p>
          </div>
          <div>
            <div className="text-[3rem] font-bold leading-none">
              {formatTime(breakdown.seconds)}
            </div>
            <p className="text-2xl opacity-80">Soniya</p>
          </div>
        </div>

        <div className="mt-5 text-center text-[2rem] font-medium">{status}</div>
      </div>
    </>
  );
};

export default TimerCard;
