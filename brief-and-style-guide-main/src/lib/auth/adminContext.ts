import { createContext } from "react";

export type AdminAuthContextValue = {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
};

export const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);
