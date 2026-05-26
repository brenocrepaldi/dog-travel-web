import { useMutation } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import { AuthApi } from "../api/auth.api";

export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      await AuthApi.logout();
      await signOut({ callbackUrl: "/login" });
    },
  });
}
