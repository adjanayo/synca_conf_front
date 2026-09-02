import { createContext } from "react";

export type AdminAuthContextValue = {
  isAuthenticated: boolean;
  isLoading: boolean;
  role: string | null;
  permissions: string[];
  hasPermission: (code: string) => boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
};

export const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);
