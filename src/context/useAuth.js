import { useContext } from "react";
import { AuthContext } from "./createAuthContext";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth musth be used within an AuthProvider");
  return context;
};
