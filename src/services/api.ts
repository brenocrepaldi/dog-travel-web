import axios from "axios";
import { getSession } from "next-auth/react";
import { toast } from "sonner";

const SESSION_EXPIRED_MESSAGE = "Sua sessão expirou. Faça login novamente.";
const REDIRECT_DELAY_MS = 1500;

function redirectToLoginWithNotice() {
  toast.error(SESSION_EXPIRED_MESSAGE);
  setTimeout(() => {
    window.location.href = "/login";
  }, REDIRECT_DELAY_MS);
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    if (typeof window !== "undefined") {
      const session = await getSession();

      // If the JWT callback flagged a refresh failure, redirect immediately
      // instead of sending a request that will certainly return 401.
      if (session?.error === "RefreshAccessTokenError") {
        redirectToLoginWithNotice();
        return Promise.reject(new Error("RefreshAccessTokenError"));
      }

      const token = session?.accessToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Redirect to login on 401. The _retried flag prevents an infinite loop
    // in the unlikely case the redirect is delayed and another request fires.
    if (
      error.response?.status === 401 &&
      typeof window !== "undefined" &&
      !error.config?._retried
    ) {
      error.config._retried = true;
      redirectToLoginWithNotice();
    }
    return Promise.reject(error);
  }
);

export const isApiConfigured = !!process.env.NEXT_PUBLIC_API_URL;

export default api;
