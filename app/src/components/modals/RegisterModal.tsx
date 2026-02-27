import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus, Eye, EyeOff } from 'lucide-react';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (username: string, email: string, password: string) => boolean;
  onSwitchToLogin: () => void;
}

export function RegisterModal({ isOpen, onClose, onRegister, onSwitchToLogin }: RegisterModalProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !email || !password) {
      setError('Preencha todos os campos');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    const success = onRegister(username, email, password);
    if (!success) {
      setError('Email já cadastrado');
      return;
    }

    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1a1a2e] border-[#00d084] max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-white flex items-center justify-center gap-2">
            <UserPlus className="w-6 h-6 text-[#00d084]" />
            Criar Conta
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div>
            <Label htmlFor="username" className="text-gray-300">Nome de usuário</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite seu nome de usuário"
              className="bg-[#0f0f1a] border-gray-700 text-white placeholder:text-gray-500"
            />
          </div>
          
          <div>
            <Label htmlFor="email" className="text-gray-300">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu e-mail"
              className="bg-[#0f0f1a] border-gray-700 text-white placeholder:text-gray-500"
            />
          </div>
          
          <div>
            <Label htmlFor="password" className="text-gray-300">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                className="bg-[#0f0f1a] border-gray-700 text-white placeholder:text-gray-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          <div>
            <Label htmlFor="confirmPassword" className="text-gray-300">Confirmar senha</Label>
            <Input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirme sua senha"
              className="bg-[#0f0f1a] border-gray-700 text-white placeholder:text-gray-500"
            />
          </div>
          
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
          
          <Button
            type="submit"
            className="w-full bg-[#00d084] hover:bg-[#00b874] text-black font-bold py-3"
          >
            Cadastrar
          </Button>
        </form>
        
        <p className="text-center text-gray-400 text-sm">
          Já tem uma conta?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-[#00d084] hover:underline"
          >
            Faça login
          </button>
        </p>
      </DialogContent>
    </Dialog>
  );
}
