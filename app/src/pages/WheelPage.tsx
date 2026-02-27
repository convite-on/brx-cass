import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Sparkles, Trophy, Coins } from 'lucide-react';

// Configuração dos prêmios da roleta - 8 fatias editáveis
// Cada fatia tem sua própria imagem de fundo que pode ser editada
const WHEEL_PRIZES = [
  {
    id: 0,
    name: '1 MILHÃO',
    subtitle: 'EM SALDO REAL',
    value: 1000000,
    image: '/wheel/milhao.jpg',
    bgColor: '#1a5f1a',
    textColor: '#FFD700',
  },
  {
    id: 1,
    name: 'i7 PRO MAX',
    subtitle: '6 MIL EM SALDO',
    value: 6000,
    image: '/wheel/iphone.jpg',
    bgColor: '#8B4513',
    textColor: '#FFFFFF',
  },
  {
    id: 2,
    name: 'PORSCHE',
    subtitle: '800 MIL EM SALDO',
    value: 800000,
    image: '/wheel/porsche.jpg',
    bgColor: '#1a1a1a',
    textColor: '#00FF00',
  },
  {
    id: 3,
    name: '10 MIL REAIS',
    subtitle: 'EM SALDO REAL',
    value: 10000,
    image: '/wheel/10mil.jpg',
    bgColor: '#0066CC',
    textColor: '#FFD700',
    isWinner: true, // PRÊMIO FIXO - SEMPRE CAI AQUI
  },
  {
    id: 4,
    name: 'BMW R1250GS',
    subtitle: '100 MIL EM SALDO',
    value: 100000,
    image: '/wheel/bmw.jpg',
    bgColor: '#4a4a4a',
    textColor: '#FFFFFF',
  },
  {
    id: 5,
    name: '100 GIROS',
    subtitle: 'FORTUNE RABBIT',
    value: 0,
    image: '/wheel/rabbit.jpg',
    bgColor: '#9932CC',
    textColor: '#FFFFFF',
  },
  {
    id: 6,
    name: 'PS5',
    subtitle: '4 MIL EM SALDO',
    value: 4000,
    image: '/wheel/ps5.jpg',
    bgColor: '#4169E1',
    textColor: '#FFFFFF',
  },
  {
    id: 7,
    name: '50 GIROS',
    subtitle: 'FORTUNE TIGER',
    value: 0,
    image: '/wheel/tiger.jpg',
    bgColor: '#DC143C',
    textColor: '#FFD700',
  },
];

const SLICE_COUNT = 8;
const SLICE_ANGLE = 360 / SLICE_COUNT;

export function WheelPage() {
  const navigate = useNavigate();
  const { updateBalance } = useAuth();
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    const hasSpunBefore = localStorage.getItem('wheel_spun');
    if (hasSpunBefore === 'true') {
      navigate('/casino');
    }
  }, [navigate]);

  const spinWheel = () => {
    if (isSpinning || hasSpun) return;

    setIsSpinning(true);
    
    // A fatia vencedora é a de índice 3 (10 MIL REAIS)
    // Posição no topo da roleta (0 graus = topo)
    // Cada fatia tem 45 graus (360/8)
    // A fatia 3 vai de 90° a 135° (considerando 0° no topo)
    // Para parar no centro da fatia 3, precisamos de: 90° + 22.5° = 112.5°
    // Mas como a roleta gira no sentido horário, invertemos
    
    // Rotação para parar exatamente na fatia de 10 mil (posição 3)
    // A fatia 3 está na posição onde o ângulo é 112.5° do topo
    // Para trazer essa fatia para o topo (0°), giramos -112.5°
    // Mas queremos giros extras, então adicionamos voltas completas
    
    const extraSpins = 5 + Math.floor(Math.random() * 3); // 5 a 7 voltas
    const winnerRotation = extraSpins * 360 + 112.5; // 112.5° traz a fatia 3 para o topo
    
    setRotation(winnerRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setShowResult(true);
      setHasSpun(true);
      localStorage.setItem('wheel_spun', 'true');
      
      // Adiciona os 10 mil ao saldo
      updateBalance(10000);
    }, 5500);
  };

  const goToCasino = () => {
    navigate('/casino');
  };

  // Gera as fatias da roleta com imagens de fundo editáveis
  const renderWheelSlices = () => {
    return WHEEL_PRIZES.map((prize, index) => {
      const angle = index * SLICE_ANGLE;
      const nextAngle = (index + 1) * SLICE_ANGLE;
      
      // Calcula os pontos do arco SVG
      const startRad = (angle - 90) * (Math.PI / 180);
      const endRad = (nextAngle - 90) * (Math.PI / 180);
      
      const x1 = 50 + 50 * Math.cos(startRad);
      const y1 = 50 + 50 * Math.sin(startRad);
      const x2 = 50 + 50 * Math.cos(endRad);
      const y2 = 50 + 50 * Math.sin(endRad);
      
      // Posição do texto no centro da fatia
      const textAngle = (angle + SLICE_ANGLE / 2 - 90) * (Math.PI / 180);
      const textR = 32;
      const textX = 50 + textR * Math.cos(textAngle);
      const textY = 50 + textR * Math.sin(textAngle);

      return (
        <g key={prize.id}>
          {/* Definição da imagem de fundo da fatia */}
          <defs>
            <pattern 
              id={`slice-img-${prize.id}`} 
              patternUnits="objectBoundingBox" 
              width="1" 
              height="1"
              preserveAspectRatio="xMidYMid slice"
            >
              <image 
                href={prize.image} 
                x="0" 
                y="0" 
                width="1" 
                height="1" 
                preserveAspectRatio="xMidYMid slice"
              />
            </pattern>
            <clipPath id={`slice-clip-${prize.id}`}>
              <path d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`} />
            </clipPath>
          </defs>
          
          {/* Fatia com imagem de fundo */}
          <path
            d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`}
            fill={`url(#slice-img-${prize.id})`}
            stroke="#FFD700"
            strokeWidth="0.8"
          />
          
          {/* Overlay para melhorar legibilidade do texto */}
          <path
            d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`}
            fill="rgba(0,0,0,0.5)"
          />
          
          {/* Nome do prêmio */}
          <text
            x={textX}
            y={textY - 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={prize.textColor}
            fontSize="4"
            fontWeight="bold"
            style={{ 
              textShadow: '1px 1px 3px rgba(0,0,0,0.9)',
              fontFamily: 'Arial, sans-serif'
            }}
          >
            {prize.name}
          </text>
          
          {/* Subtítulo */}
          <text
            x={textX}
            y={textY + 3}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#FFFFFF"
            fontSize="2.2"
            fontWeight="normal"
            style={{ 
              textShadow: '1px 1px 2px rgba(0,0,0,0.9)',
              fontFamily: 'Arial, sans-serif'
            }}
          >
            {prize.subtitle}
          </text>
        </g>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a14] via-[#1a1a2e] to-[#0f0f1a] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background com efeito de moedas caindo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-yellow-900/50 to-transparent" />
        {/* Partículas douradas animadas */}
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-yellow-400 rounded-full"
            style={{
              width: Math.random() * 6 + 2 + 'px',
              height: Math.random() * 6 + 2 + 'px',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0.1, 0.9, 0.1],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Botão de som */}
      <button
        onClick={() => setSoundEnabled(!soundEnabled)}
        className="absolute top-4 right-4 p-3 bg-black/60 backdrop-blur-sm rounded-full text-white hover:bg-black/80 z-20 transition-colors border border-yellow-500/30"
      >
        {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
      </button>

      {/* Título */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-6 md:mb-8 z-10"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="inline-block mb-2"
        >
          <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-yellow-400 inline-block mr-2" />
        </motion.div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 mb-2 drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]">
          RODA DA FORTUNA
        </h1>
        <p className="text-gray-400 text-sm md:text-base">Gire agora e ganhe prêmios incríveis!</p>
      </motion.div>

      {/* Container da roleta */}
      <div className="relative z-10">
        {/* Seta indicadora no topo */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-30">
          <motion.div 
            className="w-0 h-0 border-l-[18px] border-r-[18px] border-t-[40px] border-l-transparent border-r-transparent border-t-yellow-400 drop-shadow-[0_0_15px_rgba(255,215,0,1)]"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        </div>

        {/* Roleta */}
        <div className="relative w-[300px] h-[300px] md:w-[420px] md:h-[420px]">
          {/* Borda externa dourada com luzes piscantes */}
          <div className="absolute inset-0 rounded-full border-4 md:border-6 border-yellow-500 shadow-[0_0_60px_rgba(255,215,0,0.5)]">
            {/* Luzes LED ao redor */}
            {[...Array(24)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: i % 2 === 0 ? '10px' : '8px',
                  height: i % 2 === 0 ? '10px' : '8px',
                  left: `${50 + 48 * Math.cos((i * 15 - 90) * Math.PI / 180)}%`,
                  top: `${50 + 48 * Math.sin((i * 15 - 90) * Math.PI / 180)}%`,
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: i % 2 === 0 ? '#FFD700' : '#FFF8DC',
                  boxShadow: '0 0 10px rgba(255,215,0,0.8)',
                }}
                animate={{
                  opacity: [0.4, 1, 0.4],
                  scale: [0.8, 1.3, 0.8],
                }}
                transition={{
                  duration: 0.4,
                  repeat: Infinity,
                  delay: i * 0.02,
                }}
              />
            ))}
          </div>

          {/* SVG da roleta com imagens */}
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] md:inset-3 md:w-[calc(100%-24px)] md:h-[calc(100%-24px)] rounded-full overflow-hidden"
            style={{ 
              transform: `rotate(${rotation}deg)`, 
              transition: isSpinning ? 'transform 5.5s cubic-bezier(0.1, 0.7, 0.1, 1)' : 'none',
              filter: 'drop-shadow(0 0 20px rgba(255,215,0,0.4))'
            }}
          >
            {/* Círculo de fundo */}
            <circle cx="50" cy="50" r="50" fill="#1a1a2e" />
            
            {/* Fatias da roleta com imagens */}
            {renderWheelSlices()}
          </svg>

          {/* Centro da roleta com botão GIRAR */}
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button
              onClick={spinWheel}
              disabled={isSpinning || hasSpun}
              className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-500 via-yellow-600 to-yellow-700 flex flex-col items-center justify-center font-black text-black shadow-[0_0_40px_rgba(255,215,0,0.7)] disabled:opacity-60 disabled:cursor-not-allowed border-4 border-yellow-700 transition-all hover:shadow-[0_0_50px_rgba(255,215,0,0.9)]"
            >
              {isSpinning ? (
                <motion.span 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="text-2xl md:text-3xl"
                >
                  ⟳
                </motion.span>
              ) : (
                <>
                  <span className="text-base md:text-xl tracking-wider">GIRAR</span>
                  <Sparkles className="w-4 h-4 md:w-5 md:h-5 mt-1" />
                </>
              )}
            </button>
          </motion.div>
        </div>
      </div>

      {/* Instruções */}
      {!hasSpun && !showResult && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-yellow-400/70 text-sm mt-6 z-10 animate-pulse"
        >
          ✨ Clique no botão GIRAR para ganhar seu prêmio! ✨
        </motion.p>
      )}

      {/* Modal de resultado - MENSAGEM DE PARABÉNS */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4"
          >
            {/* Efeito de confetes no fundo */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(50)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 rounded"
                  style={{
                    backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'][i % 5],
                    left: `${Math.random() * 100}%`,
                    top: '-20px',
                  }}
                  animate={{
                    y: ['0vh', '120vh'],
                    x: [0, (Math.random() - 0.5) * 200],
                    rotate: [0, 720],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                    ease: 'linear',
                  }}
                />
              ))}
            </div>

            <motion.div 
              initial={{ scale: 0.3, opacity: 0, y: 100 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: -50 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="bg-gradient-to-b from-[#1a1a2e] via-[#252540] to-[#0f0f1a] border-4 border-yellow-500 rounded-3xl p-6 md:p-10 max-w-md w-full text-center shadow-[0_0_80px_rgba(255,215,0,0.6)] relative overflow-hidden"
            >
              {/* Brilho de fundo */}
              <div className="absolute inset-0 bg-gradient-radial from-yellow-500/20 via-transparent to-transparent" />
              
              {/* Ícone de troféu */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 10, delay: 0.3 }}
                className="relative z-10"
              >
                <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-4 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(255,215,0,0.8)]">
                  <Trophy className="w-14 h-14 md:w-20 md:h-20 text-black" />
                </div>
              </motion.div>
              
              {/* Título PARABÉNS */}
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 mb-2 drop-shadow-[0_0_10px_rgba(255,215,0,0.5)] relative z-10"
              >
                PARABÉNS!
              </motion.h2>
              
              {/* Mensagem */}
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-gray-300 text-lg mb-4 relative z-10"
              >
                Você ganhou na Roda da Fortuna!
              </motion.p>
              
              {/* Valor do prêmio */}
              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 150, damping: 10, delay: 0.9 }}
                className="relative z-10 mb-4"
              >
                <div className="bg-gradient-to-r from-green-600 via-green-500 to-green-600 rounded-2xl p-4 md:p-6 shadow-[0_0_30px_rgba(0,255,0,0.4)] border-2 border-green-400">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Coins className="w-6 h-6 md:w-8 md:h-8 text-yellow-300" />
                    <span className="text-white text-sm md:text-base font-bold">PRÊMIO EM SALDO REAL</span>
                    <Coins className="w-6 h-6 md:w-8 md:h-8 text-yellow-300" />
                  </div>
                  <div className="text-5xl md:text-6xl font-black text-white drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                    R$ 10.000,00
                  </div>
                </div>
              </motion.div>
              
              {/* Mensagem adicional */}
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
                className="text-yellow-400/80 text-sm mb-6 relative z-10"
              >
                🎉 O valor foi adicionado ao seu saldo! 🎉
              </motion.p>
              
              {/* Botão */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 }}
                className="relative z-10"
              >
                <Button
                  onClick={goToCasino}
                  className="w-full bg-gradient-to-r from-[#00d084] to-[#00b874] hover:from-[#00e090] hover:to-[#00c080] text-black font-black py-4 text-lg md:text-xl rounded-xl shadow-[0_0_30px_rgba(0,208,132,0.5)] transition-all hover:shadow-[0_0_40px_rgba(0,208,132,0.7)] hover:scale-[1.02]"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  IR PARA O CASSINO
                  <Sparkles className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
