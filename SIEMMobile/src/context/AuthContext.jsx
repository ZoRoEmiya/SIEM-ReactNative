import { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { clearApiToken, setApiToken } from '../services/api';
import { getCurrentUser } from '../services/authService';

const TOKEN_KEY = 'siem_auth_token';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [tenant, setTenant] = useState();
  const [token, setToken] = useState();
  const [isLoading, setIsLoading] = useState(true);

  // Save authenticated user data after login or register.
  const login = async (userData, tenantData, authToken) => {
    setUser(userData);
    setTenant(tenantData);
    setToken(authToken);
    setApiToken(authToken);
    await SecureStore.setItemAsync(TOKEN_KEY, authToken);
  };

  // Clear local session state and the stored JWT.
  const logout = async () => {
    setUser();
    setTenant();
    setToken();
    clearApiToken();
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  };

  // Update user and tenant data without changing the token.
  const setAuth = (userData, tenantData) => {
    setUser(userData);
    setTenant(tenantData);
  };

  // Restore a saved JWT and verify it with the backend.
  const restoreSession = async () => {
    setIsLoading(true);

    try {
      const savedToken = await SecureStore.getItemAsync(TOKEN_KEY);

      if (!savedToken) {
        return;
      }

      setToken(savedToken);
      setApiToken(savedToken);

      const data = await getCurrentUser();
      setAuth(data.user, data.tenant);
    } catch (error) {
      clearApiToken();
      setToken();
      setUser();
      setTenant();
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    restoreSession();
  }, []);

  const value = {
    user,
    tenant,
    token,
    isLoading,
    login,
    logout,
    restoreSession,
    setAuth,
    setIsLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export default AuthContext;
