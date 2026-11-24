import { createAuthClient } from "better-auth/react";
export const getToken = () => localStorage.getItem("salon-session") || "";
export const authClient = createAuthClient({
  baseURL: window.location.origin,
  basePath: "/api/auth",
  fetchOptions: {
    auth: { type: "Bearer", token: getToken },
    onSuccess: (ctx) => {
      const token = ctx.response.headers.get("set-auth-token");
      if (token) localStorage.setItem("salon-session", token);
    },
  },
});
