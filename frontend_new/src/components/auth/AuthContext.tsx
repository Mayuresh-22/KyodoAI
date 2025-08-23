import React, { createContext, useContext, useState } from 'react';

type AuthMode = 'login' | 'register';

interface AuthContextType {
  authMode: AuthMode;
  setAuthMode: (mode: AuthMode) => void;
  setCurrentPage: (page: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
  setCurrentPage: (page: string) => void;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, setCurrentPage }) => {
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  return (
    <AuthContext.Provider value={{ authMode, setAuthMode, setCurrentPage }}>
      {children}
    </AuthContext.Provider>
  );
};
