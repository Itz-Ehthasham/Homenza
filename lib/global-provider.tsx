import React, { createContext, useContext, ReactNode, useState } from "react";

import { getCurrentUser } from "./appwrite";
import { useAppwrite } from "./useAppwrite";

interface GlobalContextType {
  isLogged: boolean;
  user: User | null;
  loading: boolean;
  refetch: () => void;
  loginAsGuest: () => void;
  logoutGuest: () => void;
}

interface User {
  $id: string;
  name: string;
  email: string;
  avatar: string;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

interface GlobalProviderProps {
  children: ReactNode;
}

export const GlobalProvider = ({ children }: GlobalProviderProps) => {
  const [isGuest, setIsGuest] = useState(false);
  const {
    data: user,
    loading,
    refetch,
  } = useAppwrite({
    fn: getCurrentUser,
    skip: true,
  });

  const guestUser: User = {
    $id: "guest",
    name: "Guest User",
    email: "guest@homenza.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=60&w=150&auto=format&fit=crop&ixlib=rb-4.0.3"
  };

  const loginAsGuest = () => {
    setIsGuest(true);
  };

  const logoutGuest = () => {
    setIsGuest(false);
  };

  const isLogged = !!user || isGuest;
  const currentUser = user || (isGuest ? guestUser : null);

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        user: currentUser,
        loading,
        refetch,
        loginAsGuest,
        logoutGuest,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context)
    throw new Error("useGlobalContext must be used within a GlobalProvider");

  return context;
};

export default GlobalProvider;
