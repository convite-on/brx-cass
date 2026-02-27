// Tipos do Cassino

export interface User {
  id: string;
  username: string;
  email: string;
  balance: number;
  hasDeposited: boolean;
  totalDeposited: number;
  createdAt: string;
}

export interface Game {
  id: string;
  name: string;
  provider: string;
  image: string;
  category: 'slots' | 'live' | 'crash' | 'table';
  popular?: boolean;
}

export interface DepositAmount {
  value: number;
  label: string;
}

export interface WithdrawalRequest {
  fullName: string;
  cpf: string;
  pixKey: string;
  amount: number;
}

export interface WheelPrize {
  id: number;
  name: string;
  value: string;
  image: string;
  color: string;
  isWinner?: boolean;
}
