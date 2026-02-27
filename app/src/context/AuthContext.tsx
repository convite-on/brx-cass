import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAgeVerified: boolean;
  hasPendingWithdrawal: boolean;
  login: (email: string, password: string) => boolean;
  register: (username: string, email: string, password: string) => boolean;
  logout: () => void;
  verifyAge: () => void;
  updateBalance: (amount: number) => void;
  addDeposit: (amount: number) => void;
  processWithdrawal: (amount: number) => boolean;
  canWithdraw: () => { allowed: boolean; message: string };
  canPlay: () => { allowed: boolean; message: string };
  clearPendingWithdrawal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const WITHDRAWAL_THRESHOLD = 10000;
const MIN_DEPOSIT_FOR_HIGH_BALANCE = 100;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [hasPendingWithdrawal, setHasPendingWithdrawal] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('casino_user');
    const storedAgeVerified = localStorage.getItem('age_verified');
    const storedPendingWithdrawal = localStorage.getItem('pending_withdrawal');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedAgeVerified === 'true') {
      setIsAgeVerified(true);
    }
    if (storedPendingWithdrawal === 'true') {
      setHasPendingWithdrawal(true);
    }
  }, []);

  const verifyAge = () => {
    setIsAgeVerified(true);
    localStorage.setItem('age_verified', 'true');
  };

  const register = (username: string, email: string, password: string): boolean => {
    const existingUsers = JSON.parse(localStorage.getItem('casino_users') || '[]');
    
    if (existingUsers.find((u: any) => u.email === email)) {
      return false;
    }

    const newUser: User = {
      id: Date.now().toString(),
      username,
      email,
      balance: 0, // Começa com 0, ganha 10mil na roleta
      hasDeposited: false,
      totalDeposited: 0,
      createdAt: new Date().toISOString(),
    };

    existingUsers.push({ ...newUser, password });
    localStorage.setItem('casino_users', JSON.stringify(existingUsers));
    localStorage.setItem('casino_user', JSON.stringify(newUser));
    setUser(newUser);
    return true;
  };

  const login = (email: string, password: string): boolean => {
    const existingUsers = JSON.parse(localStorage.getItem('casino_users') || '[]');
    const foundUser = existingUsers.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      localStorage.setItem('casino_user', JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('casino_user');
    setUser(null);
  };

  const updateBalance = (amount: number) => {
    if (user) {
      const updatedUser = { ...user, balance: user.balance + amount };
      setUser(updatedUser);
      localStorage.setItem('casino_user', JSON.stringify(updatedUser));
      
      // Atualiza também na lista de usuários
      const existingUsers = JSON.parse(localStorage.getItem('casino_users') || '[]');
      const updatedUsers = existingUsers.map((u: any) => 
        u.id === user.id ? { ...u, balance: updatedUser.balance } : u
      );
      localStorage.setItem('casino_users', JSON.stringify(updatedUsers));
    }
  };

  const addDeposit = (amount: number) => {
    if (user) {
      const updatedUser = { 
        ...user, 
        balance: user.balance + amount,
        hasDeposited: true,
        totalDeposited: user.totalDeposited + amount
      };
      setUser(updatedUser);
      localStorage.setItem('casino_user', JSON.stringify(updatedUser));
      
      const existingUsers = JSON.parse(localStorage.getItem('casino_users') || '[]');
      const updatedUsers = existingUsers.map((u: any) => 
        u.id === user.id ? { ...u, balance: updatedUser.balance, hasDeposited: true, totalDeposited: updatedUser.totalDeposited } : u
      );
      localStorage.setItem('casino_users', JSON.stringify(updatedUsers));
    }
  };

  // Processa o saque - reduz o saldo e marca como pendente
  const processWithdrawal = (amount: number): boolean => {
    if (!user) return false;
    
    if (amount > user.balance) {
      return false;
    }

    const updatedUser = { 
      ...user, 
      balance: user.balance - amount
    };
    setUser(updatedUser);
    localStorage.setItem('casino_user', JSON.stringify(updatedUser));
    
    // Marca que há um saque pendente
    setHasPendingWithdrawal(true);
    localStorage.setItem('pending_withdrawal', 'true');
    
    const existingUsers = JSON.parse(localStorage.getItem('casino_users') || '[]');
    const updatedUsers = existingUsers.map((u: any) => 
      u.id === user.id ? { ...u, balance: updatedUser.balance } : u
    );
    localStorage.setItem('casino_users', JSON.stringify(updatedUsers));
    
    return true;
  };

  // Limpa o estado de saque pendente (para testes)
  const clearPendingWithdrawal = () => {
    setHasPendingWithdrawal(false);
    localStorage.removeItem('pending_withdrawal');
  };

  const canWithdraw = (): { allowed: boolean; message: string } => {
    if (!user) {
      return { allowed: false, message: 'Faça login para continuar' };
    }

    if (!user.hasDeposited) {
      return { allowed: false, message: 'Você precisa fazer um depósito antes de sacar' };
    }

    if (user.balance > WITHDRAWAL_THRESHOLD && user.totalDeposited < MIN_DEPOSIT_FOR_HIGH_BALANCE) {
      return { 
        allowed: false, 
        message: `Seu saldo é muito alto. Para sacar, faça um depósito de pelo menos R$ ${MIN_DEPOSIT_FOR_HIGH_BALANCE},00` 
      };
    }

    return { allowed: true, message: '' };
  };

  // Verifica se pode jogar (não pode se tiver saque pendente)
  const canPlay = (): { allowed: boolean; message: string } => {
    if (!user) {
      return { allowed: false, message: 'Faça login para continuar' };
    }

    if (hasPendingWithdrawal) {
      return { 
        allowed: false, 
        message: 'Você tem um saque em processamento. Aguarde o saque cair para continuar jogando e não levar bloqueio na conta.' 
      };
    }

    if (!user.hasDeposited) {
      return { 
        allowed: false, 
        message: 'Você precisa fazer um depósito antes de jogar' 
      };
    }

    return { allowed: true, message: '' };
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isAgeVerified,
      hasPendingWithdrawal,
      login,
      register,
      logout,
      verifyAge,
      updateBalance,
      addDeposit,
      processWithdrawal,
      canWithdraw,
      canPlay,
      clearPendingWithdrawal,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
