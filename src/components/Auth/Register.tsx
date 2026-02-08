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

type RegisterFormKey = keyof RegisterFormData;

/* =======================
   COMPONENT
======================= */

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

  console.log(formData);

  const [otp, setOtp] = useState("");
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [register, { isLoading }] = useRegisterMutation();
  const [verify, { isLoading: isVerifying }] = useVerifyMutation();

  const handleChange = (key: RegisterFormKey, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const submitRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      console.log("Submitting register payload:", formData);
      await register(formData).unwrap();
      console.log("✅ OTP yuborildi");
      setCurrentStep(2);
    } catch (error) {
      console.error("❌ Register error:", error);
    }
  };

  const submitOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await verify({
        phoneNumber: formData.phoneNumber,
        smsCode: otp,
      }).unwrap();
      console.log("✅ OTP tasdiqlandi");
      onVerifySuccess?.();
    } catch (error) {
      console.error("❌ OTP error:", error);
    }
  };

  return (
    <div className="bg-gray-50">
      <div className="flex items-center">
        {/* LEFT SIDEBAR */}
        <div className="w-50 p-[1.6rem] h-screen">
          <div className="flex flex-col justify-between shadow-neutral-shadow border border-gray-300 h-full bg-gray-100 py-[4rem] px-[3.6rem] rounded-[2.4rem]">
            <div>
              <img
                className="mx-auto mb-[5.6rem] w-[14rem]"
                src={Uco}
                alt="Logo"
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
            <Support />
          </div>
        </div>

        {/* RIGHT FORM */}

        {currentStep === 1 && (
          <div className="w-full h-screen bg-gray-50 flex justify-center items-center">
            <div className="border border-gray-300 rounded-[3.2rem] p-[4.8rem] shadow-neutral-shadow w-[70rem]">
              <h1 className="text-purple-dark text-[2.4rem] font-semibold mb-[3.2rem]">
                Ro'yxatdan o'tish
              </h1>

              <form onSubmit={submitRegister}>
                {/* ISM + FAMILIYA */}
                <div className="grid grid-cols-2 gap-[2.4rem] mb-[2.4rem]">
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
                <div className="grid grid-cols-2 gap-[2.4rem] mb-[2.4rem]">
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
                        className="flex-1 h-full rounded-[1.6rem] text-[1.5rem] text-[#2f2f4d] placeholder:text-[#9A9AAF] outline-none "
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="block text-[1.4rem] font-medium text-[#1C1C28] mb-[0.8rem]">
                      Parol<span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="********"
                        value={formData.password}
                        onChange={(e) =>
                          handleChange("password", e.target.value)
                        }
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
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-[2.4rem] mb-[3.2rem]">
                  <FormInput
                    label="Sinf"
                    required
                    placeholder="10-A"
                    value={formData.className}
                    onChange={(e) => handleChange("className", e.target.value)}
                  />

                  <FormInput
                    label="Til"
                    required
                    placeholder="uz / ru"
                    value={formData.language}
                    onChange={(e) => handleChange("language", e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="
                    w-full
                    h-[5.6rem]
                    rounded-[1.6rem]
                    text-white
                    text-[1.6rem]
                    font-semibold
                    bg-gradient-to-r
                    from-[#7B6CFF]
                    to-[#5B3FFF]
                    hover:opacity-90
                    transition
                    disabled:opacity-60
                  "
                >
                  {isLoading ? "Yuborilmoqda..." : "Davom etish"}
                </button>
              </form>

              {/* FOOTER */}
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
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="flex justify-center w-[100%]">
            <div className="flex justify-center">
              <form
                onSubmit={submitOtp}
                className="flex flex-col items-center border-4 border-gray-200 rounded-4xl p-5"
              >
                {/* INNER OTP CARD */}

                {/* OTP INPUTS */}
                <OtpInput value={otp} onChange={setOtp} />

                {/* BUTTON */}
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="
          w-[100%]
          h-[5.6rem]
          rounded-[1.8rem]
          text-white
          text-[1.6rem]
          font-semibold
          bg-gradient-to-r
          from-[#6F63FF]
          to-[#4B2CFF]
          shadow-[0_20px_40px_-18px_rgba(75,59,255,0.7)]
          hover:opacity-95
          active:scale-[0.98]
          transition
          disabled:opacity-60
        "
                >
                  {isVerifying ? "Tasdiqlanmoqda..." : "Tasdiqlash"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
