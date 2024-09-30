// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  login as appwriteLogin,
  logout as appwriteLogout,
  checkUserSession,
} from "../lib/appWrite";
import { SpinningCircles } from "react-loading-icons";

interface AuthContextType {
  user: any; // Replace 'any' with your user type if available
  isLoggedIn: boolean; // Boolean state to check if the user is logged in
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const authenticateUser = async () => {
      const session = await checkUserSession();
      if (session) {
        setUser(session);
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
      setIsLoading(false);
    };
    authenticateUser();
  }, []);
  const login = async (email: string, password: string) => {
    const response = await appwriteLogin(email, password);
    if (response) {
      setUser(response);
      setIsLoggedIn(true);
    }
    return response;
  };

  const logout = async () => {
    await appwriteLogout();
    setUser(null);
    setIsLoggedIn(false);
  };

  if (isLoading) {
    return (
      <div
        style={{ justifyContent: "center", display: "flex", marginTop: 120 }}
      >
        <SpinningCircles fill="black" />
      </div>
    );
  }
  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
