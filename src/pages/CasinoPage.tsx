import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Wallet, 
  User, 
  LogOut, 
  Gamepad2, 
  Flame, 
  Sparkles,
  MonitorPlay,
  TrendingUp,
  Search
} from 'lucide-react';
import { 
  DepositModal, 
  WithdrawModal, 
  DepositRequiredModal,
  LoginModal,
  RegisterModal,
  PendingWithdrawalModal
} from '@/components/modals';
import type { Game } from '@/types';

// Lista de jogos - EDITÁVEL
const GAMES: Game[] = [
  {
    id: '1',
    name: 'Fortune Tiger',
    provider: 'PG Soft',
    image: '/games/fortune-tiger.jpg',
    category: 'slots',
    popular: true,
  },
  {
    id: '2',
    name: 'Fortune Rabbit',
    provider: 'PG Soft',
    image: '/games/fortune-rabbit.jpg',
    category: 'slots',
    popular: true,
  },
  {
    id: '3',
    name: 'Fortune Snake',
    provider: 'PG Soft',
    image: '/games/fortune-snake.jpg',
    category: 'slots',
  },
  {
    id: '4',
    name: 'Gates of Olympus',
    provider: 'Pragmatic Play',
    image: '/games/gates-of-olympus.jpg',
    category: 'slots',
    popular: true,
  },
  {
    id: '5',
    name: 'Sweet Bonanza',
    provider: 'Pragmatic Play',
    image: '/games/sweet-bonanza.jpg',
    category: 'slots',
    popular: true,
  },
  {
    id: '6',
    name: 'Aviator',
    provider: 'Spribe',
    image: '/games/aviator.jpg',
    category: 'crash',
    popular: true,
  },
  {
    id: '7',
    name: 'Spaceman',
    provider: 'Pragmatic Play',
    image: '/games/spaceman.jpg',
    category: 'crash',
  },
  {
    id: '8',
    name: 'Lightning Roulette',
    provider: 'Evolution',
    image: '/games/lightning-roulette.jpg',
    category: 'live',
  },
  {
    id: '9',
    name: 'Dream Catcher',
    provider: 'Evolution',
    image: '/games/dream-catcher.jpg',
    category: 'live',
  },
  {
    id: '10',
    name: 'Dragon Tiger',
    provider: 'Evolution',
    image: '/games/dragon-tiger.jpg',
    category: 'live',
  },
  {
    id: '11',
    name: 'Mega Moolah',
    provider: 'Microgaming',
    image: '/games/mega-moolah.jpg',
    category: 'slots',
  },
  {
    id: '12',
    name: 'Wolf Gold',
    provider: 'Pragmatic Play',
    image: '/games/wolf-gold.jpg',
    category: 'slots',
  },
];

const CATEGORIES = [
  { id: 'all', name: 'Todos', icon: Gamepad2 },
  { id: 'popular', name: 'Populares', icon: Flame },
  { id: 'slots', name: 'Slots', icon: Sparkles },
  { id: 'live', name: 'Ao Vivo', icon: MonitorPlay },
  { id: 'crash', name: 'Crash', icon: TrendingUp },
];

export function CasinoPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, login, register, logout, addDeposit, canPlay, hasPendingWithdrawal } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showDepositRequired, setShowDepositRequired] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showPendingWithdrawal, setShowPendingWithdrawal] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [pixApiUrl, setPixApiUrl] = useState('');

  useEffect(() => {
    // Carrega URL da API Pix do localStorage (configurável)
    const savedPixUrl = localStorage.getItem('pix_api_url') || '';
    setPixApiUrl(savedPixUrl);
    
    // Verifica se o usuário acabou de se registrar (não girou a roleta ainda)
    const hasSpun = localStorage.getItem('wheel_spun');
    if (isAuthenticated && hasSpun !== 'true') {
      // Redireciona para a roleta se ainda não girou
      navigate('/roleta');
    }
  }, [isAuthenticated, navigate]);

  const filteredGames = GAMES.filter(game => {
    const matchesCategory = 
      selectedCategory === 'all' ? true :
      selectedCategory === 'popular' ? game.popular :
      game.category === selectedCategory;
    
    const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const handleGameClick = (game: Game) => {
    if (!isAuthenticated) {
      setShowRegisterModal(true);
      return;
    }

    // Verifica se pode jogar (inclui verificação de saque pendente)
    const playCheck = canPlay();
    if (!playCheck.allowed) {
      if (hasPendingWithdrawal) {
        setShowPendingWithdrawal(true);
      } else {
        setSelectedGame(game);
        setShowDepositRequired(true);
      }
      return;
    }

    // Aqui você pode redirecionar para o jogo real
    alert(`Abrindo ${game.name}...`);
  };

  const handleDeposit = (amount: number) => {
    addDeposit(amount);
    setShowDepositModal(false);
    alert(`Depósito de R$ ${amount},00 confirmado! Seu saldo foi atualizado.`);
  };

  const handleRegister = (username: string, email: string, password: string): boolean => {
    const success = register(username, email, password);
    if (success) {
      // Após cadastro bem-sucedido, redireciona para a roleta
      navigate('/roleta');
    }
    return success;
  };

  const formatBalance = (balance: number) => {
    return balance.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a14]">
      {/* Header */}
      <header className="bg-[#1a1a2e] border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#00d084] to-[#00a868] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <span className="text-white font-bold text-xl hidden sm:block">BRX</span>
            </div>

            {/* Saldo - Visível em mobile também */}
            {isAuthenticated && user && (
              <div className="flex items-center gap-2 bg-[#0f0f1a] rounded-lg px-3 py-2">
                <Wallet className="w-4 h-4 text-[#00d084]" />
                <span className="text-white font-bold text-sm sm:text-base">
                  {formatBalance(user.balance)}
                </span>
              </div>
            )}

            {/* Ações */}
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <>
                  <Button
                    onClick={() => setShowDepositModal(true)}
                    className="bg-[#00d084] hover:bg-[#00b874] text-black font-bold text-xs sm:text-sm px-3 sm:px-4"
                  >
                    Depositar
                  </Button>
                  <Button
                    onClick={() => setShowWithdrawModal(true)}
                    variant="outline"
                    className="border-[#00d084] text-[#00d084] hover:bg-[#00d084]/10 text-xs sm:text-sm px-3 sm:px-4"
                  >
                    Sacar
                  </Button>
                  <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-700">
                    <User className="w-5 h-5 text-gray-400" />
                    <span className="text-white text-sm hidden sm:block">{user?.username}</span>
                    <button
                      onClick={logout}
                      className="p-2 hover:bg-gray-800 rounded-lg"
                    >
                      <LogOut className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => setShowLoginModal(true)}
                    variant="outline"
                    className="border-gray-600 text-white hover:bg-gray-800 text-xs sm:text-sm"
                  >
                    Entrar
                  </Button>
                  <Button
                    onClick={() => setShowRegisterModal(true)}
                    className="bg-[#00d084] hover:bg-[#00b874] text-black font-bold text-xs sm:text-sm"
                  >
                    Cadastrar
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#00d084]/20 to-[#00a868]/20 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Bem-vindo ao <span className="text-[#00d084]">BRX Cassino</span>
            </h1>
            <p className="text-gray-400">
              Os melhores jogos e as maiores chances de ganhar!
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar jogos..."
              className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#00d084]"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-[#00d084] text-black font-bold'
                    : 'bg-[#1a1a2e] text-gray-400 hover:bg-[#252540]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {category.name}
              </button>
            );
          })}
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredGames.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleGameClick(game)}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#1a1a2e] border border-gray-800 group-hover:border-[#00d084] transition-all group-hover:shadow-[0_0_20px_rgba(0,208,132,0.3)]">
                {/* Game Image */}
                <img 
                  src={game.image} 
                  alt={game.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
                
                {/* Popular Badge */}
                {game.popular && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    HOT
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-[#00d084]/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button className="bg-black text-white font-bold px-6">
                    JOGAR
                  </Button>
                </div>

                {/* Game Info */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
                  <h3 className="text-white font-bold text-sm truncate">{game.name}</h3>
                  <p className="text-gray-400 text-xs">{game.provider}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredGames.length === 0 && (
          <div className="text-center py-12">
            <Gamepad2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">Nenhum jogo encontrado</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#1a1a2e] border-t border-gray-800 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">
            © 2024 BRX Cassino. Todos os direitos reservados.
          </p>
          <p className="text-gray-600 text-xs mt-2">
            Jogue com responsabilidade. O jogo pode ser viciante.
          </p>
        </div>
      </footer>

      {/* Modals */}
      <DepositModal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        onDeposit={handleDeposit}
        pixApiUrl={pixApiUrl}
      />

      <WithdrawModal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
      />

      <DepositRequiredModal
        isOpen={showDepositRequired}
        onClose={() => setShowDepositRequired(false)}
        onDeposit={() => {
          setShowDepositRequired(false);
          setShowDepositModal(true);
        }}
        gameName={selectedGame?.name}
      />

      <PendingWithdrawalModal
        isOpen={showPendingWithdrawal}
        onClose={() => setShowPendingWithdrawal(false)}
      />

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={login}
        onSwitchToRegister={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }}
      />

      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onRegister={handleRegister}
        onSwitchToLogin={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}
      />
    </div>
  );
}
