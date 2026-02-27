import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface AgeVerificationModalProps {
  isOpen: boolean;
  onVerify: () => void;
  onReject: () => void;
}

export function AgeVerificationModal({ isOpen, onVerify, onReject }: AgeVerificationModalProps) {
  return (
    <Dialog open={isOpen} modal>
      <DialogContent className="bg-[#1a1a2e] border-[#00d084] max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-white flex items-center justify-center gap-2">
            <AlertTriangle className="w-8 h-8 text-yellow-500" />
            Atenção
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center py-6">
          <div className="mb-6">
            <span className="text-6xl font-bold text-[#00d084]">18+</span>
          </div>
          
          <p className="text-gray-300 mb-2">
            Este site contém conteúdo destinado a maiores de 18 anos.
          </p>
          <p className="text-gray-400 text-sm mb-6">
            Jogue com responsabilidade. O jogo pode ser viciante.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Button
              onClick={onReject}
              variant="outline"
              className="px-6 py-3 border-red-500 text-red-500 hover:bg-red-500/10"
            >
              Tenho menos de 18
            </Button>
            <Button
              onClick={onVerify}
              className="px-6 py-3 bg-[#00d084] hover:bg-[#00b874] text-black font-bold"
            >
              Sou maior de 18
            </Button>
          </div>
        </div>
        
        <p className="text-xs text-gray-500 text-center">
          Ao continuar, você confirma que tem idade legal para jogar.
        </p>
      </DialogContent>
    </Dialog>
  );
}
