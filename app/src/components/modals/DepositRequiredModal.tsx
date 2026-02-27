import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Gamepad2 } from 'lucide-react';

interface DepositRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeposit: () => void;
  gameName?: string;
}

export function DepositRequiredModal({ isOpen, onClose, onDeposit, gameName }: DepositRequiredModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1a1a2e] border-yellow-500 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-white flex items-center justify-center gap-2">
            <Gamepad2 className="w-6 h-6 text-yellow-500" />
            Acesso ao Jogo
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center py-4">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          
          <p className="text-gray-300 mb-2">
            {gameName ? `Para jogar ${gameName}` : 'Para acessar os jogos'}
          </p>
          <p className="text-white font-bold text-lg mb-4">
            Você precisa fazer um depósito primeiro!
          </p>
          
          <div className="bg-[#0f0f1a] rounded-lg p-4 mb-6">
            <p className="text-gray-400 text-sm">
              Faça seu primeiro depósito e desbloqueie todos os jogos do cassino. 
              Além disso, você poderá sacar seus ganhos a qualquer momento!
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Depois
            </Button>
            <Button
              onClick={onDeposit}
              className="flex-1 bg-[#00d084] hover:bg-[#00b874] text-black font-bold"
            >
              Fazer Depósito
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
