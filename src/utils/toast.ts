import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";

type ErrorPayload =
  | string
  | {
      message?: string;
      error?: string;
      detail?: string;
      errors?: string[] | Record<string, string[]>;
    };

const isFetchBaseQueryError = (error: unknown): error is FetchBaseQueryError =>
  typeof error === "object" && error !== null && "status" in error;

const isSerializedError = (error: unknown): error is SerializedError =>
  typeof error === "object" && error !== null && "message" in error;

const extractMessageFromData = (data: ErrorPayload): string | null => {
  if (!data) return null;
  if (typeof data === "string") return data;
  if (data.message) return data.message;
  if (data.error) return data.error;
  if (data.detail) return data.detail;
  if (Array.isArray(data.errors)) return data.errors[0] ?? null;
  if (data.errors && typeof data.errors === "object") {
    const firstKey = Object.keys(data.errors)[0];
    const firstError = firstKey ? data.errors[firstKey]?.[0] : null;
    return firstError ?? null;
  }
  return null;
};

const statusMessage = (status: FetchBaseQueryError["status"]): string => {
  if (status === "FETCH_ERROR") {
    return "Serverga ulanib bo‘lmadi. Internet yoki server holatini tekshiring.";
  }
  if (status === "PARSING_ERROR") {
    return "Server javobini o‘qib bo‘lmadi. Keyinroq urinib ko‘ring.";
  }
  if (status === "CUSTOM_ERROR") {
    return "Noma’lum xatolik yuz berdi. Qayta urinib ko‘ring.";
  }
  if (typeof status === "number") {
    if (status === 400) {
      return "Kiritilgan ma’lumotlar noto‘g‘ri. Qayta tekshirib ko‘ring.";
    }
    if (status === 401) {
      return "Ruxsat yo‘q. Telefon raqam yoki parol noto‘g‘ri bo‘lishi mumkin.";
    }
    if (status === 403) {
      return "Kirish taqiqlangan. Ruxsatlar yetarli emas.";
    }
    if (status === 404) {
      return "So‘rov manzili topilmadi. Keyinroq urinib ko‘ring.";
    }
    if (status === 409) {
      return "Ma’lumotlar to‘qnashuvi yuz berdi. Telefon raqami allaqachon mavjud bo‘lishi mumkin.";
    }
    if (status === 422) {
      return "Tekshiruvdan o‘tmadi. Kiritilgan ma’lumotlarni qayta ko‘ring.";
    }
    if (status >= 500) {
      return "Serverda xatolik. Keyinroq urinib ko‘ring.";
    }
  }
  return "Noma’lum xatolik yuz berdi.";
};

export const getToastErrorMessage = (error: unknown): string => {
  if (!error) return "Noma’lum xatolik yuz berdi.";

  if (typeof error === "string") return error;

  if (isFetchBaseQueryError(error)) {
    const message = extractMessageFromData(error.data as ErrorPayload);
    return message ?? statusMessage(error.status);
  }

  if (isSerializedError(error)) {
    return error.message ?? "Noma’lum xatolik yuz berdi.";
  }

  return "Noma’lum xatolik yuz berdi.";
};
