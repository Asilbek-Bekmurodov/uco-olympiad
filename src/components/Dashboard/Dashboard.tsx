import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { logout } from "../../app/features/auth/authSlice";
import type { RootState } from "../../app/store";
import Logo from "../../assets/site-logo.svg";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const role = useSelector((s: RootState) => s.auth.role);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f7f8ff] to-[#e9ecff] px-4 pb-4 py-4">
      <div className="mx-auto flex w-full max-w-[1300px] gap-4">
        <aside className="w-[260px] shrink-0 rounded-[2.4rem] bg-white border border-[#ffecec] shadow-[0_20px_50px_-26px_rgba(145,46,46,0.2)] p-4">
          <div className="flex items-center gap-3 px-2 py-2">
            <img className="w-16" src={Logo} alt="" />
          </div>

          <nav className="mt-6 flex flex-col gap-2">
            <NavLink
              to="/dashboard/users"
              className={({ isActive }) =>
                [
                  "rounded-[1.2rem] px-3 py-2 text-[1.4rem] font-medium transition",
                  isActive
                    ? "bg-[#ffecec] text-[#b02020]"
                    : "text-[#5a4f4f] hover:bg-[#fff4f4]",
                ].join(" ")
              }
            >
              Users
            </NavLink>
            <NavLink
              to="/dashboard/exams"
              className={({ isActive }) =>
                [
                  "rounded-[1.2rem] px-3 py-2 text-[1.4rem] font-medium transition",
                  isActive
                    ? "bg-[#ffecec] text-[#b02020]"
                    : "text-[#5a4f4f] hover:bg-[#fff4f4]",
                ].join(" ")
              }
            >
              Exams
            </NavLink>
          </nav>
        </aside>

        <div className="flex-1">
          <header className="flex items-center justify-between mb-4 bg-white p-3 rounded-4xl border border-[#ffecec] shadow-[0_14px_34px_-24px_rgba(145,46,46,0.2)]">
            <div className="text-[1.6rem] font-semibold text-[#3b2f2f]">
              Dashboard
            </div>

            <div className="relative">
              <button
                onClick={() => setDropdownOpen((p) => !p)}
                className="w-6 h-6 rounded-full bg-gradient-to-r from-[#ff7b7b] to-[#ff3a3a] text-white font-semibold shadow-[0_18px_32px_-18px_rgba(255,59,59,0.55)] flex items-center justify-center focus:outline-none"
              >
                {role ? role[0]?.toUpperCase() : "A"}
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-38 bg-white border border-[#ffe8e8] rounded-2xl shadow-[0_20px_50px_-26px_rgba(140,52,52,0.35)] overflow-hidden">
                  <div className="px-4 py-3 text-2xl text-[#3b2f2f] border-b border-[#fff1f1]">
                    Rol: {role ?? "no role"}
                  </div>
                  <button className="w-full text-left px-4 py-3 text-2xl text-[#3c3c55] hover:bg-[#fff6f6]">
                    Admin settings
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

          <div className="rounded-[2.4rem] bg-white border border-[#ffecec] shadow-[0_20px_50px_-26px_rgba(145,46,46,0.2)] p-4">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
