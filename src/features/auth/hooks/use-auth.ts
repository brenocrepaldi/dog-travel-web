import { useMutation } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import { AuthApi } from "../api/auth.api";
import type { RegisterDto } from "@/types";

export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      // Best-effort server-side revocation. If it fails (network error, 401,
      // etc.) we still clear the client session so the user is not stuck.
      try {
        await AuthApi.logout();
      } catch {
        // intentionally ignored
      }
      await signOut({ callbackUrl: "/login" });
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (dto: RegisterDto) => AuthApi.register(dto),
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => AuthApi.forgotPassword(email),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      AuthApi.resetPassword(token, password),
  });
}
