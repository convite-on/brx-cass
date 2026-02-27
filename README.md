# BRX Bet - Cassino Online

Site de cassino online completo com roleta de bônus, cadastro de usuários e sistema de depósitos.

## 📁 Estrutura do Projeto

```
cassino-brx/
├── index.html          # Página principal
├── css/
│   └── style.css       # Estilos do site
├── js/
│   └── main.js         # Lógica e funcionalidades
├── images/             # Imagens dos jogos
│   ├── roulette-bg.jpg
│   ├── game-tiger.jpg
│   ├── game-rabbit.jpg
│   ├── game-ox.jpg
│   ├── game-mouse.jpg
│   ├── game-dragon.jpg
│   ├── game-olympus.jpg
│   ├── game-sweet.jpg
│   └── game-princess.jpg
└── README.md
```

## 🚀 Funcionalidades

### 1. Verificação de Idade
- Tela inicial solicitando confirmação de idade (+18)
- Armazenamento no localStorage para não repetir

### 2. Cadastro de Usuários
- Formulário com: Nome, Email, CPF, Telefone, Senha
- Máscaras automáticas para CPF e Telefone
- Validação de campos

### 3. Roleta de Bônus
- Roleta com 8 fatias coloridas (estilo pizza)
- Gira e para no prêmio de R$ 10.000
- Animação suave com desaceleração
- Efeito de confetes ao ganhar

### 4. Cassino Principal
- Header com saldo e botão de depósito
- Grid de jogos populares
- Navegação por categorias

### 5. Sistema de Depósito
- Valores pré-definidos: R$ 20, 50, 75, 100, 200, 400
- Campo para valor personalizado
- Simulação de gateway de pagamento
- Liberação do saldo após confirmação

### 6. Bloqueio de Jogos
- Saldo de R$ 10.000 bloqueado inicialmente
- Overlay blur impedindo cliques nos jogos
- Liberação apenas após primeiro depósito

## 🎨 Personalização

### Cores Principais
Edite as variáveis CSS em `css/style.css`:

```css
:root {
    --primary: #FFD700;        /* Dourado */
    --primary-dark: #FFA500;   /* Laranja */
    --secondary: #FF6B00;      /* Laranja escuro */
    --dark: #0a0a0a;           /* Preto */
    --success: #00C851;        /* Verde */
    --danger: #ff4444;         /* Vermelho */
}
```

### Imagens dos Jogos
Substitua as imagens na pasta `images/` mantendo os mesmos nomes de arquivo.

### Prêmios da Roleta
Edite o array em `js/main.js`:

```javascript
const wheelSlices = [
    { label: 'R$ 10 MIL', color: '#FFD700', textColor: '#000', icon: '💰' },
    { label: '100 GIROS', color: '#FF6B00', textColor: '#fff', icon: '🎰' },
    // ... adicione mais fatias
];
```

### Valores de Depósito
Edite em `js/main.js` na função `selectDeposit()`:

```javascript
// Valores disponíveis: 20, 50, 75, 100, 200, 400
```

## 🔧 Configuração do Gateway de Pagamento

Para integrar com um gateway real, edite a função `confirmDeposit()` em `js/main.js`:

```javascript
function confirmDeposit() {
    // ... código atual ...
    
    // Substitua esta parte pelo seu gateway:
    // window.location.href = 'SEU_LINK_GATEWAY' + amount;
    
    // Ou use fetch para API:
    // fetch('SUA_API/pagamento', {
    //     method: 'POST',
    //     body: JSON.stringify({ valor: amount })
    // });
}
```

## 📱 Responsivo

O site é totalmente responsivo e funciona em:
- Desktop
- Tablet
- Mobile

## 🌐 Hospedagem no GitHub Pages

1. Crie um repositório no GitHub
2. Faça upload de todos os arquivos
3. Vá em Settings > Pages
4. Selecione a branch main
5. Seu site estará em: `https://seuusuario.github.io/nome-do-repo`

## 📝 Edição no Sublime Text

1. Abra a pasta do projeto no Sublime Text
2. Use `Ctrl+P` para navegar entre arquivos
3. Edite os arquivos conforme necessário
4. Salve e atualize o navegador (F5)

### Atalhos úteis:
- `Ctrl+Shift+P` - Command Palette
- `Ctrl+D` - Selecionar próxima ocorrência
- `Ctrl+Shift+L` - Selecionar todas as ocorrências
- `Ctrl+/` - Comentar/descomentar linha

## 🔒 Segurança

⚠️ **IMPORTANTE**: Este é um projeto de demonstração. Para uso em produção:

1. Adicione HTTPS
2. Implemente autenticação segura
3. Valide todos os inputs no backend
4. Use variáveis de ambiente para dados sensíveis
5. Implemente rate limiting
6. Adicione proteção contra CSRF/XSS

## 📞 Suporte

Para dúvidas ou sugestões, entre em contato.

---

**Aviso**: Este site é destinado apenas para maiores de 18 anos. Jogue com responsabilidade.
