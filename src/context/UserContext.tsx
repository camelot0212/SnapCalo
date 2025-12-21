import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile } from '../types';
import { getUserProfile, saveUserProfile } from '../lib/storage';

interface UserContextType {
  user: UserProfile | null;
  setUser: (user: UserProfile) => void;
  isLoading: boolean;
  updateUser: (user: UserProfile) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = () => {
      const profile = getUserProfile();
      if (profile) {
        setUserState(profile);
      }
      setIsLoading(false);
    };
    loadUser();
  }, []);

  const updateUser = (newUser: UserProfile) => {
    saveUserProfile(newUser);
    setUserState(newUser);
  };

  const setUser = (newUser: UserProfile) => {
      // This is for initial setting or overriding without saving? 
      // Actually updateUser does save. Let's alias or keep separate if needed.
      // Ideally we always save when we update user.
      updateUser(newUser);
  }

  return (
    <UserContext.Provider value={{ user, setUser, isLoading, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
