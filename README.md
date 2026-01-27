# 📅 Agendify - Sistema de Agendamentos

> Portal de agendamentos em formato PWA desenvolvido para o desafio técnico Goold Candidatos

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Funcionalidades](#funcionalidades)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [API](#api)
- [Testes](#testes)
- [Deploy](#deploy)
- [Contribuindo](#contribuindo)

## 🎯 Sobre o Projeto

O **Agendify** é um sistema completo de gerenciamento de agendamentos, desenvolvido com Next.js 14 (App Router) no frontend e Node.js/Express/TypeScript no backend. O projeto foi criado seguindo as melhores práticas de desenvolvimento, com arquitetura em camadas, tipagem forte e código limpo.

### Objetivos

- Criar um portal de agendamentos intuitivo e responsivo
- Implementar sistema de autenticação seguro com JWT
- Gerenciar agendamentos com diferentes status (análise, agendado, cancelado)
- Registrar logs de atividades dos usuários
- Permitir gerenciamento de perfil e dados pessoais

## 🚀 Tecnologias

### Frontend

- **[Next.js 14](https://nextjs.org/)** - Framework React com App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Superset JavaScript com tipagem estática
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utility-first
- **[shadcn/ui](https://ui.shadcn.com/)** - Componentes UI com Radix UI
- **[Axios](https://axios-http.com/)** - Cliente HTTP
- **[date-fns](https://date-fns.org/)** - Biblioteca de manipulação de datas
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications elegantes
- **[Lucide React](https://lucide.dev/)** - Ícones

### Backend

- **[Node.js](https://nodejs.org/)** - Runtime JavaScript
- **[Express](https://expressjs.com/)** - Framework web minimalista
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática
- **[Sequelize](https://sequelize.org/)** - ORM para MySQL
- **[MySQL](https://www.mysql.com/)** - Banco de dados relacional
- **[JWT](https://jwt.io/)** - Autenticação via tokens
- **[Bcrypt](https://www.npmjs.com/package/bcryptjs)** - Hash de senhas
- **[Joi](https://joi.dev/)** - Validação de schemas

## 🏗️ Arquitetura

### Frontend - Arquitetura em Camadas

```
┌─────────────────────────────────────────┐
│         Pages (Next.js App Router)      │
│   - Login, Cadastro, Agendamentos,      │
│     Logs, Minha Conta                   │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│          Hooks (Custom Hooks)           │
│   - useAppointments, useLogs, useUser   │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Services (API Calls)            │
│   - appointmentService, authService     │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│            Backend API                  │
└─────────────────────────────────────────┘
```

### Backend - Arquitetura em Camadas

```
┌─────────────────────────────────────────┐
│     Controllers (HTTP Handlers)         │
│   - AppointmentController, AuthController│
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│    Services (Business Logic)            │
│   - AppointmentService, AuthService     │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│  Repositories (Data Access Layer)       │
│   - AppointmentRepository, UserRepository│
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│       Models (Database Schema)          │
│   - Appointment, User, Log              │
└─────────────────────────────────────────┘
```

## ✨ Funcionalidades

### Autenticação
- ✅ Login com email e senha
- ✅ Cadastro de novos usuários
- ✅ Busca automática de endereço por CEP
- ✅ Autenticação JWT com refresh token
- ✅ Proteção de rotas privadas
- ✅ Logout

### Agendamentos
- ✅ Listar agendamentos com paginação
- ✅ Criar novo agendamento
  - Seleção de data (apenas dias úteis)
  - Seleção de horário (08:00 às 17:59)
  - Seleção de sala
- ✅ Cancelar agendamento (com regra de 24h)
- ✅ Confirmar agendamento (admin)
- ✅ Filtros por status, data e busca
- ✅ Status coloridos (análise, agendado, cancelado)
- ✅ Validações de conflito de horário

### Logs
- ✅ Registro automático de todas as ações
- ✅ Listagem com paginação
- ✅ Filtros por tipo, módulo e data
- ✅ Visualização de histórico de atividades

### Perfil do Usuário
- ✅ Visualizar dados pessoais
- ✅ Editar informações do perfil
- ✅ Busca automática de endereço por CEP
- ✅ Alterar senha

### Admin
- ✅ Acesso à página de clientes
- ✅ Visualizar todos os logs
- ✅ Confirmar agendamentos
- ✅ Deletar agendamentos

## 📦 Instalação

### Pré-requisitos

- Node.js 18 ou superior
- MySQL 8 ou superior
- npm ou yarn

### Backend

```bash
# Clonar o repositório
git clone <url-do-repositorio>

# Entrar na pasta do backend
cd AGENDIFY-API

# Instalar dependências
npm install

# Copiar arquivo de ambiente
cp .env.example .env

# Editar .env com suas configurações
nano .env

# Criar banco de dados
mysql -u root -p
CREATE DATABASE agendify;
exit;

# Executar migrations
npm run migrate

# (Opcional) Popular banco com dados de teste
npm run seed

# Iniciar servidor
npm run dev
```

### Frontend

```bash
# Entrar na pasta do frontend
cd AGENDIFY-FRONT

# Instalar dependências
npm install

# Copiar arquivo de ambiente
cp .env.example .env.local

# Editar .env.local
nano .env.local

# Iniciar aplicação
npm run dev
```

## ⚙️ Configuração

### Backend (.env)

```env
# Application
NODE_ENV=development
PORT=3333

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=agendify
DB_USER=root
DB_PASS=sua_senha

# JWT
JWT_SECRET=sua_chave_secreta_super_forte_aqui
JWT_EXPIRES_IN=7d

# Frontend
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3333
```

## 🎮 Uso

### Acessar a Aplicação

1. **Backend**: http://localhost:3333
2. **Frontend**: http://localhost:3000

### Credenciais de Teste (após executar seed)

**Admin:**
- Email: `mateus@goldspell.com.br`
- Senha: `123456`

**Cliente:**
- Email: `cliente@teste.com`
- Senha: `123456`

### Fluxo de Uso

1. **Cadastro**
   - Acesse `/cadastro`
   - Preencha o formulário
   - Insira o CEP e veja o endereço preencher automaticamente
   - Clique em "Cadastrar-se"

2. **Login**
   - Acesse `/login`
   - Insira email e senha
   - Clique em "Acessar conta"

3. **Criar Agendamento**
   - Na página de agendamentos, clique em "Novo Agendamento"
   - Selecione data (apenas dias úteis)
   - Selecione horário (08:00 às 17:59)
   - Selecione sala
   - Clique em "Confirmar Agendamento"

4. **Ver Logs** (Admin)
   - Acesse a página "Logs" no menu
   - Veja o histórico de todas as ações

5. **Editar Perfil**
   - Clique em "Minha Conta" no menu
   - Edite suas informações
   - Clique em "Salvar"

## 📂 Estrutura do Projeto

### Frontend

```
AGENDIFY-FRONT/
├── src/
│   ├── app/                    # Páginas (App Router)
│   │   ├── (auth)/            # Grupo de rotas públicas
│   │   │   ├── login/
│   │   │   └── cadastro/
│   │   └── (dashboard)/       # Grupo de rotas privadas
│   │       ├── agendamentos/
│   │       ├── logs/
│   │       └── minha-conta/
│   ├── components/            # Componentes reutilizáveis
│   │   ├── ui/               # Componentes shadcn/ui
│   │   ├── Sidebar.tsx
│   │   ├── StatusBadge.tsx
│   │   └── ...
│   ├── contexts/             # Contextos React
│   │   └── AuthContext.tsx
│   ├── hooks/                # Custom hooks
│   │   ├── useAppointments.ts
│   │   ├── useLogs.ts
│   │   └── useUser.ts
│   ├── services/             # Comunicação com API
│   │   ├── api.ts
│   │   ├── appointmentService.ts
│   │   └── ...
│   ├── types/                # Tipos TypeScript
│   ├── utils/                # Funções utilitárias
│   └── lib/                  # Bibliotecas
├── public/                   # Arquivos estáticos
└── package.json
```

### Backend

```
AGENDIFY-API/
├── src/
│   ├── config/               # Configurações
│   ├── controllers/          # Controladores HTTP
│   ├── services/             # Lógica de negócio
│   ├── repositories/         # Acesso ao banco
│   ├── models/               # Models Sequelize
│   ├── middlewares/          # Middlewares
│   ├── validators/           # Validações Joi
│   ├── routes/               # Definição de rotas
│   ├── utils/                # Utilitários
│   ├── interfaces/           # Interfaces TypeScript
│   ├── constants/            # Constantes
│   ├── database/
│   │   ├── migrations/       # Migrations
│   │   └── seeders/          # Seeders
│   ├── app.ts               # Configuração Express
│   └── server.ts            # Inicialização
└── package.json
```

## 🔌 API

### Endpoints Principais

#### Autenticação
```
POST   /api/auth/register    # Registrar usuário
POST   /api/auth/login       # Login
POST   /api/auth/refresh     # Refresh token
GET    /api/auth/me          # Dados do usuário logado
POST   /api/auth/logout      # Logout
```

#### Agendamentos
```
GET    /api/appointments                 # Listar agendamentos
POST   /api/appointments                 # Criar agendamento
GET    /api/appointments/:id             # Buscar por ID
PUT    /api/appointments/:id             # Atualizar
DELETE /api/appointments/:id/cancel      # Cancelar
PATCH  /api/appointments/:id/confirm     # Confirmar (admin)
GET    /api/appointments/my-appointments # Meus agendamentos
GET    /api/appointments/rooms           # Listar salas
```

#### Logs
```
GET    /api/logs           # Listar logs
GET    /api/logs/:id       # Buscar por ID
GET    /api/logs/stats     # Estatísticas
```

### Exemplo de Requisição

```bash
# Login
curl -X POST http://localhost:3333/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "mateus@goldspell.com.br",
    "password": "123456"
  }'

# Criar agendamento (requer autenticação)
curl -X POST http://localhost:3333/api/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "date": "2025-02-15",
    "time": "14:30",
    "room": "Sala 012"
  }'
```

## 🧪 Testes

```bash
# Backend
cd AGENDIFY-API
npm test

# Frontend
cd AGENDIFY-FRONT
npm test
```

## 🚢 Deploy

### Backend (Heroku/Railway)

```bash
# Configurar variáveis de ambiente
heroku config:set NODE_ENV=production
heroku config:set DB_HOST=seu-host
# ... outras variáveis

# Deploy
git push heroku main
```

### Frontend (Vercel)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Autor

Desenvolvido para o **Desafio Técnico Goold Candidatos**

---

**Stack Tecnológica:**
- Frontend: Next.js 14 + TypeScript + Tailwind CSS
- Backend: Node.js + Express + TypeScript + Sequelize
- Database: MySQL

**Padrões Utilizados:**
- Clean Architecture
- SOLID Principles
- Repository Pattern
- Service Layer Pattern
- Custom Hooks Pattern

**Boas Práticas:**
- ✅ Código 100% tipado com TypeScript
- ✅ Validações client-side e server-side
- ✅ Tratamento de erros centralizado
- ✅ Logs de auditoria
- ✅ Autenticação segura com JWT
- ✅ Senhas hasheadas com bcrypt
- ✅ Responsividade mobile-first
- ✅ Componentização reutilizável
- ✅ Código limpo e documentado

🚀 **Pronto para produção!**# 📅 Agendify - Sistema de Agendamentos

> Portal de agendamentos em formato PWA desenvolvido para o desafio técnico Goold Candidatos

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Funcionalidades](#funcionalidades)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [API](#api)
- [Testes](#testes)
- [Deploy](#deploy)
- [Contribuindo](#contribuindo)

## 🎯 Sobre o Projeto

O **Agendify** é um sistema completo de gerenciamento de agendamentos, desenvolvido com Next.js 14 (App Router) no frontend e Node.js/Express/TypeScript no backend. O projeto foi criado seguindo as melhores práticas de desenvolvimento, com arquitetura em camadas, tipagem forte e código limpo.

### Objetivos

- Criar um portal de agendamentos intuitivo e responsivo
- Implementar sistema de autenticação seguro com JWT
- Gerenciar agendamentos com diferentes status (análise, agendado, cancelado)
- Registrar logs de atividades dos usuários
- Permitir gerenciamento de perfil e dados pessoais

## 🚀 Tecnologias

### Frontend

- **[Next.js 14](https://nextjs.org/)** - Framework React com App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Superset JavaScript com tipagem estática
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utility-first
- **[shadcn/ui](https://ui.shadcn.com/)** - Componentes UI com Radix UI
- **[Axios](https://axios-http.com/)** - Cliente HTTP
- **[date-fns](https://date-fns.org/)** - Biblioteca de manipulação de datas
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications elegantes
- **[Lucide React](https://lucide.dev/)** - Ícones

### Backend

- **[Node.js](https://nodejs.org/)** - Runtime JavaScript
- **[Express](https://expressjs.com/)** - Framework web minimalista
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática
- **[Sequelize](https://sequelize.org/)** - ORM para MySQL
- **[MySQL](https://www.mysql.com/)** - Banco de dados relacional
- **[JWT](https://jwt.io/)** - Autenticação via tokens
- **[Bcrypt](https://www.npmjs.com/package/bcryptjs)** - Hash de senhas
- **[Joi](https://joi.dev/)** - Validação de schemas

## 🏗️ Arquitetura

### Frontend - Arquitetura em Camadas

```
┌─────────────────────────────────────────┐
│         Pages (Next.js App Router)      │
│   - Login, Cadastro, Agendamentos,      │
│     Logs, Minha Conta                   │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│          Hooks (Custom Hooks)           │
│   - useAppointments, useLogs, useUser   │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Services (API Calls)            │
│   - appointmentService, authService     │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│            Backend API                  │
└─────────────────────────────────────────┘
```

### Backend - Arquitetura em Camadas

```
┌─────────────────────────────────────────┐
│     Controllers (HTTP Handlers)         │
│   - AppointmentController, AuthController│
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│    Services (Business Logic)            │
│   - AppointmentService, AuthService     │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│  Repositories (Data Access Layer)       │
│   - AppointmentRepository, UserRepository│
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│       Models (Database Schema)          │
│   - Appointment, User, Log              │
└─────────────────────────────────────────┘
```

## ✨ Funcionalidades

### Autenticação
- ✅ Login com email e senha
- ✅ Cadastro de novos usuários
- ✅ Busca automática de endereço por CEP
- ✅ Autenticação JWT com refresh token
- ✅ Proteção de rotas privadas
- ✅ Logout

### Agendamentos
- ✅ Listar agendamentos com paginação
- ✅ Criar novo agendamento
  - Seleção de data (apenas dias úteis)
  - Seleção de horário (08:00 às 17:59)
  - Seleção de sala
- ✅ Cancelar agendamento (com regra de 24h)
- ✅ Confirmar agendamento (admin)
- ✅ Filtros por status, data e busca
- ✅ Status coloridos (análise, agendado, cancelado)
- ✅ Validações de conflito de horário

### Logs
- ✅ Registro automático de todas as ações
- ✅ Listagem com paginação
- ✅ Filtros por tipo, módulo e data
- ✅ Visualização de histórico de atividades

### Perfil do Usuário
- ✅ Visualizar dados pessoais
- ✅ Editar informações do perfil
- ✅ Busca automática de endereço por CEP
- ✅ Alterar senha

### Admin
- ✅ Acesso à página de clientes
- ✅ Visualizar todos os logs
- ✅ Confirmar agendamentos
- ✅ Deletar agendamentos

## 📦 Instalação

### Pré-requisitos

- Node.js 18 ou superior
- MySQL 8 ou superior
- npm ou yarn

### Backend

```bash
# Clonar o repositório
git clone <url-do-repositorio>

# Entrar na pasta do backend
cd AGENDIFY-API

# Instalar dependências
npm install

# Copiar arquivo de ambiente
cp .env.example .env

# Editar .env com suas configurações
nano .env

# Criar banco de dados
mysql -u root -p
CREATE DATABASE agendify;
exit;

# Executar migrations
npm run migrate

# (Opcional) Popular banco com dados de teste
npm run seed

# Iniciar servidor
npm run dev
```

### Frontend

```bash
# Entrar na pasta do frontend
cd AGENDIFY-FRONT

# Instalar dependências
npm install

# Copiar arquivo de ambiente
cp .env.example .env.local

# Editar .env.local
nano .env.local

# Iniciar aplicação
npm run dev
```

## ⚙️ Configuração

### Backend (.env)

```env
# Application
NODE_ENV=development
PORT=3333

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=agendify
DB_USER=root
DB_PASS=sua_senha

# JWT
JWT_SECRET=sua_chave_secreta_super_forte_aqui
JWT_EXPIRES_IN=7d

# Frontend
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3333
```

## 🎮 Uso

### Acessar a Aplicação

1. **Backend**: http://localhost:3333
2. **Frontend**: http://localhost:3000

### Credenciais de Teste (após executar seed)

**Admin:**
- Email: `mateus@goldspell.com.br`
- Senha: `123456`

**Cliente:**
- Email: `cliente@teste.com`
- Senha: `123456`

### Fluxo de Uso

1. **Cadastro**
   - Acesse `/cadastro`
   - Preencha o formulário
   - Insira o CEP e veja o endereço preencher automaticamente
   - Clique em "Cadastrar-se"

2. **Login**
   - Acesse `/login`
   - Insira email e senha
   - Clique em "Acessar conta"

3. **Criar Agendamento**
   - Na página de agendamentos, clique em "Novo Agendamento"
   - Selecione data (apenas dias úteis)
   - Selecione horário (08:00 às 17:59)
   - Selecione sala
   - Clique em "Confirmar Agendamento"

4. **Ver Logs** (Admin)
   - Acesse a página "Logs" no menu
   - Veja o histórico de todas as ações

5. **Editar Perfil**
   - Clique em "Minha Conta" no menu
   - Edite suas informações
   - Clique em "Salvar"

## 📂 Estrutura do Projeto

### Frontend

```
AGENDIFY-FRONT/
├── src/
│   ├── app/                    # Páginas (App Router)
│   │   ├── (auth)/            # Grupo de rotas públicas
│   │   │   ├── login/
│   │   │   └── cadastro/
│   │   └── (dashboard)/       # Grupo de rotas privadas
│   │       ├── agendamentos/
│   │       ├── logs/
│   │       └── minha-conta/
│   ├── components/            # Componentes reutilizáveis
│   │   ├── ui/               # Componentes shadcn/ui
│   │   ├── Sidebar.tsx
│   │   ├── StatusBadge.tsx
│   │   └── ...
│   ├── contexts/             # Contextos React
│   │   └── AuthContext.tsx
│   ├── hooks/                # Custom hooks
│   │   ├── useAppointments.ts
│   │   ├── useLogs.ts
│   │   └── useUser.ts
│   ├── services/             # Comunicação com API
│   │   ├── api.ts
│   │   ├── appointmentService.ts
│   │   └── ...
│   ├── types/                # Tipos TypeScript
│   ├── utils/                # Funções utilitárias
│   └── lib/                  # Bibliotecas
├── public/                   # Arquivos estáticos
└── package.json
```

### Backend

```
AGENDIFY-API/
├── src/
│   ├── config/               # Configurações
│   ├── controllers/          # Controladores HTTP
│   ├── services/             # Lógica de negócio
│   ├── repositories/         # Acesso ao banco
│   ├── models/               # Models Sequelize
│   ├── middlewares/          # Middlewares
│   ├── validators/           # Validações Joi
│   ├── routes/               # Definição de rotas
│   ├── utils/                # Utilitários
│   ├── interfaces/           # Interfaces TypeScript
│   ├── constants/            # Constantes
│   ├── database/
│   │   ├── migrations/       # Migrations
│   │   └── seeders/          # Seeders
│   ├── app.ts               # Configuração Express
│   └── server.ts            # Inicialização
└── package.json
```

## 🔌 API

### Endpoints Principais

#### Autenticação
```
POST   /api/auth/register    # Registrar usuário
POST   /api/auth/login       # Login
POST   /api/auth/refresh     # Refresh token
GET    /api/auth/me          # Dados do usuário logado
POST   /api/auth/logout      # Logout
```

#### Agendamentos
```
GET    /api/appointments                 # Listar agendamentos
POST   /api/appointments                 # Criar agendamento
GET    /api/appointments/:id             # Buscar por ID
PUT    /api/appointments/:id             # Atualizar
DELETE /api/appointments/:id/cancel      # Cancelar
PATCH  /api/appointments/:id/confirm     # Confirmar (admin)
GET    /api/appointments/my-appointments # Meus agendamentos
GET    /api/appointments/rooms           # Listar salas
```

#### Logs
```
GET    /api/logs           # Listar logs
GET    /api/logs/:id       # Buscar por ID
GET    /api/logs/stats     # Estatísticas
```

### Exemplo de Requisição

```bash
# Login
curl -X POST http://localhost:3333/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "mateus@goldspell.com.br",
    "password": "123456"
  }'

# Criar agendamento (requer autenticação)
curl -X POST http://localhost:3333/api/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "date": "2025-02-15",
    "time": "14:30",
    "room": "Sala 012"
  }'
```

## 🧪 Testes

```bash
# Backend
cd AGENDIFY-API
npm test

# Frontend
cd AGENDIFY-FRONT
npm test
```

## 🚢 Deploy

### Backend (Heroku/Railway)

```bash
# Configurar variáveis de ambiente
heroku config:set NODE_ENV=production
heroku config:set DB_HOST=seu-host
# ... outras variáveis

# Deploy
git push heroku main
```

### Frontend (Vercel)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Autor

Desenvolvido para o **Desafio Técnico Goold Candidatos**

---

**Stack Tecnológica:**
- Frontend: Next.js 14 + TypeScript + Tailwind CSS
- Backend: Node.js + Express + TypeScript + Sequelize
- Database: MySQL

**Padrões Utilizados:**
- Clean Architecture
- SOLID Principles
- Repository Pattern
- Service Layer Pattern
- Custom Hooks Pattern

**Boas Práticas:**
- ✅ Código 100% tipado com TypeScript
- ✅ Validações client-side e server-side
- ✅ Tratamento de erros centralizado
- ✅ Logs de auditoria
- ✅ Autenticação segura com JWT
- ✅ Senhas hasheadas com bcrypt
- ✅ Responsividade mobile-first
- ✅ Componentização reutilizável
- ✅ Código limpo e documentado

🚀 **Pronto para produção!**