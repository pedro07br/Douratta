# 🛍️ E-commerce Fullstack com Next.js

Aplicação completa de e-commerce desenvolvida com Next.js, Prisma e MySQL, incluindo autenticação, catálogo de produtos, filtros, página de detalhes e carrinho de compras com gerenciamento global de estado.

---

## ✨ Funcionalidades

### 🔐 Autenticação
- Cadastro de usuários
- Login com JWT
- Proteção de rotas

### 🛒 Carrinho de Compras
- Adição de produtos
- Controle de quantidade
- Atualização dinâmica
- Abertura lateral (sidebar)
- Estado global com Context API

### 🛍️ Catálogo de Produtos
- Listagem de produtos (coleções)
- Filtros por categoria
- Navegação dinâmica

### 💎 Página de Produto
- Nome, descrição e preço
- Controle de estoque
- Seleção de quantidade
- Produtos relacionados

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado na sua máquina:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Git](https://git-scm.com/)

---

## 🚀 Como rodar o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/nextjs-login.git
cd nextjs-login
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie os arquivos `.env` e `.env.local` na raiz do projeto.

**.env** (usado pelo Prisma):
```env
DATABASE_URL="mysql://root@localhost:3307/nextjs_login"
```

**.env.local** (usado pelo Next.js):
```env
DATABASE_URL="mysql://root@localhost:3307/nextjs_login"
JWT_SECRET="sua-chave-secreta-aqui"
```

> Use o `.env.example` como referência.

### 4. Suba o banco de dados com Docker

```bash
docker-compose up -d
```

Verifique se o container está rodando:

```bash
docker ps
```

Você deve ver o container `nextjs-login-db` com status `Up`.

### 5. Crie as tabelas no banco

```bash
npx prisma migrate dev --name init
```

### 6. Gere o Prisma Client

```bash
npx prisma generate
```

### 7. Rode o projeto

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador.

---

## 🗂️ Estrutura do projeto

```
nextjs-login/
├── pages/
│   ├── _app.js           # configuração global (CSS + ícones)
│   ├── index.js          # home (protegida por token)
│   ├── login.js          # tela de login
│   ├── cadastro.js       # tela de cadastro
│   ├── carrinho.js(novo) # tela do carrinho
│   ├── api/
│   │   └── user/
│   │       ├── login.js      # rota de API para login
│   │       └── cadastro.js   # rota de API para cadastro
│   └── produtos/
│       └── user/
├── services/
│   ├── index.js        # listagem + filtros
│   └── [slug].js       # detalhe do produto
├── src/
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.js
│   │   │   └── Button.module.css
│   │   ├── cart/
│   │   │   └── Cart.module.css
│   │   ├── cartSidebar/
│   │   │   ├── CartSidebar.js
│   │   │   └── cartSidebar.module.css
│   │   ├── input/
│   │   │   ├── input.js
│   │   │   └── input.module.css
│   │   ├── LoginCard/
│   │   │   ├── loginCard.js
│   │   │   └── loginCard.module.css
│   │   ├── Navbar/
│   │   │   ├── Navbar.js
│   │   │   └── Navbar.module.css
│   │   ├── productCard/
│   │   │   ├── productCard.js
│   │   │   └── productCard.module.css
│   │   ├── ProductDetail/
│   │   │   └── ProductDetail.module.css
│   │   ├── ProductList/
│   │   │   └── ProductList.module.css
│   │   ├── LoginCard/
│   │   │   ├── loginCard.js
│   │   │   └── loginCard.module.css
│   └── context/
│       └── CartContext.js
├── prisma/
│   └── schema.prisma     # modelo do banco de dados
├── generated/
│   └── prisma/           # gerado automaticamente pelo Prisma
├── public/
│   └── img/
│       └── Tela-login.png
├── styles/
│   ├── globals.css
│   ├──marble
│   └──Home.module
├── docker-compose.yml
├── .env.example
└── prisma.config.ts
```

---

## 🛠️ Tecnologias

- [Next.js](https://nextjs.org/) — framework React
- [Prisma 7](https://www.prisma.io/) — ORM para banco de dados
- [MySQL](https://www.mysql.com/) — banco de dados relacional
- [Docker](https://www.docker.com/) — ambiente padronizado
- [bcryptjs](https://www.npmjs.com/package/bcryptjs) — criptografia de senhas
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) — autenticação via JWT
- [cookies-next](https://www.npmjs.com/package/cookies-next) — gerenciamento de cookies
- [Ionicons](https://ionic.io/ionicons) — ícones
- [Google Fonts — Poppins](https://fonts.google.com/specimen/Poppins) — tipografia

---

## 🗄️ Banco de dados

O banco roda na porta `3307` para não conflitar com instalações locais do MySQL.

Para visualizar os dados no navegador:

```bash
npx prisma studio
```

Acesse [http://localhost:5555](http://localhost:5555).

---

## ⚠️ Problemas comuns

**Docker não sobe o container:**
```bash
# para containers antigos e reinicia
docker-compose down
docker-compose up -d
```

**Erro de migration:**
```bash
# reseta e recria as tabelas
npx prisma migrate reset
npx prisma migrate dev --name init
```

**Prisma Client desatualizado:**
```bash
npx prisma generate
```

---

## 📄 Licença

Este projeto está sob a licença MIT.