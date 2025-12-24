"use client";

import { createContext, useState } from "react";

export interface User {
  email: string;
}

interface UserContext {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const UserContext = createContext<UserContext>({
  user: null,
  setUser: () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
