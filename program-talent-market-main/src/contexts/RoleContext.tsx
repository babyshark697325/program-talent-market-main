
import React, { createContext, useContext, useState, ReactNode } from 'react';

type UserRole = 'student' | 'client' | 'admin';

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};

interface RoleProviderProps {
  children: ReactNode;
}

export const RoleProvider: React.FC<RoleProviderProps> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('client');

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};
