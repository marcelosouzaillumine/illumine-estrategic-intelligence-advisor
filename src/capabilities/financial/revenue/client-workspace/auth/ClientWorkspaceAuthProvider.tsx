import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ClientWorkspaceSession, clientWorkspaceAuthService } from '../../../../../features/revenue/client-workspace/services/clientWorkspaceAuth.service';

interface AuthContextType {
  session: ClientWorkspaceSession | null;
  loading: boolean;
  validateToken: (token: string) => Promise<boolean>;
  verifyOTP: (token: string, otp: string) => Promise<boolean>;
  logout: () => void;
}

const ClientWorkspaceAuthContext = createContext<AuthContextType>({
  session: null,
  loading: false,
  validateToken: async () => false,
  verifyOTP: async () => false,
  logout: () => {},
});

export const ClientWorkspaceAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<ClientWorkspaceSession | null>(null);
  const [loading, setLoading] = useState(false);

  const validateToken = async (token: string) => {
    setLoading(true);
    const isValid = await clientWorkspaceAuthService.validateAccessToken(token);
    setLoading(false);
    return isValid;
  };

  const verifyOTP = async (token: string, otp: string) => {
    setLoading(true);
    const newSession = await clientWorkspaceAuthService.verifyOTP(token, otp);
    if (newSession) {
      setSession(newSession);
    }
    setLoading(false);
    return !!newSession;
  };

  const logout = () => {
    setSession(null);
  };

  return (
    <ClientWorkspaceAuthContext.Provider value={{ session, loading, validateToken, verifyOTP, logout }}>
      {children}
    </ClientWorkspaceAuthContext.Provider>
  );
};

export const useClientWorkspaceSession = () => useContext(ClientWorkspaceAuthContext);
