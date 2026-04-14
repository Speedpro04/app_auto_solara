# Solara Auto - Plataforma SaaS Multi-Tenant de Revenda de Veículos

Produto AxosHub · Versão 1.0 · 2025

## 🚀 Tecnologias

- **Frontend:** React + Vite + TypeScript
- **Backend:** FastAPI (Python)
- **Database:** Supabase (PostgreSQL + RLS)
- **Storage:** Supabase Storage
- **Deploy:** EasyPanel (Hostinger)

## 📦 Estrutura do Projeto

```
app_solara_estetica/
├── src/                      # Frontend React
│   ├── components/          # Componentes reutilizáveis
│   ├── pages/               # Páginas do sistema
│   ├── layouts/             # Layouts (public/admin)
│   ├── hooks/               # Custom hooks
│   ├── lib/                 # Configurações (Supabase, API)
│   ├── types/               # TypeScript types
│   └── routes.tsx           # Rotas da aplicação
├── backend/                  # Backend FastAPI
│   ├── routes/              # Rotas da API
│   ├── database.py          # Cliente Supabase
│   ├── middleware.py        # Middleware tenant
│   ├── config.py            # Configurações
│   └── main.py              # Entry point
├── database/                 # Banco de dados
│   └── schema.sql           # Schema completo
└── package.json

```

## 🛠️ Instalação

### Frontend

```bash
# Instalar dependências
npm install

# Copiar arquivo de ambiente
cp .env.example .env
# Editar .env com suas credenciais

# Rodar em desenvolvimento
npm run dev
```

### Backend

```bash
cd backend

# Criar virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Instalar dependências
pip install -r requirements.txt

# Copiar arquivo de ambiente
cp .env.example .env
# Editar .env com suas credenciais

# Rodar servidor
python main.py
```

### Banco de Dados

1. Criar projeto no [Supabase](https://supabase.com)
2. Ir para SQL Editor
3. Executar o arquivo `database/schema.sql`
4. Copiar URL e chaves de API

## 🔑 Variáveis de Ambiente

### Frontend (.env)

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=http://localhost:8000
```

### Backend (.env)

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
SUPABASE_ANON_KEY=your-anon-key
BASE_DOMAIN=solaraauto.com.br
JWT_SECRET=your-secret-key
ENVIRONMENT=development
```

## 🎨 Tema

- **Fundo:** `#0C0C0E`
- **Cards:** `#1A1A1F`
- **Destaque:** `#E84118` (laranja)
- **Tipografia:** Bebas Neue (títulos) + DM Sans (corpo)

## 📱 Rotas

### Públicas
- `/` - Página principal
- `/stores` - Lista de lojas
- `/:slug` - Página da loja
- `/veiculo/:id` - Detalhe do veículo

### Admin
- `/login` - Login
- `/admin` - Dashboard
- `/admin/veiculos` - Lista de veículos
- `/admin/veiculos/novo` - Novo veículo
- `/admin/veiculos/:id/editar` - Editar veículo
- `/admin/loja` - Perfil da loja

## 🚀 Deploy

### Frontend (Vite)

```bash
npm run build
# Output: dist/
```

### Backend (FastAPI)

```bash
# Produção com uvicorn
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

## 📄 Licença

AxosHub © 2025
