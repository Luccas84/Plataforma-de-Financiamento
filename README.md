# 🎯 Plataforma de Financiamento Coletivo (Reward-Based Crowdfunding)

# Meu Projeto

Bem-vindo ao meu projeto!

![Logo do Projeto](https://github.com/Luccas84/Plataforma-de-Financiamento/blob/main/Projeto_19.png)

Uma plataforma fullstack profissional de financiamento coletivo baseada em recompensas, desenvolvida com **Node.js + Express + SQLite (Prisma)** no backend e **HTML/CSS/JavaScript** no frontend.

## 📋 Funcionalidades

- ✅ **Autenticação de Usuários**: Login e cadastro com JWT
- ✅ **CRUD de Projetos**: Criar, editar, visualizar e deletar projetos
- ✅ **Sistema de Recompensas**: Adicionar recompensas aos projetos
- ✅ **Contribuições**: Sistema de contribuição com registro de valores e recompensas
- ✅ **Dashboard do Criador**: Estatísticas e gerenciamento de projetos
- ✅ **Interface Responsiva**: Design moderno para desktop, tablet e mobile
- ✅ **Animações e UX**: Toast notifications, modais, cards animados

## 🚀 Tecnologias

### Backend
- **Node.js** + **Express**
- **Prisma ORM** com **SQLite**
- **JWT** para autenticação
- **bcrypt** para hash de senhas

### Frontend
- **HTML5** + **CSS3** + **JavaScript (ES6 Modules)**
- **Fontes**: Montserrat e Poppins (Google Fonts)
- **Ícones**: Boxicons
- **Design Responsivo** com CSS Grid e Flexbox

## 📁 Estrutura do Projeto

```
crowdfunding-app/
├─ backend/
│  ├─ controllers/        # Lógica de negócio
│  ├─ routes/             # Rotas da API
│  ├─ prisma/             # Schema do banco de dados
│  ├─ server.js           # Servidor Express
│  └─ package.json
├─ frontend/
│  ├─ index.html          # Landing page
│  ├─ login.html          # Página de login
│  ├─ cadastro.html       # Página de cadastro
│  ├─ projetos.html       # Listagem de projetos
│  ├─ projeto-detalhe.html # Detalhes do projeto
│  ├─ dashboard.html      # Dashboard do criador
│  ├─ css/                # Estilos
│  └─ js/                 # JavaScript modular
└─ README.md
```

## 🛠️ Instalação e Execução

### 1. Backend

```bash
# Navegar para a pasta backend
cd backend

# Instalar dependências
npm install

# Gerar cliente Prisma
npx prisma generate

# Criar banco de dados e executar migrações
npx prisma migrate dev --name init

# Iniciar servidor
npm start
```

O servidor estará rodando em `http://localhost:3000`

### 2. Frontend

O frontend pode ser aberto diretamente no navegador ou usando um servidor HTTP local.

**Opção 1: Live Server (VS Code)**
- Instale a extensão "Live Server"
- Clique com botão direito em `frontend/index.html` → "Open with Live Server"

**Opção 2: Servidor HTTP simples**
```bash
# Python 3
cd frontend
python -m http.server 8000

# Node.js (http-server)
npx http-server frontend -p 8000
```

Acesse `http://localhost:8000`

## 📡 API Endpoints

### Autenticação
- `POST /api/auth/cadastro` - Criar conta
- `POST /api/auth/login` - Fazer login

### Projetos
- `GET /api/projetos` - Listar todos os projetos
- `GET /api/projetos/:id` - Buscar projeto por ID
- `POST /api/projetos` - Criar projeto (requer autenticação)
- `PUT /api/projetos/:id` - Editar projeto (requer autenticação)
- `DELETE /api/projetos/:id` - Deletar projeto (requer autenticação)
- `POST /api/projetos/:id/recompensas` - Adicionar recompensa (requer autenticação)

### Contribuições
- `POST /api/contribuicoes` - Criar contribuição (requer autenticação)
- `GET /api/contribuicoes/projeto/:projetoId` - Listar contribuições de um projeto
- `GET /api/contribuicoes/dashboard/:usuarioId` - Dashboard do criador (requer autenticação)

## 🎨 Design e Cores

- **Primária**: #457B9D (Azul vibrante)
- **Secundária**: #E63946 (Vermelho para alertas)
- **Sucesso**: #2A9D8F (Verde)
- **Fundo**: #F1FAEE (Branco suave)
- **Texto**: #1E1E1E (Preto)

## 🔐 Segurança

- Senhas hashadas com bcrypt (10 rounds)
- Tokens JWT com expiração de 7 dias
- Validação de dados no backend
- Verificação de permissões (proprietário do projeto)

## 📝 Notas

- O banco de dados SQLite é criado automaticamente na pasta `backend/prisma/`
- Para produção, considere migrar para MySQL ou PostgreSQL
- As imagens dos projetos devem ser URLs válidas
- O sistema de pagamento é simulado (apenas registro de valores)

## 🚧 Próximos Passos

- [ ] Sistema de upload de imagens
- [ ] Integração com gateway de pagamento real
- [ ] Notificações por email
- [ ] Sistema de comentários
- [ ] Busca e filtros de projetos
- [ ] Paginação de resultados

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais e de portfólio.

---

Desenvolvido com ❤️ para demonstrar habilidades fullstack

