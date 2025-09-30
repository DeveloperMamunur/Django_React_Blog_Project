import { createContext, useEffect, useState } from "react";
import { authService } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initUser = async () => {
        setIsAuthLoading(true);
        const token = localStorage.getItem('access_token');
        if (token) {
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser); // null if token invalid
        }
        setIsAuthLoading(false);
    };

    initUser();
  }, []);

  

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      localStorage.setItem("access_token", response.token);
      localStorage.setItem("refresh_token", response.refresh);
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      return response;
    } catch (err) {
      setError(err.message || "Login failed");
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      localStorage.setItem("access_token", response.token);
      localStorage.setItem("refresh_token", response.refresh);
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      return response;
    } catch (err) {
      setError(err.message || "Registration failed");
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        register,
        login,
        logout,
        user,
        isAuthLoading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
