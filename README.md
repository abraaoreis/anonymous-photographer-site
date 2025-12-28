# silent shuter



Galeria de fotos anônima construída com Next.js, focada em alta resolução e privacidade.

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- Node.js (v18+)
- Docker e Docker Compose (para banco local e storage MinIO)
- Conta no Supabase ou AWS S3 (para produção)

### Passos
1. **Configurar Variáveis de Ambiente**:
   Crie um arquivo `.env.local` baseado no `.env.example`:
   ```bash
   cp .env.example .env.local
   ```
   *Nota: O projeto já vem configurado para usar MinIO localmente.*

2. **Iniciar Infraestrutura Local (PostgreSQL & MinIO)**:
   ```bash
   npm run docker:up
   ```
   *Isso iniciará o banco de dados e o storage local, criando automaticamente o bucket necessário.*

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
- **Armazenamento**: AWS S3 / MinIO (Local) ou Vercel Blob
- **Infraestrutura**: Docker & Docker Compose

