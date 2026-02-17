import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetCountdownQuery } from "../../services/userApi";
import { logout } from "../../features/auth/authSlice";
import type { RootState } from "../../app/store";
import Logo from "../../assets/site-logo.svg";

const formatTime = (value: number) => value.toString().padStart(2, "0");

interface HomeProps {
  onLogout: () => void;
}

const Home = ({ onLogout }: HomeProps) => {
  const dispatch = useDispatch();
  const role = useSelector((s: RootState) => s.auth.role);
  const token = useSelector((s: RootState) => s.auth.token);
  const { data } = useGetCountdownQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
    refetchOnFocus: true,
  });
  const [remaining, setRemaining] = useState<number | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const lastServerSeconds = useRef<number | null>(null);

  // Initialize countdown when new data arrives
  const totalSeconds = useMemo(() => {
    if (!data) return null;
    return (
      (((data.days ?? 0) * 24 + (data.hours ?? 0)) * 60 + (data.minutes ?? 0)) *
        60 +
      (data.seconds ?? 0)
    );
  }, [data?.days, data?.hours, data?.minutes, data?.seconds]);

  useEffect(() => {
    if (totalSeconds === null) return;
    if (lastServerSeconds.current === totalSeconds) return;
    lastServerSeconds.current = totalSeconds;
    const id = setTimeout(() => setRemaining(totalSeconds), 0);
    return () => clearTimeout(id);
  }, [totalSeconds]);
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
    data?.isStarted && (remaining ?? 0) === 0
      ? "Imtihon boshlandi!"
      : (data?.message ?? "Yuklanmoqda...");

  const handleLogout = () => {
    dispatch(logout());
    onLogout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f9ff] to-[#eef1ff] px-4 pb-4 py-2">
      {/* Header */}
      <header className=" flex items-center justify-between mb-6 bg-white p-3 rounded-4xl">
        <div className="flex items-center gap-3">
          <img className="w-20" src={Logo} alt="" />
        </div>

        <div className="relative">
          <button
            onClick={() => setDropdownOpen((p) => !p)}
            className="w-6 h-6 rounded-full bg-gradient-to-r from-[#6b7bff] to-[#4b32ff] text-white font-semibold shadow-[0_18px_32px_-18px_rgba(75,59,255,0.55)] flex items-center justify-center focus:outline-none"
          >
            {role ? role[0]?.toUpperCase() : "U"}
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-3 w-38 bg-white border border-[#e8eafc] rounded-2xl shadow-[0_20px_50px_-26px_rgba(44,52,106,0.45)] overflow-hidden">
              <div className="px-4 py-3 text-2xl text-[#2f2f4d] border-b border-[#f1f2ff]">
                Rol: {role ?? "no role"}
              </div>
              <button className="w-full text-left px-4 py-3 text-2xl text-[#3c3c55] hover:bg-[#f6f7ff]">
                Profile settings
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-2xl text-red-500 hover:bg-[#fef2f2]"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <div className="mx-auto w-[900px]">
        <div className="bg-white border border-[#eef0ff] rounded-[2.8rem] shadow-[0_30px_60px_-30px_rgba(35,46,120,0.45)] p-[3.2rem] px-5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-[2.4rem] font-semibold text-[#24195a]">
                Imtihon sanog‘i
              </h2>
              {token && (
                <p className="text-[1.1rem] text-[#a1a5c6] mt-1">
                  Token bor, sahifa himoyalangan.
                </p>
              )}
            </div>
            {/* <button
              onClick={() => refetch()}
              className="text-[1.6rem] text-[#4f46e5] font-semibold hover:underline"
              disabled={isFetching}
            >
              {isFetching ? "Yangilanmoqda..." : "Yangilash"}
            </button> */}
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

            <p className="mt-5 text-center text-[2rem] font-medium">
              {statusText}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

// ====================================================================


// import { useEffect, useMemo, useRef, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useGetCountdownQuery } from "../../services/userApi";
// import { logout } from "../../features/auth/authSlice";
// import type { RootState } from "../../app/store";
// import Logo from "../../assets/site-logo.svg";

// const formatTime = (value: number) => value.toString().padStart(2, "0");

// interface HomeProps {
//   onLogout: () => void;
// }

// const Home = ({ onLogout }: HomeProps) => {
//   const dispatch = useDispatch();
//   const role = useSelector((s: RootState) => s.auth.role);
//   const token = useSelector((s: RootState) => s.auth.token);
//   const { data } = useGetCountdownQuery(undefined, {
//     refetchOnMountOrArgChange: true,
//     refetchOnReconnect: true,
//     refetchOnFocus: true,
//   });
//   const [remaining, setRemaining] = useState<number | null>(null);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const lastServerSeconds = useRef<number | null>(null);

//   const totalSeconds = useMemo(() => {
//     if (!data) return null;
//     return (
//       (((data.days ?? 0) * 24 + (data.hours ?? 0)) * 60 + (data.minutes ?? 0)) *
//         60 +
//       (data.seconds ?? 0)
//     );
//   }, [data?.days, data?.hours, data?.minutes, data?.seconds]);

//   useEffect(() => {
//     if (totalSeconds === null) return;
//     if (lastServerSeconds.current === totalSeconds) return;
//     lastServerSeconds.current = totalSeconds;
//     const id = setTimeout(() => setRemaining(totalSeconds), 0);
//     return () => clearTimeout(id);
//   }, [totalSeconds]);

//   useEffect(() => {
//     if (remaining === null) return;
//     if (remaining <= 0) return;
//     const id = setInterval(() => {
//       setRemaining((prev) => (prev === null ? null : Math.max(0, prev - 1)));
//     }, 1000);
//     return () => clearInterval(id);
//   }, [remaining]);

//   const breakdown = useMemo(() => {
//     const total = remaining ?? 0;
//     const days = Math.floor(total / (24 * 3600));
//     const hours = Math.floor((total % (24 * 3600)) / 3600);
//     const minutes = Math.floor((total % 3600) / 60);
//     const seconds = total % 60;
//     return { days, hours, minutes, seconds };
//   }, [remaining]);

//   const statusText =
//     data?.isStarted && (remaining ?? 0) === 0
//       ? "Imtihon boshlandi!"
//       : (data?.message ?? "Yuklanmoqda...");

//   const handleLogout = () => {
//     dispatch(logout());
//     onLogout();
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-[#f8f9ff] to-[#eef1ff] px-[400px] pb-4 py-2 flex flex-col md:flex-col items-center justify-center md:items-stretch">
//       {/* Header */}
//       <header className="flex flex-col sm:flex-row items-center sm:items-center justify-between w-full max-w-[95%] md:max-w-[900px] mb-6 bg-white p-3 rounded-4xl ">
//         <div className="flex items-center gap-3 mb-2 sm:mb-0">
//           <img className="w-20" src={Logo} alt="Logo" />
//         </div>

//         <div className="relative">
//           <button
//             onClick={() => setDropdownOpen((p) => !p)}
//             className="w-6 h-6 rounded-full bg-gradient-to-r from-[#6b7bff] to-[#4b32ff] text-white font-semibold shadow-[0_18px_32px_-18px_rgba(75,59,255,0.55)] flex items-center justify-center focus:outline-none"
//           >
//             {role ? role[0]?.toUpperCase() : "U"}
//           </button>
//           {dropdownOpen && (
//             <div className="absolute right-0 mt-3 w-38 bg-white border border-[#e8eafc] rounded-2xl shadow-[0_20px_50px_-26px_rgba(44,52,106,0.45)] overflow-hidden z-50">
//               <div className="px-4 py-3 text-2xl text-[#2f2f4d] border-b border-[#f1f2ff]">
//                 Rol: {role ?? "no role"}
//               </div>
//               <button className="w-full text-left px-4 py-3 text-2xl text-[#3c3c55] hover:bg-[#f6f7ff]">
//                 Profile settings
//               </button>
//               <button
//                 onClick={handleLogout}
//                 className="w-full text-left px-4 py-3 text-2xl text-red-500 hover:bg-[#fef2f2]"
//               >
//                 Log out
//               </button>
//             </div>
//           )}
//         </div>
//       </header>

//       {/* Main content */}
//       <div className="w-full max-w-[900px]">
//         <div className="bg-white border border-[#eef0ff] rounded-[2.8rem] shadow-[0_30px_60px_-30px_rgba(35,46,120,0.45)] p-[3.2rem] sm:p-[2rem]">
//           <div className="flex flex-col md:flex-row items-center md:items-start justify-between mb-6">
//             <div className="text-center md:text-left">
//               <h2 className="text-[2.4rem] font-semibold text-[#24195a]">
//                 Imtihon sanog‘i
//               </h2>
//               {token && (
//                 <p className="text-[1.1rem] text-[#a1a5c6] mt-1">
//                   Token bor, sahifa himoyalangan.
//                 </p>
//               )}
//             </div>
//           </div>

//           <div className="bg-gradient-to-r from-[#6b7bff] to-[#4b32ff] text-white rounded-[2rem] p-6 shadow-[0_20px_44px_-18px_rgba(75,59,255,0.65)]">
//             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
//               <div>
//                 <div className="text-[3rem] font-bold leading-none">
//                   {formatTime(breakdown.days)}
//                 </div>
//                 <p className="text-2xl opacity-80">Kun</p>
//               </div>
//               <div>
//                 <div className="text-[3rem] font-bold leading-none">
//                   {formatTime(breakdown.hours)}
//                 </div>
//                 <p className="text-2xl opacity-80">Soat</p>
//               </div>
//               <div>
//                 <div className="text-[3rem] font-bold leading-none">
//                   {formatTime(breakdown.minutes)}
//                 </div>
//                 <p className="text-2xl opacity-80">Daqiqa</p>
//               </div>
//               <div>
//                 <div className="text-[3rem] font-bold leading-none">
//                   {formatTime(breakdown.seconds)}
//                 </div>
//                 <p className="text-2xl opacity-80">Soniya</p>
//               </div>
//             </div>

//             <p className="mt-5 text-center text-[2rem] font-medium">
//               {statusText}
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;
