import React from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { useAuth } from './AuthContext';

const Auth: React.FC = () => {
  const { authMode } = useAuth();

  return (
    <div>
      {authMode === 'login' ? <LoginForm /> : <RegisterForm />}
    </div>
  );
};

export default Auth;
