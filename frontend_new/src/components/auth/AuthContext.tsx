import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import type { User } from "@supabase/supabase-js";

type AuthMode = "login" | "register";

interface AuthContextType {
  authMode: AuthMode;
  setAuthMode: (mode: AuthMode) => void;
  setCurrentPage: (page: string) => void;
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
  setCurrentPage: (page: string) => void;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  setCurrentPage,
}) => {
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{ authMode, setAuthMode, setCurrentPage, user, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
