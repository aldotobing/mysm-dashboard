"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { setCookie, getCookie, removeCookie } from "@/helpers/cookies";
import { loginUser } from "@/services/authService";
import hashPassword from "@/helpers/sha1";

interface User {
  user_id: string;
  token: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const token = getCookie("token");
    const userId = getCookie("user_id");
    const email = getCookie("email");
    
    if (token && userId) {
      setUser({
        user_id: userId,
        token,
        email: email || "",
      });
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      // Hash the password with SHA1 as in the original implementation
      const hashedPassword = hashPassword(password);
      
      // Make the actual API call
      const response = await loginUser({ email, password: hashedPassword });
      
      const userData = {
        user_id: response.data.user_id,
        token: response.data.token,
        email,
      };
      
      setUser(userData);
      setCookie("user_id", response.data.user_id);
      setCookie("token", response.data.token);
      setCookie("email", email);
      
      // Redirect to welcome page after successful login
      router.push("/welcome");
      
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    removeCookie("user_id");
    removeCookie("token");
    removeCookie("email");
    router.push("/signin");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}