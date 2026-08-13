import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { AppPage, User } from '../types';
import { mockUser } from '../data/mockData';

interface AppContextValue {
  isAuthenticated: boolean;
  user: User | null;
  currentPage: AppPage;
  sidebarOpen: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  navigate: (page: AppPage) => void;
  toggleSidebar: () => void;
  closeSidebar: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<AppPage>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const login = useCallback((email: string, password: string) => {
    if (!email.trim() || !password.trim()) {
      return false;
    }
    setIsAuthenticated(true);
    setUser(mockUser);
    setCurrentPage('dashboard');
    return true;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    setCurrentPage('dashboard');
    setSidebarOpen(false);
  }, []);

  const navigate = useCallback((page: AppPage) => {
    setCurrentPage(page);
    setSidebarOpen(false);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((open) => !open);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated,
      user,
      currentPage,
      sidebarOpen,
      login,
      logout,
      navigate,
      toggleSidebar,
      closeSidebar,
    }),
    [
      isAuthenticated,
      user,
      currentPage,
      sidebarOpen,
      login,
      logout,
      navigate,
      toggleSidebar,
      closeSidebar,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
