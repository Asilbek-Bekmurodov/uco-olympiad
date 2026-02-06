import { useState } from "react";
import type { FormEvent } from "react";
import { useLoginUserMutation } from "../../services/authApi";
import { useAppDispatch } from "../../app/hooks";
import { setToken } from "../../features/auth/authSlice";

interface LoginProps {
  onSuccess: () => void;
  onBackToRegister?: () => void;
}

const Login = ({ onSuccess, onBackToRegister }: LoginProps) => {
  const dispatch = useAppDispatch();
  const [credentials, setCredentials] = useState({
    phoneNumber: "",
    password: "",
    remember: true,
  });
  const [loginUser, { isLoading }] = useLoginUserMutation();

  const handleChange = (
    key: "phoneNumber" | "password" | "remember",
    value: string | boolean
  ) => {
    setCredentials((prev) => ({ ...prev, [key]: value }));
  };

  const submitLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await loginUser({
        phoneNumber: credentials.phoneNumber,
        // Some backends expect `username`, mirror the phone there too
        username: credentials.phoneNumber,
        password: credentials.password,
      }).unwrap();
      const token =
        res?.token ??
        res?.accessToken ??
        res?.jwt ??
        (res as any)?.data?.token ??
        (res as any)?.data?.accessToken ??
        (res as any)?.data?.jwt;
      const role =
        (res as any)?.role ??
        (res as any)?.data?.role ??
        (res as any)?.user?.role;
      if (token) {
        dispatch(setToken({ token, role }));
      } else {
        console.warn("No token found in login response", res);
      }
      onSuccess();
    } catch (error) {
      console.error("❌ Login error:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#f7f8ff] py-10 px-4">
      {/* Logo */}
      <div className="mb-6 flex flex-col items-center gap-2">
        <div className="w-16 h-16 rounded-2xl bg-white shadow-[0_20px_60px_-24px_rgba(63,65,150,0.35)] flex items-center justify-center">
          <span className="text-2xl font-bold text-[#4E46E5]">U</span>
        </div>
        <div className="text-3xl font-extrabold text-[#4735ff] leading-none">
          UCO
        </div>
        <div className="text-[0.9rem] uppercase tracking-[0.18em] text-[#7c82c6]">
          Uzbekistan Coding Olympiad
        </div>
      </div>

      <div className="w-full max-w-[720px] bg-white border border-[#eef0ff] rounded-[2.8rem] shadow-[0_30px_60px_-30px_rgba(35,46,120,0.45)] px-[3.2rem] md:px-[4rem] py-[3.6rem]">
        <h1 className="text-[2.4rem] font-semibold text-[#24195a] mb-[2.8rem]">
          Tizimga kirish
        </h1>

        <form onSubmit={submitLogin} className="flex flex-col gap-[2.4rem]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[2rem]">
            <div className="flex flex-col gap-2">
              <label className="text-[1.5rem] text-[#24195a] font-semibold">
                Telefon nomer<span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                placeholder="(+998) 90-988-89-54"
                value={credentials.phoneNumber}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
                className="w-full h-[5.4rem] rounded-[1.6rem] border border-[#dfe4ff] px-4 text-[1.5rem] text-[#2f2f4d] placeholder:text-[#a3a7c2] focus:outline-none focus:border-[#6C4DFF] shadow-[0_12px_34px_-24px_rgba(70,78,144,0.4)]"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[1.5rem] text-[#24195a] font-semibold">
                Parol
              </label>
              <input
                type="password"
                placeholder="**************"
                value={credentials.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className="w-full h-[5.4rem] rounded-[1.6rem] border border-[#dfe4ff] px-4 text-[1.5rem] text-[#2f2f4d] placeholder:text-[#a3a7c2] focus:outline-none focus:border-[#6C4DFF] shadow-[0_12px_34px_-24px_rgba(70,78,144,0.4)]"
                required
              />
              <button
                type="button"
                className="text-[#4f46e5] text-[1.4rem] font-medium mt-1 self-start hover:underline"
              >
                Parolni tiklash
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[#3c3c55] text-[1.4rem]">
            <input
              id="remember"
              type="checkbox"
              checked={credentials.remember}
              onChange={(e) => handleChange("remember", e.target.checked)}
              className="w-5 h-5 rounded-md border border-[#cdd2f5] text-[#5647ff] focus:ring-[#5647ff]"
            />
            <label htmlFor="remember">Eslab qolish</label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="
              w-full
              h-[5.8rem]
              rounded-[1.8rem]
              text-white
              text-[1.6rem]
              font-semibold
              bg-gradient-to-r
              from-[#6b7bff]
              to-[#4b32ff]
              shadow-[0_20px_44px_-18px_rgba(75,59,255,0.65)]
              hover:opacity-95
              active:scale-[0.99]
              transition
              disabled:opacity-60
            "
          >
            {isLoading ? "Yuklanmoqda..." : "Davom etish"}
          </button>

          <div className="text-center text-[#9aa0c5] text-[1.4rem]">
            yoki
          </div>
          <div className="text-center text-[#9aa0c5] text-[1.4rem]">
            Hisobingiz yo&apos;qmi?{" "}
            <button
              type="button"
              onClick={onBackToRegister}
              className="text-[#4f46e5] font-semibold hover:underline"
            >
              Ro&apos;yxatdan o&apos;tish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
