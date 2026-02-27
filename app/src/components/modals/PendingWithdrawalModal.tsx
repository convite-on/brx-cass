import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Clock, AlertTriangle } from 'lucide-react';

interface PendingWithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PendingWithdrawalModal({ isOpen, onClose }: PendingWithdrawalModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1a1a2e] border-yellow-500 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-white flex items-center justify-center gap-2">
            <Clock className="w-6 h-6 text-yellow-500" />
            Saque em Processamento
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center py-4">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          
          <p className="text-white font-bold text-lg mb-4">
            Aguarde o saque cair!
          </p>
          
          <div className="bg-[#0f0f1a] rounded-lg p-4 mb-6">
            <p className="text-gray-300 text-sm mb-2">
              Você tem um saque em processamento.
            </p>
            <p className="text-yellow-400 text-sm font-bold">
              Para não levar bloqueio na conta, aguarde o valor cair na sua conta PIX antes de continuar jogando.
            </p>
          </div>
          
          <Button
            onClick={onClose}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
          >
            Entendi
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
