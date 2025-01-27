import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { trpc } from '@/trpc';
import { User } from '@server/shared/types';

type UserContextType = {
    user: User | null;
    fetchUserData: () => Promise<void>;
  };
  
  const UserContext = createContext<UserContextType>({
    user: null,
    fetchUserData: async () => {},
  });
  
  export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
  
    const fetchUserData = async () => {
      try {
        const data = await trpc.user.getCurrentUser.query();
        setUser(data);
      } catch (err) {
        console.error('Failed to fetch user data', err);
      }
    };
  
    useEffect(() => {
      fetchUserData();
    }, []);
  
    const contextValue = { user, fetchUserData };
  
    return (
      <UserContext.Provider value={contextValue}>
        {children}
      </UserContext.Provider>
    );
  }
  
  export default function useUserContext() {
    return useContext(UserContext);
  }
