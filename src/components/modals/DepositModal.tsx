import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Wallet, ExternalLink } from 'lucide-react';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeposit: (amount: number) => void;
  pixApiUrl?: string;
}

const DEPOSIT_AMOUNTS = [
  { value: 20, label: 'R$ 20,00' },
  { value: 50, label: 'R$ 50,00' },
  { value: 75, label: 'R$ 75,00' },
  { value: 100, label: 'R$ 100,00' },
  { value: 200, label: 'R$ 200,00' },
  { value: 400, label: 'R$ 400,00' },
];

export function DepositModal({ isOpen, onClose, onDeposit, pixApiUrl }: DepositModalProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    if (selectedAmount) {
      // Redireciona para API Pix se configurada
      if (pixApiUrl && pixApiUrl.trim() !== '') {
        // Abre o gateway de pagamento em nova aba
        const paymentUrl = `${pixApiUrl}?amount=${selectedAmount}&callback=${encodeURIComponent(window.location.origin + '/casino')}`;
        window.open(paymentUrl, '_blank');
        
        // Fecha o modal
        setShowConfirm(false);
        setSelectedAmount(null);
        onClose();
        
        // Mostra alerta ao usuário
        alert('Você será redirecionado para o pagamento PIX. Após confirmar o pagamento, seu saldo será atualizado automaticamente.');
      } else {
        // Se não tem URL configurada, simula depósito para teste
        alert('URL do gateway PIX não configurada. Para produção, configure a variável pixApiUrl.');
        onDeposit(selectedAmount);
        setShowConfirm(false);
        setSelectedAmount(null);
        onClose();
      }
    }
  };

  const handleBack = () => {
    setShowConfirm(false);
    setSelectedAmount(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1a1a2e] border-[#00d084] max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-white flex items-center justify-center gap-2">
            <Wallet className="w-6 h-6 text-[#00d084]" />
            {showConfirm ? 'Confirmar Depósito' : 'Fazer Depósito'}
          </DialogTitle>
        </DialogHeader>
        
        {!showConfirm ? (
          <div className="py-4">
            <p className="text-gray-300 text-center mb-6">
              Escolha o valor do depósito:
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              {DEPOSIT_AMOUNTS.map((amount) => (
                <Button
                  key={amount.value}
                  onClick={() => handleAmountSelect(amount.value)}
                  className="bg-[#00d084]/20 hover:bg-[#00d084]/40 border border-[#00d084] text-[#00d084] font-bold py-4 text-lg"
                >
                  {amount.label}
                </Button>
              ))}
            </div>
            
            <p className="text-gray-500 text-xs text-center mt-4">
              Pagamento processado via PIX
            </p>
          </div>
        ) : (
          <div className="py-4 text-center">
            <p className="text-gray-300 mb-4">
              Você selecionou:
            </p>
            <p className="text-4xl font-bold text-[#00d084] mb-6">
              R$ {selectedAmount},00
            </p>
            
            <div className="bg-[#0f0f1a] rounded-lg p-4 mb-6">
              <p className="text-gray-400 text-sm mb-2">
                Ao confirmar, você será redirecionado para o gateway de pagamento PIX.
              </p>
              <p className="text-yellow-500 text-xs">
                Complete o pagamento e seu saldo será atualizado automaticamente.
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={handleBack}
                variant="outline"
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Voltar
              </Button>
              <Button
                onClick={handleConfirm}
                className="flex-1 bg-[#00d084] hover:bg-[#00b874] text-black font-bold"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Ir para Pagamento
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
