// ========== VARIÁVEIS GLOBAIS ==========
let currentUser = null;
let userBalance = 10000;
let hasDeposited = false;
let selectedDepositAmount = 0;
let isSpinning = false;
let wheelRotation = 0;

// Configuração da roleta - 8 fatias
const wheelSlices = [
    { label: 'R$ 10 MIL', color: '#FFD700', textColor: '#000', icon: '💰' },
    { label: '100 GIROS', color: '#FF6B00', textColor: '#fff', icon: '🎰' },
    { label: 'R$ 1 MIL', color: '#8B4513', textColor: '#fff', icon: '💵' },
    { label: 'PS5', color: '#4169E1', textColor: '#fff', icon: '🎮' },
    { label: '50 GIROS', color: '#DC143C', textColor: '#fff', icon: '🐯' },
    { label: 'R$ 500', color: '#228B22', textColor: '#fff', icon: '💎' },
    { label: 'iPhone', color: '#C0C0C0', textColor: '#000', icon: '📱' },
    { label: 'R$ 100', color: '#800080', textColor: '#fff', icon: '🎯' }
];

// Índice do prêmio vencedor (R$ 10 MIL = índice 0)
const winningIndex = 0;

// Lista de jogos com imagens
const games = [
    { name: 'Fortune Tiger', provider: 'PG Soft', image: 'images/game-tiger.jpg' },
    { name: 'Fortune Rabbit', provider: 'PG Soft', image: 'images/game-rabbit.jpg' },
    { name: 'Fortune Ox', provider: 'PG Soft', image: 'images/game-ox.jpg' },
    { name: 'Fortune Mouse', provider: 'PG Soft', image: 'images/game-mouse.jpg' },
    { name: 'Fortune Dragon', provider: 'PG Soft', image: 'images/game-dragon.jpg' },
    { name: 'Gates of Olympus', provider: 'Pragmatic', image: 'images/game-olympus.jpg' },
    { name: 'Sweet Bonanza', provider: 'Pragmatic', image: 'images/game-sweet.jpg' },
    { name: 'Starlight Princess', provider: 'Pragmatic', image: 'images/game-princess.jpg' },
    { name: 'Big Bass Bonanza', provider: 'Pragmatic', icon: '🎣', color: '#4682B4' },
    { name: 'Wolf Gold', provider: 'Pragmatic', icon: '🐺', color: '#DAA520' },
    { name: 'Book of Dead', provider: 'Play\'n GO', icon: '📖', color: '#B8860B' },
    { name: 'Legacy of Dead', provider: 'Play\'n GO', icon: '⚱️', color: '#CD853F' }
];

// ========== INICIALIZAÇÃO ==========
document.addEventListener('DOMContentLoaded', function() {
    // Verifica se já confirmou idade
    const ageConfirmed = localStorage.getItem('ageConfirmed');
    if (ageConfirmed === 'true') {
        document.getElementById('age-verification').classList.add('hidden');
        showRegister();
    }
    
    // Inicializa a roleta
    initRoulette();
    
    // Gera os jogos
    generateGames();
    
    // Máscaras de input
    setupInputMasks();
});

// ========== VERIFICAÇÃO DE IDADE ==========
function confirmAge(confirmed) {
    if (confirmed) {
        localStorage.setItem('ageConfirmed', 'true');
        document.getElementById('age-verification').classList.add('hidden');
        showRegister();
    } else {
        alert('Você precisa ter 18 anos ou mais para acessar este site.');
        window.location.href = 'https://www.google.com';
    }
}

// ========== NAVEGAÇÃO ==========
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hidden');
    });
    document.getElementById(screenId).classList.remove('hidden');
}

function showRegister() {
    showScreen('register-screen');
}

function showLogin() {
    alert('Função de login em desenvolvimento.');
}

// ========== CADASTRO ==========
function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const cpf = document.getElementById('reg-cpf').value;
    const phone = document.getElementById('reg-phone').value;
    
    // Validações básicas
    if (name.length < 3) {
        alert('Por favor, digite seu nome completo.');
        return;
    }
    
    if (!validateEmail(email)) {
        alert('Por favor, digite um email válido.');
        return;
    }
    
    if (cpf.length < 14) {
        alert('Por favor, digite um CPF válido.');
        return;
    }
    
    // Salva usuário
    currentUser = {
        name: name,
        email: email,
        cpf: cpf,
        phone: phone
    };
    
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Vai para a roleta
    showScreen('roulette-screen');
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ========== MÁSCARAS DE INPUT ==========
function setupInputMasks() {
    const cpfInput = document.getElementById('reg-cpf');
    const phoneInput = document.getElementById('reg-phone');
    
    cpfInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length <= 11) {
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            e.target.value = value;
        }
    });
    
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length <= 11) {
            value = value.replace(/(\d{2})(\d)/, '($1) $2');
            value = value.replace(/(\d{5})(\d)/, '$1-$2');
            e.target.value = value;
        }
    });
}

// ========== ROLETA ==========
function initRoulette() {
    const canvas = document.getElementById('roulette-wheel');
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 180;
    
    drawWheel(ctx, centerX, centerY, radius, 0);
}

function drawWheel(ctx, centerX, centerY, radius, rotation) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    const sliceAngle = (2 * Math.PI) / wheelSlices.length;
    
    // Desenha as fatias
    wheelSlices.forEach((slice, index) => {
        const startAngle = index * sliceAngle + rotation;
        const endAngle = (index + 1) * sliceAngle + rotation;
        
        // Fatia
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = slice.color;
        ctx.fill();
        
        // Borda
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Texto
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + sliceAngle / 2);
        ctx.textAlign = 'center';
        ctx.fillStyle = slice.textColor;
        ctx.font = 'bold 14px Poppins';
        ctx.fillText(slice.label, radius * 0.65, 5);
        
        // Ícone
        ctx.font = '24px Arial';
        ctx.fillText(slice.icon, radius * 0.65, -15);
        ctx.restore();
    });
    
    // Centro da roleta
    ctx.beginPath();
    ctx.arc(centerX, centerY, 50, 0, 2 * Math.PI);
    ctx.fillStyle = '#1a1a1a';
    ctx.fill();
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 5;
    ctx.stroke();
    
    // Luzes ao redor
    const lightCount = 24;
    for (let i = 0; i < lightCount; i++) {
        const angle = (i / lightCount) * 2 * Math.PI + rotation;
        const lightX = centerX + Math.cos(angle) * (radius + 15);
        const lightY = centerY + Math.sin(angle) * (radius + 15);
        
        ctx.beginPath();
        ctx.arc(lightX, lightY, 5, 0, 2 * Math.PI);
        ctx.fillStyle = i % 2 === 0 ? '#FFD700' : '#fff';
        ctx.fill();
    }
}

function spinWheel() {
    if (isSpinning) return;
    
    isSpinning = true;
    const spinBtn = document.getElementById('spin-btn');
    spinBtn.disabled = true;
    
    const canvas = document.getElementById('roulette-wheel');
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 180;
    
    // Ângulo da fatia vencedora
    const sliceAngle = (2 * Math.PI) / wheelSlices.length;
    const winningAngle = winningIndex * sliceAngle;
    
    // Calcula a rotação final (várias voltas + ângulo para parar no vencedor)
    const spins = 5 + Math.random() * 3;
    const finalRotation = spins * 2 * Math.PI - winningAngle - sliceAngle / 2 + Math.PI / 2;
    
    let currentRotation = wheelRotation;
    const startTime = Date.now();
    const duration = 6000; // 6 segundos
    
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing para desaceleração suave
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        currentRotation = wheelRotation + (finalRotation - wheelRotation) * easeOut;
        
        drawWheel(ctx, centerX, centerY, radius, currentRotation);
        
        // Piscar as luzes
        const lightOffset = Math.floor(elapsed / 100) % 2;
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            wheelRotation = currentRotation % (2 * Math.PI);
            isSpinning = false;
            setTimeout(showWinPopup, 500);
        }
    }
    
    animate();
}

function showWinPopup() {
    const popup = document.getElementById('win-popup');
    popup.classList.remove('hidden');
    createConfetti();
}

function createConfetti() {
    const confettiContainer = document.querySelector('.win-confetti');
    const colors = ['#FFD700', '#FF6B00', '#FF1493', '#00CED1', '#9370DB'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.cssText = `
            position: absolute;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}%;
            top: -10px;
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            animation: confetti-fall ${2 + Math.random() * 2}s linear forwards;
            animation-delay: ${Math.random() * 2}s;
        `;
        confettiContainer.appendChild(confetti);
    }
    
    // Adiciona CSS da animação
    const style = document.createElement('style');
    style.textContent = `
        @keyframes confetti-fall {
            to {
                transform: translateY(500px) rotate(${Math.random() * 360}deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

function goToCasino() {
    document.getElementById('win-popup').classList.add('hidden');
    showScreen('casino-screen');
    updateBalance();
}

// ========== JOGOS ==========
function generateGames() {
    const grid = document.getElementById('games-grid');
    
    games.forEach(game => {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.onclick = () => playGame(game.name);
        
        // Usa imagem se disponível, senão usa ícone
        const imageContent = game.image 
            ? `<img src="${game.image}" alt="${game.name}" loading="lazy">`
            : `<span class="game-icon">${game.icon}</span>`;
        
        const bgStyle = game.color 
            ? `style="background: linear-gradient(135deg, ${game.color}22 0%, ${game.color}44 100%);"` 
            : '';
        
        card.innerHTML = `
            <div class="game-image" ${bgStyle}>
                ${imageContent}
            </div>
            <div class="game-info">
                <p class="game-title">${game.name}</p>
                <p class="game-provider">${game.provider}</p>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

function playGame(gameName) {
    if (!hasDeposited) {
        showDeposit();
    } else {
        alert(`Iniciando ${gameName}...`);
    }
}

function showSection(section) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    event.target.classList.add('active');
}

// ========== DEPÓSITO ==========
function showDeposit() {
    document.getElementById('deposit-modal').classList.remove('hidden');
}

function closeDeposit() {
    document.getElementById('deposit-modal').classList.add('hidden');
    document.querySelectorAll('.deposit-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    selectedDepositAmount = 0;
}

function selectDeposit(amount) {
    selectedDepositAmount = amount;
    document.getElementById('custom-deposit').value = '';
    
    document.querySelectorAll('.deposit-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    event.target.closest('.deposit-option').classList.add('selected');
}

function confirmDeposit() {
    const customAmount = document.getElementById('custom-deposit').value;
    const amount = customAmount ? parseFloat(customAmount) : selectedDepositAmount;
    
    if (!amount || amount < 20) {
        alert('Por favor, selecione ou digite um valor válido (mínimo R$ 20,00).');
        return;
    }
    
    selectedDepositAmount = amount;
    closeDeposit();
    
    // Mostra modal de pagamento
    document.getElementById('payment-amount').textContent = `R$ ${amount.toFixed(2).replace('.', ',')}`;
    document.getElementById('payment-modal').classList.remove('hidden');
    
    // Simula processamento do gateway
    setTimeout(() => {
        document.getElementById('payment-modal').classList.add('hidden');
        showSuccess(amount);
    }, 3000);
}

function showSuccess(amount) {
    hasDeposited = true;
    userBalance += amount;
    updateBalance();
    
    document.getElementById('success-amount').textContent = `R$ ${amount.toFixed(2).replace('.', ',')}`;
    document.getElementById('success-modal').classList.remove('hidden');
    
    // Remove o blur
    document.getElementById('deposit-blur').classList.add('hidden');
}

function closeSuccess() {
    document.getElementById('success-modal').classList.add('hidden');
}

function updateBalance() {
    document.getElementById('balance').textContent = `R$ ${userBalance.toFixed(2).replace('.', ',')}`;
}

// ========== UTILITÁRIOS ==========
// Formatação de moeda
function formatCurrency(value) {
    return 'R$ ' + value.toFixed(2).replace('.', ',');
}

// Verifica se usuário já está logado
function checkLoggedUser() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showScreen('casino-screen');
        updateBalance();
    }
}

// Chama verificação ao carregar
checkLoggedUser();
