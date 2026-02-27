import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn, Eye, EyeOff } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => boolean;
  onSwitchToRegister: () => void;
}

export function LoginModal({ isOpen, onClose, onLogin, onSwitchToRegister }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Preencha todos os campos');
      return;
    }

    const success = onLogin(email, password);
    if (!success) {
      setError('Email ou senha incorretos');
      return;
    }

    setEmail('');
    setPassword('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1a1a2e] border-[#00d084] max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-white flex items-center justify-center gap-2">
            <LogIn className="w-6 h-6 text-[#00d084]" />
            Entrar
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div>
            <Label htmlFor="loginEmail" className="text-gray-300">E-mail</Label>
            <Input
              id="loginEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu e-mail"
              className="bg-[#0f0f1a] border-gray-700 text-white placeholder:text-gray-500"
            />
          </div>
          
          <div>
            <Label htmlFor="loginPassword" className="text-gray-300">Senha</Label>
            <div className="relative">
              <Input
                id="loginPassword"
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
          
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
          
          <Button
            type="submit"
            className="w-full bg-[#00d084] hover:bg-[#00b874] text-black font-bold py-3"
          >
            Entrar
          </Button>
        </form>
        
        <p className="text-center text-gray-400 text-sm">
          Não tem uma conta?{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-[#00d084] hover:underline"
          >
            Cadastre-se
          </button>
        </p>
      </DialogContent>
    </Dialog>
  );
}
