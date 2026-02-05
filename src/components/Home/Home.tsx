import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetStatsQuery } from "../../services/userApi";
import { logout } from "../../features/auth/authSlice";
import type { RootState } from "../../app/store";

const formatTime = (value: number) => value.toString().padStart(2, "0");

interface HomeProps {
  onLogout: () => void;
}

const Home = ({ onLogout }: HomeProps) => {
  const dispatch = useDispatch();
  const role = useSelector((s: RootState) => s.auth.role);
  const token = useSelector((s: RootState) => s.auth.token);
  const { data, isFetching, refetch } = useGetStatsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
    refetchOnFocus: true,
  });
  const [remaining, setRemaining] = useState<number | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Initialize countdown when new data arrives
  useEffect(() => {
    if (!data) return;
    const totalSeconds =
      (((data.days ?? 0) * 24 + (data.hours ?? 0)) * 60 + (data.minutes ?? 0)) *
        60 +
      (data.seconds ?? 0);
    setRemaining((prev) => (prev === totalSeconds ? prev : totalSeconds));
  }, [data]);

  // Tick every second
  useEffect(() => {
    if (remaining === null) return;
    if (remaining <= 0) return;
    const id = setInterval(() => {
      setRemaining((prev) => (prev === null ? null : Math.max(0, prev - 1)));
    }, 1000);
    return () => clearInterval(id);
  }, [remaining]);

  const breakdown = useMemo(() => {
    const total = remaining ?? 0;
    const days = Math.floor(total / (24 * 3600));
    const hours = Math.floor((total % (24 * 3600)) / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;
    return { days, hours, minutes, seconds };
  }, [remaining]);

  const statusText =
    data?.isstarted && (remaining ?? 0) === 0
      ? "Imtihon boshlandi!"
      : (data?.message ?? "Yuklanmoqda...");

  const handleLogout = () => {
    dispatch(logout());
    onLogout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f9ff] to-[#eef1ff] px-4 py-8">
      {/* Header */}
      <header className="max-w-5xl mx-auto flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white shadow-[0_20px_60px_-24px_rgba(63,65,150,0.35)] flex items-center justify-center">
            <span className="text-xl font-bold text-[#4E46E5]">U</span>
          </div>
          <div>
            <div className="text-xl font-bold text-[#4735ff] leading-none">
              UCO
            </div>
            <div className="text-[0.8rem] uppercase tracking-[0.16em] text-[#7c82c6]">
              Coding Olympiad
            </div>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setDropdownOpen((p) => !p)}
            className="w-11 h-11 rounded-full bg-gradient-to-r from-[#6b7bff] to-[#4b32ff] text-white font-semibold shadow-[0_18px_32px_-18px_rgba(75,59,255,0.55)] flex items-center justify-center focus:outline-none"
          >
            {role ? role[0]?.toUpperCase() : "U"}
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-3 w-48 bg-white border border-[#e8eafc] rounded-2xl shadow-[0_20px_50px_-26px_rgba(44,52,106,0.45)] overflow-hidden">
              <div className="px-4 py-3 text-sm text-[#2f2f4d] border-b border-[#f1f2ff]">
                Rol: {role ?? "no role"}
              </div>
              <button className="w-full text-left px-4 py-3 text-sm text-[#3c3c55] hover:bg-[#f6f7ff]">
                Profile settings
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-[#fef2f2]"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-5xl mx-auto">
        <div className="w-full bg-white border border-[#eef0ff] rounded-[2.8rem] shadow-[0_30px_60px_-30px_rgba(35,46,120,0.45)] p-[3.2rem] md:p-[4rem]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[1.4rem] text-[#7d82a8]">
                Foydalanuvchi statistikasi
              </p>
              <h2 className="text-[2.4rem] font-semibold text-[#24195a]">
                Imtihon sanog‘i
              </h2>
              {token && (
                <p className="text-[1.1rem] text-[#a1a5c6] mt-1">
                  Token bor, sahifa himoyalangan.
                </p>
              )}
            </div>
            <button
              onClick={() => refetch()}
              className="text-[1.3rem] text-[#4f46e5] font-semibold hover:underline"
              disabled={isFetching}
            >
              {isFetching ? "Yangilanmoqda..." : "Yangilash"}
            </button>
          </div>

          <div className="bg-gradient-to-r from-[#6b7bff] to-[#4b32ff] text-white rounded-[2rem] p-6 shadow-[0_20px_44px_-18px_rgba(75,59,255,0.65)]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-[3rem] font-bold leading-none">
                  {formatTime(breakdown.days)}
                </div>
                <p className="text-sm opacity-80">Kun</p>
              </div>
              <div>
                <div className="text-[3rem] font-bold leading-none">
                  {formatTime(breakdown.hours)}
                </div>
                <p className="text-sm opacity-80">Soat</p>
              </div>
              <div>
                <div className="text-[3rem] font-bold leading-none">
                  {formatTime(breakdown.minutes)}
                </div>
                <p className="text-sm opacity-80">Daqiqa</p>
              </div>
              <div>
                <div className="text-[3rem] font-bold leading-none">
                  {formatTime(breakdown.seconds)}
                </div>
                <p className="text-sm opacity-80">Soniya</p>
              </div>
            </div>

            <p className="mt-5 text-center text-[1.4rem] font-medium">
              {statusText}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
