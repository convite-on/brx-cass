import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Banknote, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WithdrawModal({ isOpen, onClose }: WithdrawModalProps) {
  const { user, canWithdraw, processWithdrawal } = useAuth();
  const [fullName, setFullName] = useState('');
  const [cpf, setCpf] = useState('');
  const [pixKey, setPixKey] = useState('');
  const [amount, setAmount] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  const withdrawCheck = canWithdraw();

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName || !cpf || !pixKey || !amount) {
      setError('Preencha todos os campos');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Valor inválido');
      return;
    }

    if (user && numAmount > user.balance) {
      setError('Saldo insuficiente');
      return;
    }

    // Processa o saque - reduz o saldo
    const success = processWithdrawal(numAmount);
    if (success) {
      setShowSuccess(true);
    } else {
      setError('Erro ao processar saque');
    }
  };

  const handleClose = () => {
    setFullName('');
    setCpf('');
    setPixKey('');
    setAmount('');
    setShowSuccess(false);
    setError('');
    onClose();
  };

  if (showSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="bg-[#1a1a2e] border-[#00d084] max-w-md">
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-[#00d084] mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">
              Saque Solicitado!
            </h3>
            <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-4 mb-4">
              <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-yellow-400 font-bold">
                Aguarde o processamento
              </p>
            </div>
            <p className="text-gray-300 mb-4">
              Seu saque está sendo processado e cairá em breve na sua conta PIX.
            </p>
            <p className="text-yellow-500 text-sm">
              ⚠️ Enquanto o saque não cair, você não poderá jogar para evitar bloqueio na conta.
            </p>
            <Button
              onClick={handleClose}
              className="mt-6 bg-[#00d084] hover:bg-[#00b874] text-black font-bold"
            >
              Entendi
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!withdrawCheck.allowed) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="bg-[#1a1a2e] border-yellow-500 max-w-md">
          <div className="text-center py-6">
            <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              Saque Bloqueado
            </h3>
            <p className="text-gray-300 mb-6">
              {withdrawCheck.message}
            </p>
            <Button
              onClick={handleClose}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
            >
              Entendi
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#1a1a2e] border-[#00d084] max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-white flex items-center justify-center gap-2">
            <Banknote className="w-6 h-6 text-[#00d084]" />
            Sacar
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div>
            <Label htmlFor="fullName" className="text-gray-300">Nome completo</Label>
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Digite seu nome completo"
              className="bg-[#0f0f1a] border-gray-700 text-white placeholder:text-gray-500"
            />
          </div>
          
          <div>
            <Label htmlFor="cpf" className="text-gray-300">CPF</Label>
            <Input
              id="cpf"
              type="text"
              value={cpf}
              onChange={(e) => setCpf(formatCPF(e.target.value))}
              placeholder="000.000.000-00"
              maxLength={14}
              className="bg-[#0f0f1a] border-gray-700 text-white placeholder:text-gray-500"
            />
          </div>
          
          <div>
            <Label htmlFor="pixKey" className="text-gray-300">Chave PIX</Label>
            <Input
              id="pixKey"
              type="text"
              value={pixKey}
              onChange={(e) => setPixKey(e.target.value)}
              placeholder="CPF, email, telefone ou chave aleatória"
              className="bg-[#0f0f1a] border-gray-700 text-white placeholder:text-gray-500"
            />
          </div>
          
          <div>
            <Label htmlFor="amount" className="text-gray-300">Valor do saque</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">R$</span>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0,00"
                className="bg-[#0f0f1a] border-gray-700 text-white placeholder:text-gray-500 pl-10"
              />
            </div>
            {user && (
              <p className="text-gray-500 text-xs mt-1">
                Saldo disponível: R$ {user.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            )}
          </div>
          
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
          
          <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-3">
            <p className="text-yellow-500 text-xs text-center">
              ⚠️ Após solicitar o saque, você não poderá jogar até o valor cair na sua conta.
            </p>
          </div>
          
          <Button
            type="submit"
            className="w-full bg-[#00d084] hover:bg-[#00b874] text-black font-bold py-3"
          >
            Solicitar Saque
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
