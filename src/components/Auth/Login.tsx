import { useState } from "react";
import type { FormEvent } from "react";
import { useLoginUserMutation } from "../../services/authApi";
import { useAppDispatch } from "../../app/hooks";
import { setToken } from "../../features/auth/authSlice";
import Uco from "../../assets/Uco icon.svg";
import {
  formatUzPhoneLocal,
  normalizeUzPhone,
} from "../../utils/phone";

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
  const [showPassword, setShowPassword] = useState(false);
  const [loginUser, { isLoading }] = useLoginUserMutation();

  const handleChange = (
    key: "phoneNumber" | "password" | "remember",
    value: string | boolean,
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
      console.log("✅ Login successful:", res);
      const token = res?.token;
      const role = res?.role ?? res?.roles?.[0]?.role;
      if (token) {
        dispatch(setToken({ token, role, remember: credentials.remember }));
      } else {
        console.warn("No token found in login response", res);
      }
      onSuccess();
    } catch (error) {
      console.error("❌ Login error:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-white ">
      {/* Logo */}

      <div className="flex w-full gap-[20px] r items-center">
        {/* First */}

        <div className="bg-gradient-to-b from-[#8C82FF] to-[#4A3AFF] w-[50%] h-[100vh]"></div>

        {/* Second  */}

        <div className="">
          <img src={Uco} alt="uco" className="mb-[50px] mx-auto" />

          <div className="w-[700px] bg-white border border-[#eef0ff] rounded-[2.8rem] shadow-[0_30px_60px_-30px_rgba(35,46,120,0.45)] px-[3.2rem] md:px-[4rem] py-[3.6rem]">
            <h1 className="text-[2.4rem] font-semibold text-[#24195a] mb-[2.8rem]">
              Tizimga kirish
            </h1>

            <form onSubmit={submitLogin} className="flex flex-col gap-[2.4rem]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[2rem]">
                <div className="flex flex-col gap-2">
                  <label className="text-[1.5rem] text-[#24195a] font-semibold">
                    Telefon nomer<span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center w-full h-[5.4rem] rounded-[1.6rem] border border-[#dfe4ff] text-[1.5rem] text-[#2f2f4d] shadow-[0_12px_34px_-24px_rgba(70,78,144,0.4)] focus-within:border-[#6C4DFF]">
                    <span className="pl-2 pr-1 font-semibold text-[#4f46e5]">
                      +998
                    </span>
                    <input
                      type="tel"
                      inputMode="tel"
                      maxLength={18}
                      placeholder="(91) 457-26-14"
                      value={formatUzPhoneLocal(credentials.phoneNumber)}
                      onChange={(e) =>
                        handleChange(
                          "phoneNumber",
                          normalizeUzPhone(e.target.value)
                            ? `+998${normalizeUzPhone(e.target.value)}`
                            : "",
                        )
                      }
                      className="flex-1 h-full rounded-[1.6rem] text-[1.5rem] text-[#2f2f4d] placeholder:text-[#a3a7c2] focus:outline-none"
                      required
                    />
                  </div>
                  <div className="flex items-center justify-center gap-6">
                    <div className="flex items-center gap-2 text-[#3c3c55] text-[1.4rem] justify-center">
                      <input
                        id="remember"
                        type="checkbox"
                        checked={credentials.remember}
                        onChange={(e) =>
                          handleChange("remember", e.target.checked)
                        }
                        className="w-2 h-2 rounded-md border border-[#cdd2f5] text-[#5647ff] focus:ring-[#5647ff]"
                      />
                      <label htmlFor="remember">Eslab qolish</label>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[1.5rem] text-[#24195a] font-semibold">
                    Parol
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="**************"
                      value={credentials.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      className="w-full h-[5.4rem] rounded-[1.6rem] border border-[#dfe4ff] px-4 pr-12 text-[1.5rem] text-[#2f2f4d] placeholder:text-[#a3a7c2] focus:outline-none focus:border-[#6C4DFF] shadow-[0_12px_34px_-24px_rgba(70,78,144,0.4)]"
                      required
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-3 flex items-center text-[#6C4DFF] hover:text-[#4f46e5]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-2 h-2"
                      >
                        {showPassword ? (
                          <>
                            <path d="M17.94 17.94A10.97 10.97 0 0 1 12 20c-7 0-10-8-10-8a17.69 17.69 0 0 1 4.06-5.94m3.49-2.1A10.94 10.94 0 0 1 12 4c7 0 10 8 10 8a17.8 17.8 0 0 1-2.16 3.19" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                          </>
                        ) : (
                          <>
                            <path d="M1 12s3-8 11-8 11 8 11 8-3 8-11 8-11-8-11-8Z" />
                            <circle cx="12" cy="12" r="3" />
                          </>
                        )}
                      </svg>
                    </button>
                  </div>
                  <button
                    type="button"
                    className="text-[#4f46e5] text-[1.4rem] font-medium  self-start hover:underline ml-[50px]"
                  >
                    Parolni tiklash
                  </button>
                </div>
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
      </div>
    </div>
  );
};

export default Login;
