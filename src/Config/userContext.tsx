// src/context/userContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { clearUserDB, getUserFromDB, setUserToDB } from "./db";
import { setLogoutCallback } from "../Interceptors/Interceptor";

interface User {
  userId: string;
  username: string;
  mobileNo: string;
  email: string;
  role: string;
  account: any;
}

interface userDetails {
  user: User;
  token: string;
}
interface UserContextType {
  user: userDetails | null;
  login: (data: userDetails) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<userDetails | null>(null);

  useEffect(() => {
    const restoreUser = async () => {
      const storedUser = await getUserFromDB();
      if (storedUser) setUser(storedUser);
    };
    restoreUser();
  }, []);

   useEffect(() => {
     setLogoutCallback(logout);
   }, []);

  const login = (data: userDetails) => {
    setUser(data);
    setUserToDB(data);
  };

  const logout = () => {
    setUser(null);
    clearUserDB();
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
