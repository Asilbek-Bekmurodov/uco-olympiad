export interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  role: "admin" | "user" | null;
}

export interface RegisterFormData {
  firstname: string;
  lastname: string;
  className: string;
  language: string;
  phoneNumber: string;
  password: string;
}

export interface VerifyPayload {
  phoneNumber: string;
  smsCode: string;
}

export interface LoginPayload {
  phoneNumber?: string;
  username?: string;
  password: string;
}

export interface LoginResponse {
  token?: string;
  accessToken?: string;
  jwt?: string;
  role?: "admin" | "user" | string;
}

export interface UserStatsResponse {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isstarted: boolean;
  message: string;
}
