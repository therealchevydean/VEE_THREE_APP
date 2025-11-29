import React from 'react';
import { V3Logo } from './icons';

interface AuthScreenProps {
  onLogin: () => void;
}

const AuthScreen = ({ onLogin }: AuthScreenProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 bg-v3-bg">
      <div className="w-full max-w-sm text-center">
        <div className="w-32 h-32 mx-auto mb-4">
          <V3Logo />
        </div>
        <p className="text-v3-text-secondary mb-8">Welcome Back</p>
        
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            className="w-full px-4 py-3 bg-v3-surface border border-v3-border rounded-lg focus:outline-none focus:ring-2 focus:ring-v3-primary"
            defaultValue="user@v3.app"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 bg-v3-surface border border-v3-border rounded-lg focus:outline-none focus:ring-2 focus:ring-v3-primary"
            defaultValue="password"
          />
          <button
            onClick={onLogin}
            className="w-full py-3 bg-v3-primary text-white font-bold rounded-lg hover:bg-v3-primary-hover transition-colors"
          >
            Login with Email
          </button>
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-v3-border"></div>
            <span className="flex-shrink mx-4 text-v3-text-secondary">or</span>
            <div className="flex-grow border-t border-v3-border"></div>
          </div>
          <button
            onClick={onLogin}
            className="w-full py-3 bg-v3-secondary text-white font-bold rounded-lg hover:bg-opacity-80 transition-colors"
          >
            Login with Passkey
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;