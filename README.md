# Anonymous Photographer Site

Galeria de fotos anônima construída com Next.js, focada em alta resolução e privacidade.

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- Node.js (v18+)
- Docker e Docker Compose (para banco local)
- Conta no Supabase (para produção)

### Passos
1. **Configurar Variáveis de Ambiente**:
   Crie um arquivo `.env.local` baseado no `.env.example`:
   ```bash
   cp .env.example .env.local
   ```
2. **Iniciar Banco de Dados Local**:
   ```bash
   docker-compose up -d
   ```
3. **Instalar Dependências**:
   ```bash
   npm install
   ```
4. **Rodar em Desenvolvimento**:
   ```bash
   npm run dev
   ```

## 📁 Estrutura do Projeto

```
/
├── app/                # Rotas e API (Next.js App Router)
├── components/         # Componentes React (UI, Gallery, Modals)
├── hooks/              # Hooks customizados e lógica de estado (React Query)
├── lib/                # Configurações de terceiros (Supabase, Utils)
├── services/           # Camada de serviço do Frontend
├── server/             # Lógica de Backend (Clean Architecture)
│   ├── models/         # Interfaces e Tipos
│   ├── repositories/   # Acesso a Dados (Repository Pattern)
│   └── services/       # Lógica de Negócio
└── public/             # Ativos estáticos
```

## 🛠 Tecnologias
- **Frontend**: Next.js, Tailwind CSS, DaisyUI 5, Radix UI
- **Backend**: Service Layer + Repository Pattern
- **Banco de Dados**: PostgreSQL (Local/Docker) ou Supabase (Produção)
- **Armazenamento**: Vercel Blob

## ✅ Checklist de Implementação
- [x] Migração de tipos para `server/models`
- [x] Implementação do Repository Pattern
- [x] Integração com DaisyUI 5
- [x] Configuração de Banco de Dados Local (Docker)
- [x] Gerenciamento de Variáveis de Ambiente e Estratégias de DB
- [x] Documentação completa no README
