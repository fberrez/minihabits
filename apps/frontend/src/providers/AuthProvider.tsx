import { createContext, useContext, ReactNode } from "react";
import { useAuth as useAuthHook } from "../api/hooks/useAuth";

// Create a type for the auth context
type AuthContextType = ReturnType<typeof useAuthHook>;

// Create the context with a default value of null
const AuthContext = createContext<AuthContextType | null>(null);

// Create a provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuthHook();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

// Create a hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
