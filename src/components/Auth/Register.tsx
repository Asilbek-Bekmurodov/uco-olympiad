import { useState } from "react";
import type { FormEvent } from "react";
import { useRegisterMutation, useVerifyMutation } from "../../services/authApi";
import type { RegisterFormData } from "../../features/auth/types";
import OtpInput from "../Otp/OtpInput";
import StepBar from "../StepBar/StepBar";
import StepNumber from "../StepNumber/StepNumber";
import Support from "../Support/Support";
import FormInput from "../FormInput/FormInput";
import Uco from "../../assets/Uco icon.svg";
import { formatUzPhoneLocal, normalizeUzPhone } from "../../utils/phone";
import { useNavigate } from "react-router-dom";

type RegisterFormKey = keyof RegisterFormData;

interface RegisterProps {
  onVerifySuccess?: () => void;
  onLoginClick?: () => void;
}

const Register = ({ onVerifySuccess, onLoginClick }: RegisterProps) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    firstname: "",
    lastname: "",
    className: "",
    language: "uz",
    phoneNumber: "",
    password: "",
  });

  const [otp, setOtp] = useState("");
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [register, { isLoading }] = useRegisterMutation();
  const [verify, { isLoading: isVerifying }] = useVerifyMutation();
  // const navigate = useNavigate();

  const handleChange = (key: RegisterFormKey, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const submitRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await register(formData).unwrap();
      setCurrentStep(2);
    } catch (error) {
      console.error("Register error:", error);
    }
  };

  const submitOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await verify({
        phoneNumber: formData.phoneNumber,
        smsCode: otp,
      }).unwrap();
      onVerifySuccess?.();
    } catch (error) {
      console.error("OTP error:", error);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex gap-10 md:flex-row">
      {/* LEFT SIDEBAR */}
      <div className="hidden md:flex">
        <div className=" min-h-screen flex flex-col justify-between shadow-neutral-shadow border border-gray-300 h-full bg-gray-100 py-[4rem] px-[2rem] md:px-[3.6rem] rounded-[2.4rem] max-h-[95vh] w-[350px]">
          <div>
            <img
              className="mx-auto md:mx-0 mb-[5.6rem] w-[14rem]"
              src={Uco}
              alt="Logo"
              // onClick={() => navigate("/")}
            />
            <div className="stage-wrapper flex flex-col gap-1.5">
              <StepNumber
                id={1}
                title="Shaxsiy ma'lumotlar"
                desc="Ma'lumotlaringizni kiriting"
                status={currentStep === 1 ? "active" : "done"}
              />
              <StepBar status={currentStep === 2 ? "done" : "active"} />
              <StepNumber
                id={2}
                title="SMS tasdiqlash"
                desc="Telefon raqamingizni tasdiqlang"
                status={currentStep === 2 ? "active" : "default"}
              />
            </div>
          </div>
          <div className="hidden sm:block">
            <Support />
          </div>
        </div>
      </div>

      {/* RIGHT FORM */}
      <div className="w-full md:w-[65%] flex justify-center items-start md:items-center py-8 md:py-0 px-4 sm:px-6 md:px-0 overflow-x-hidden">
        {currentStep === 1 && (
          <div className="border border-gray-300 rounded-[3.2rem] p-[3rem] sm:p-[4.8rem] shadow-neutral-shadow w-full max-w-[95%] sm:max-w-[50rem] md:max-w-[70rem]">
            <h1 className="text-purple-dark text-[2.4rem] font-semibold mb-[3.2rem] text-center md:text-left">
              Ro'yxatdan o'tish
            </h1>

            <form onSubmit={submitRegister}>
              {/* ISM + FAMILIYA */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[2.4rem] mb-[2.4rem]">
                <FormInput
                  label="Ism"
                  required
                  placeholder="Ismingizni kiriting"
                  value={formData.firstname}
                  onChange={(e) => handleChange("firstname", e.target.value)}
                />
                <FormInput
                  label="Familiya"
                  required
                  placeholder="Familiyangizni kiriting"
                  value={formData.lastname}
                  onChange={(e) => handleChange("lastname", e.target.value)}
                />
              </div>

              {/* TELEFON + PAROL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[2.4rem] mb-[2.4rem]">
                {/* TELEFON */}
                <div className="flex flex-col gap-2">
                  <label className="block text-[1.4rem] font-medium text-[#1C1C28] mb-[0.8rem]">
                    Telefon raqam<span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center w-full h-[5.6rem] px-[0.4rem] rounded-[1.6rem] border border-[#E6E6F0] text-[1.5rem] text-[#2f2f4d] focus-within:border-[#6C4DFF]">
                    <span className="pl-1 pr-1 font-semibold text-[#6C4DFF]">
                      +998
                    </span>
                    <input
                      type="tel"
                      inputMode="tel"
                      maxLength={18}
                      placeholder="(91) 457-26-14"
                      value={formatUzPhoneLocal(formData.phoneNumber)}
                      onChange={(e) =>
                        handleChange(
                          "phoneNumber",
                          normalizeUzPhone(e.target.value)
                            ? `+998${normalizeUzPhone(e.target.value)}`
                            : "",
                        )
                      }
                      className="flex-1 h-full rounded-[1.6rem] text-[1.5rem] text-[#2f2f4d] placeholder:text-[#9A9AAF] outline-none"
                      required
                    />
                  </div>
                </div>

                {/* PAROL */}
                <div className="flex flex-col gap-2">
                  <label className="block text-[1.4rem] font-medium text-[#1C1C28] mb-[0.8rem]">
                    Parol<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="********"
                      value={formData.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      className="w-full h-[5.6rem] px-[1.6rem] pr-12 rounded-[1.6rem] border border-[#E6E6F0] text-[1.5rem] placeholder:text-[#9A9AAF] outline-none focus:border-[#6C4DFF]"
                      required
                    />
                    <button
                      type="button"
                      aria-label={
                        showPassword
                          ? "Parolni yashirish"
                          : "Parolni ko'rsatish"
                      }
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-4 flex items-center text-[#6C4DFF] hover:text-[#4f46e5]"
                    >
                      {/* SVG ICON */}
                    </button>
                  </div>
                </div>
              </div>

              {/* SINF + TIL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[2.4rem] mb-[3.2rem]">
                <div>
                  <label className="block text-[1.4rem] font-medium text-[#1C1C28] mb-[0.8rem]">
                    Sinf<span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.className}
                    onChange={(e) => handleChange("className", e.target.value)}
                    className="w-full h-[5.6rem] px-[1.6rem] rounded-[1.6rem] border border-[#E6E6F0] text-[1.5rem] text-[#2f2f4d] outline-none focus:border-[#6C4DFF]"
                    required
                  >
                    <option value="" disabled>
                      Sinfni tanlang
                    </option>
                    {[...Array(11).keys()].map((i) =>
                      i >= 3 ? (
                        <option key={i} value={i}>
                          {i}
                        </option>
                      ) : null,
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-[1.4rem] font-medium text-[#1C1C28] mb-[0.8rem]">
                    Til<span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.language}
                    onChange={(e) => handleChange("language", e.target.value)}
                    className="w-full h-[5.6rem] px-[1.6rem] rounded-[1.6rem] border border-[#E6E6F0] text-[1.5rem] text-[#2f2f4d] outline-none focus:border-[#6C4DFF]"
                    required
                  >
                    <option value="uz">uz</option>
                    <option value="ru">ru</option>
                    <option value="en">en</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-[5.6rem] rounded-[1.6rem] text-white text-[1.6rem] font-semibold bg-gradient-to-r from-[#7B6CFF] to-[#5B3FFF] hover:opacity-90 transition disabled:opacity-60"
              >
                {isLoading ? "Yuborilmoqda..." : "Davom etish"}
              </button>

              <div className="text-center mt-[3.2rem]">
                <p className="text-[#9A9AAF] text-[1.4rem]">
                  Hisobingiz mavjudmi?{" "}
                  <button
                    type="button"
                    onClick={onLoginClick}
                    className="text-[#6C4DFF] font-medium cursor-pointer hover:underline"
                  >
                    Tizimga kirish
                  </button>
                </p>
              </div>
            </form>
          </div>
        )}

        {currentStep === 2 && (
          <div className="flex justify-center w-full px-4 sm:px-0 py-8 md:py-0">
            <form
              onSubmit={submitOtp}
              className="flex flex-col items-center lg:border-4 border-gray-200 rounded-4xl p-5 w-full"
            >
              <OtpInput value={otp} onChange={setOtp} />
              <button
                type="submit"
                disabled={isVerifying}
                className="px-3 py-1.5 rounded-[1.8rem] text-white text-[1.6rem] font-semibold bg-gradient-to-r from-[#6F63FF] to-[#4B2CFF] shadow-[0_20px_40px_-18px_rgba(75,59,255,0.7)] hover:opacity-95 active:scale-[0.98] transition disabled:opacity-60  mt-0 lg:mt-4"
              >
                {isVerifying ? "Tasdiqlanmoqda..." : "Tasdiqlash"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
