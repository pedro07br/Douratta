# DOUR·ATTA — E-commerce de Joias

> Plataforma de e-commerce completa para joias artesanais em ouro 18k, desenvolvida com Next.js, Prisma e MySQL.

🔗 **Demo ao vivo:** [douratta.vercel.app](https://douratta.vercel.app)

---

## 📋 Sumário

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração do Banco de Dados](#configuração-do-banco-de-dados)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Rodando o Projeto](#rodando-o-projeto)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Funcionalidades](#funcionalidades)
- [Painel Admin](#painel-admin)
- [Deploy](#deploy)
- [Equipe](#equipe)

---

## Sobre o Projeto

A **Douratta** é uma loja virtual de joias artesanais que combina elegância e tecnologia. O sistema oferece uma experiência completa de compra para o cliente e um painel administrativo robusto para gestão da loja, com suporte a modo escuro, skeleton loading e interface totalmente responsiva.

---

## Tecnologias

| Tecnologia | Versão | Uso |
|---|---|---|
| Next.js | 16.2 | Framework React (Pages Router) |
| Prisma | 7.5 | ORM para banco de dados |
| MySQL | 8.0 | Banco de dados relacional |
| Docker | - | Container do banco de dados (local) |
| Railway | - | Banco de dados em produção |
| Vercel | - | Deploy da aplicação |
| JWT | - | Autenticação |
| bcryptjs | - | Hash de senhas |
| cookies-next | - | Gerenciamento de cookies |
| @prisma/adapter-mariadb | - | Adapter do banco |

---

## Pré-requisitos

- Node.js 18+
- npm ou yarn
- Docker Desktop (para desenvolvimento local)
- Git

---

## Instalação

**1. Clone o repositório:**
```bash
git clone https://github.com/pedro07br/Douratta
cd Douratta
```

**2. Instale as dependências:**
```bash
npm install
```

---

## Configuração do Banco de Dados

**1. Suba o container MySQL com Docker:**
```bash
docker-compose up -d
```

O banco será iniciado na porta **3307**.

**2. Rode as migrations do Prisma:**
```bash
npx prisma migrate dev
npx prisma generate
```

**3. (Opcional) Popule o banco com dados de exemplo:**
```
POST http://localhost:3000/api/seed
```

**4. Para criar o primeiro admin, use o Prisma Studio:**
```bash
npx prisma studio
```
Acesse `localhost:5555`, vá na tabela **User** e altere o campo `role` para `ADMIN`.

---

## Variáveis de Ambiente

Crie os arquivos `.env` e `.env.local` na raiz do projeto:

**`.env`**
```env
DATABASE_URL="mysql://root@127.0.0.1:3307/nextjs_login"
```

**`.env.local`**
```env
DATABASE_URL="mysql://root@127.0.0.1:3307/nextjs_login"
JWT_SECRET="sua-chave-secreta-aqui"
```

> ⚠️ Nunca versione os arquivos `.env` — eles já estão no `.gitignore`.

---

## Rodando o Projeto

```bash
# Certifique-se que o Docker está rodando
docker-compose up -d

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

---

## Estrutura de Pastas

```
Douratta/
├── pages/
│   ├── _app.js               # Provider global + CartSidebar
│   ├── _document.js          # Head global (fontes)
│   ├── index.js              # Home
│   ├── login.js              # Login
│   ├── cadastro.js           # Cadastro
│   ├── 404.js                # Página de erro personalizada
│   ├── produtos/
│   │   ├── index.js          # Listagem de produtos
│   │   └── [slug].js         # Detalhe do produto
│   ├── carrinho.js           # Página do carrinho
│   ├── checkout.js           # Checkout com cupons
│   ├── confirmacao.js        # Confirmação do pedido
│   ├── perfil.js             # Perfil do usuário
│   ├── sobre.js              # Sobre a marca
│   ├── contato.js            # Contato
│   ├── admin/
│   │   └── index.js          # Painel administrativo
│   └── api/
│       ├── user/             # Rotas do usuário
│       │   ├── login.js
│       │   ├── cadastro.js
│       │   ├── perfil.js
│       │   ├── senha.js
│       │   ├── enderecos.js
│       │   ├── pedidos.js
│       │   └── favoritos.js
│       ├── admin/            # Rotas administrativas
│       │   ├── dashboard.js
│       │   ├── produtos.js
│       │   ├── pedidos.js
│       │   ├── categorias.js
│       │   ├── cupons.js
│       │   ├── usuarios.js
│       │   ├── separacao.js
│       │   └── relatorios.js
│       ├── orders.js         # Criação de pedidos
│       ├── coupons.js        # Validação de cupons
│       ├── reviews.js        # Avaliações de produtos
│       └── seed.js           # Seed de dados
├── src/
│   ├── components/
│   │   ├── Navbar/           # Navbar responsiva com menu mobile
│   │   ├── Footer/
│   │   ├── Home/
│   │   ├── ProductCard/      # Card + Skeleton loading
│   │   ├── ProductDetail/
│   │   ├── CartSidebar/
│   │   ├── Checkout/
│   │   ├── Profile/
│   │   ├── Admin/
│   │   ├── Reviews/          # Sistema de avaliações
│   │   ├── NotFound/         # Página 404
│   │   ├── Sobre/
│   │   └── Contato/
│   ├── context/
│   │   └── CartContext.js    # Context API do carrinho
│   └── hooks/
│       └── useTheme.js       # Hook de modo escuro
├── services/
│   ├── prisma.js             # Cliente Prisma com adapter
│   ├── user.js               # Serviços de usuário
│   └── auth.js               # Verificação de JWT
├── generated/prisma/         # Cliente Prisma gerado
├── prisma/
│   ├── schema.prisma         # Schema do banco (11 entidades)
│   └── migrations/
├── styles/
│   └── globals.css           # Variáveis CSS + modo escuro
├── prisma.config.ts
├── docker-compose.yml
├── .gitlab-ci.yml            # Pipeline CI/CD GitLab
└── next.config.js
```

---

## Funcionalidades

### Para o Cliente
- ✅ Cadastro e login com JWT
- ✅ Listagem de produtos com filtro, busca e ordenação
- ✅ Skeleton loading animado nos cards
- ✅ Detalhe do produto com avaliações (estrelas 1-5)
- ✅ Carrinho de compras (sidebar + página dedicada)
- ✅ Checkout com cupons de desconto (%, valor fixo, frete grátis)
- ✅ Página de confirmação de pedido
- ✅ Perfil com dados, senha, endereços, pedidos e favoritos
- ✅ Wishlist / Favoritos
- ✅ Modo escuro com persistência no localStorage
- ✅ Interface responsiva (mobile + desktop)
- ✅ Página 404 personalizada
- ✅ Produtos com estoque 0 removidos automaticamente da vitrine

### Para a Loja
- ✅ Painel administrativo completo
- ✅ Dashboard com métricas e pedidos recentes
- ✅ CRUD de produtos com upload e compressão de imagem
- ✅ CRUD de categorias
- ✅ Gestão de pedidos com atualização de status
- ✅ Tela de separação de pedidos para envio
- ✅ Gestão de cupons (criar, editar, desativar)
- ✅ Gestão de usuários (toggle admin/cliente, remover)
- ✅ Controle automático de estoque ao finalizar pedido
- ✅ Devolução de estoque ao negar pedido

---

## Painel Admin

Acesse `/admin` com uma conta de administrador.

### Abas disponíveis

| Aba | Descrição |
|---|---|
| Dashboard | Métricas e pedidos recentes |
| Produtos | CRUD completo com imagem |
| Pedidos | Visualização e atualização de status |
| Separação | Fila de pedidos para envio |
| Cupons | Criação e gestão de cupons |
| Usuários | Gestão de contas |
| Categorias | CRUD com imagem de produto |

---

## Deploy

O projeto está hospedado em:

- **Frontend + API:** [Vercel](https://vercel.com) → [douratta.vercel.app](https://douratta.vercel.app)
- **Banco de Dados:** [Railway](https://railway.app) (MySQL)

### Variáveis de ambiente na Vercel

```
DATABASE_URL=mysql://root:senha@host.railway.app:porta/railway
JWT_SECRET=sua-chave-secreta
```

### CI/CD

Pipeline configurado no GitLab (`.gitlab-ci.yml`) com três stages:
- `install` — instala dependências
- `test` — roda lint
- `build` — gera o build de produção (apenas na branch `main`)

---

## Scripts

```bash
npm run dev              # Servidor de desenvolvimento
npm run build            # Build de produção
npm run start            # Servidor de produção
npx prisma studio        # Visualizador do banco (localhost:5555)
npx prisma migrate dev   # Roda migrations
npx prisma generate      # Gera o cliente Prisma
```

---

## Branch Strategy

```
main              # Produção — código estável
feat/melhorias    # Features concluídas e mergeadas
feat/novas-funcionalidades  # Features concluídas e mergeadas
```

---

## Equipe

| Nome | Cargo |
|---|---|
| Pedro Henrique Carvalho dos Santos | Programador & CEO |
| Pedro Henrique Gomes da Silva | Chefe & Artesão Profissional |
| Juan Assis | Vendedor & Gerente |
| Pedro Weverton Bernardes Rodrigues | Mestre em Refinamento de Joias |

---

<div align="center">
  <strong>DOUR·ATTA</strong> — Joias Exclusivas · Feitas à Mão · Ouro 18K
</div>
