# BRX Cassino

Site de cassino online desenvolvido em React + TypeScript + Tailwind CSS.

## 🌐 Site ao Vivo

https://6ib3ked6y2b2q.ok.kimi.link

## 📋 Funcionalidades

### ✅ Implementadas

1. **Verificação de Idade (18+)**
   - Modal obrigatório ao acessar o site
   - Redirecionamento se o usuário for menor de idade

2. **Cadastro de Usuários**
   - Nome de usuário
   - E-mail
   - Senha
   - Armazenamento no localStorage
   - Após cadastro, redireciona para a Roda da Fortuna

3. **Roda da Fortuna**
   - 8 fatias editáveis com imagens personalizadas
   - Sempre cai no prêmio de R$ 10.000,00
   - Animação de giro com luzes piscantes
   - Efeitos visuais de partículas douradas
   - Design igual ao das imagens de referência

4. **Página do Cassino**
   - 12 jogos com imagens geradas
   - Categorias: Todos, Populares, Slots, Ao Vivo, Crash
   - Busca de jogos
   - Interface responsiva (mobile e desktop)

5. **Sistema de Saldo**
   - Saldo inicial: R$ 10.000,00 (após girar a roleta)
   - Exibição do saldo no header (visível em mobile)
   - Atualização em tempo real

6. **Depósito**
   - Valores: R$ 20, 50, 75, 100, 200, 400
   - Redirecionamento para Gateway PIX configurável
   - Botões verdes conforme solicitado
   - Após confirmar, abre gateway em nova aba

7. **Saque**
   - Campos: Nome completo, CPF, Chave PIX
   - Validação: Só permite sacar após primeiro depósito
   - Se saldo > R$ 10.000, exige depósito mínimo de R$ 100
   - **Saldo é reduzido** ao solicitar saque
   - Saque fica pendente até cair na conta

8. **Bloqueio de Jogos**
   - Jogos bloqueados até o primeiro depósito
   - **Jogos bloqueados após saque** (até cair na conta)
   - Pop-up explicativo ao tentar jogar

## 🎮 Fluxo do Usuário

1. Acessa o site → Verificação de idade (18+)
2. Cadastra-se → Vai para a Roda da Fortuna
3. Gira a roleta → Ganha R$ 10.000,00
4. Vai para o cassino → Jogos bloqueados (precisa depositar)
5. Faz depósito → Redirecionado para Gateway PIX
6. Após pagamento → Saldo atualizado
7. Pode jogar normalmente
8. Ao sacar → Saldo reduzido, jogos bloqueados até saque cair

## 🎮 Jogos Incluídos

- Fortune Tiger
- Fortune Rabbit
- Fortune Snake
- Gates of Olympus
- Sweet Bonanza
- Aviator
- Spaceman
- Lightning Roulette
- Dream Catcher
- Dragon Tiger
- Mega Moolah
- Wolf Gold

## 🔧 Configurar Gateway PIX

### Método 1: Via Console do Navegador (Rápido)

Abra o console do navegador (F12) e execute:

```javascript
localStorage.setItem('pix_api_url', 'https://seu-gateway.com/pagamento');
```

### Método 2: Editar no Código (Permanente)

Arquivo: `src/pages/CasinoPage.tsx`

```typescript
const [pixApiUrl, setPixApiUrl] = useState('https://seu-gateway.com/pagamento');
```

### Parâmetros Enviados para o Gateway

Quando o usuário confirma o depósito, ele é redirecionado para:

```
https://seu-gateway.com/pagamento?amount=100&callback=https://seusite.com/casino
```

Parâmetros:
- `amount`: Valor do depósito selecionado
- `callback`: URL de retorno após pagamento

## 🎨 Personalização

### Editar Fatias da Roleta

Arquivo: `src/pages/WheelPage.tsx`

```typescript
const WHEEL_PRIZES = [
  {
    id: 0,
    name: '1 MILHÃO',
    subtitle: 'EM SALDO REAL',
    value: 1000000,
    image: '/wheel/milhao.jpg',  // <-- Editar imagem
    bgColor: '#1a5f1a',           // <-- Editar cor de fundo
  },
  // ... outras fatias
];
```

### Editar Imagens da Roleta

Coloque suas imagens na pasta `public/wheel/`:
- `10mil.jpg` - Prêmio de 10 mil reais (PRÊMIO FIXO)
- `milhao.jpg` - 1 milhão
- `porsche.jpg` - Porsche
- `bmw.jpg` - BMW R1250GS
- `iphone.jpg` - iPhone
- `ps5.jpg` - PlayStation 5
- `100mil.jpg` - 100 mil reais
- `tiger.jpg` - Fortune Tiger
- `rabbit.jpg` - Fortune Rabbit

### Editar Jogos

Arquivo: `src/pages/CasinoPage.tsx`

```typescript
const GAMES: Game[] = [
  {
    id: '1',
    name: 'Nome do Jogo',
    provider: 'Provedor',
    image: '/games/imagem.jpg',  // <-- Editar imagem
    category: 'slots',            // <-- slots | live | crash | table
    popular: true,                // <-- Destacar como popular
  },
  // ... outros jogos
];
```

## 🚀 Deploy no GitHub Pages

### 1. Criar Repositório no GitHub

1. Acesse https://github.com
2. Clique em "New Repository"
3. Nome: `brx-cassino`
4. Deixe público
5. Não inicialize com README

### 2. Instalar Dependências e Build

```bash
cd /mnt/okcomputer/output/app
npm install
npm run build
```

### 3. Configurar GitHub Pages

Edite `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/brx-cassino/',  // <-- Nome do seu repositório
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### 4. Deploy

```bash
# Instalar gh-pages
npm install --save-dev gh-pages

# Adicionar ao package.json:
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}

# Fazer deploy
npm run deploy
```

### 5. Configurar no GitHub

1. Vá em Settings > Pages
2. Source: Deploy from a branch
3. Branch: gh-pages / root
4. Salve

## 📝 Editar com Sublime Text

1. Abra a pasta do projeto no Sublime:
   ```
   File > Open Folder > /mnt/okcomputer/output/app
   ```

2. Principais arquivos para editar:
   - `src/pages/WheelPage.tsx` - Roleta
   - `src/pages/CasinoPage.tsx` - Página do cassino
   - `src/context/AuthContext.tsx` - Lógica de autenticação e saldo
   - `src/components/modals/DepositModal.tsx` - Modal de depósito
   - `src/components/modals/WithdrawModal.tsx` - Modal de saque
   - `public/wheel/` - Imagens da roleta
   - `public/games/` - Imagens dos jogos

## 🔧 Tecnologias Utilizadas

- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Lucide React
- React Router DOM

## 📱 Responsividade

O site é totalmente responsivo:
- Desktop: Grid de 6 jogos por linha
- Tablet: Grid de 4 jogos por linha
- Mobile: Grid de 2 jogos por linha
- Saldo sempre visível no header

## ⚠️ Aviso Legal

Este é um projeto de demonstração. O jogo pode ser viciante. Jogue com responsabilidade.

## 📞 Suporte

Para dúvidas ou sugestões, entre em contato.
