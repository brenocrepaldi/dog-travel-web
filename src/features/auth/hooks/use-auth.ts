import { useMutation } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import { AuthApi } from "../api/auth.api";
import type { RegisterDto } from "@/types";

export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      await AuthApi.logout();
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
