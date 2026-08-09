import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { authService } from "../services/authService";
import type { SignInFormData, SignUpFormData, UserProfile } from "../types";

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: SignInFormData) => Promise<void>;
  register: (data: SignUpFormData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          const profile = await authService.getMyProfile();
          setUser(profile);
          setToken(storedToken);
        } catch (error) {
          console.error("Failed to load profile:", error);
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    fetchProfile();
  }, []);

  const login = async (data: SignInFormData) => {
    setIsLoading(true);
    try {
      const authData = await authService.signIn(data);
      localStorage.setItem("token", authData.token);
      setToken(authData.token);

      const profile = await authService.getMyProfile();
      setUser(profile);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: SignUpFormData) => {
    setIsLoading(true);
    try {
      await authService.signUp(data);
      // Auto login after registration
      await login({ username: data.username, password: data.password });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
