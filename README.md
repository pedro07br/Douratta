# DOUR·ATTA — E-commerce de Joias

> Plataforma de e-commerce completa para joias artesanais em ouro 18k, desenvolvida com Next.js, Prisma e MySQL.

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
- [Equipe](#equipe)

---

## Sobre o Projeto

A **Douratta** é uma loja virtual de joias artesanais que combina elegância e tecnologia. O sistema oferece uma experiência completa de compra para o cliente e um painel administrativo robusto para gestão da loja.

---

## Tecnologias

| Tecnologia | Versão | Uso |
|---|---|---|
| Next.js | 16.2 | Framework React (Pages Router) |
| Prisma | 7.5 | ORM para banco de dados |
| MySQL | 8.0 | Banco de dados relacional |
| Docker | - | Container do banco de dados |
| JWT | - | Autenticação |
| bcryptjs | - | Hash de senhas |
| cookies-next | - | Gerenciamento de cookies |
| @prisma/adapter-mariadb | - | Adapter do banco |

---

## Pré-requisitos

- Node.js 18+
- npm ou yarn
- Docker Desktop
- Git

---

## Instalação

**1. Clone o repositório:**
```bash
git clone https://github.com/pedro07br/Douratta
cd douratta/nextjs-login
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

**`next.config.js`**
```js
const nextConfig = {
  reactStrictMode: true,
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    }
  },
  images: {
    domains: ['images.unsplash.com']
  }
}

module.exports = nextConfig
```

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
nextjs-login/
├── pages/
│   ├── _app.js               # Provider global + CartSidebar
│   ├── _document.js          # Head global (fontes)
│   ├── index.js              # Home
│   ├── login.js              # Login
│   ├── cadastro.js           # Cadastro
│   ├── produtos/
│   │   ├── index.js          # Listagem de produtos
│   │   └── [slug].js         # Detalhe do produto
│   ├── carrinho.js           # Página do carrinho
│   ├── checkout.js           # Checkout
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
│       │   ├── usuarios.js
│       │   └── separacao.js
│       ├── orders.js         # Criação de pedidos
│       └── seed.js           # Seed de dados
├── src/
│   ├── components/           # Componentes React
│   │   ├── Navbar/
│   │   ├── Footer/
│   │   ├── Home/
│   │   ├── ProductCard/
│   │   ├── ProductDetail/
│   │   ├── CartSidebar/
│   │   ├── Checkout/
│   │   ├── Profile/
│   │   ├── Admin/
│   │   ├── Sobre/
│   │   └── Contato/
│   └── context/
│       └── CartContext.js    # Context API do carrinho
├── services/
│   ├── prisma.js             # Cliente Prisma
│   ├── user.js               # Serviços de usuário
│   └── auth.js               # Verificação de JWT
├── generated/prisma/         # Cliente Prisma gerado
├── prisma/
│   ├── schema.prisma         # Schema do banco
│   └── migrations/           # Histórico de migrations
├── styles/
│   └── globals.css
├── prisma.config.ts
├── docker-compose.yml
└── next.config.js
```

---

## Funcionalidades

### Para o Cliente
- ✅ Cadastro e login com JWT
- ✅ Listagem de produtos com filtro por categoria, busca e ordenação
- ✅ Detalhe do produto com produtos relacionados
- ✅ Carrinho de compras (sidebar + página dedicada)
- ✅ Checkout completo com endereço e pagamento (cartão, PIX, boleto)
- ✅ Página de confirmação de pedido
- ✅ Perfil com dados pessoais, senha, endereços, pedidos e favoritos
- ✅ Produtos com estoque 0 removidos automaticamente da vitrine

### Para a Loja
- ✅ Painel administrativo completo
- ✅ Dashboard com métricas e pedidos recentes
- ✅ CRUD de produtos com upload de imagem
- ✅ CRUD de categorias com imagem de produto
- ✅ Gestão de pedidos com atualização de status
- ✅ Tela de separação de pedidos para envio
- ✅ Gestão de usuários (toggle admin/cliente, remover)
- ✅ Controle automático de estoque ao finalizar pedido
- ✅ Devolução de estoque ao negar pedido

---

## Painel Admin

Acesse `/admin` com uma conta de administrador.

Para criar o primeiro admin, cadastre um usuário normalmente e altere o campo `role` diretamente no banco:

```sql
UPDATE User SET role = 'ADMIN' WHERE email = 'seu@email.com';
```

### Abas disponíveis

| Aba | Descrição |
|---|---|
| Dashboard | Métricas e pedidos recentes |
| Produtos | CRUD completo com imagem |
| Pedidos | Visualização e atualização de status |
| Separação | Fila de pedidos para envio |
| Usuários | Gestão de contas |
| Categorias | CRUD com imagem de produto |

---

## Equipe

| Nome | Cargo |
|---|---|
| Pedro Henrique Carvalho dos Santos | Programador & CEO |
| Pedro Henrique Gomes da Silva | Chefe & Artesão Profissional |
| Juan Assis | Vendedor & Gerente |
| Pedro Weverton Bernardes Rodrigues | Mestre em Refinamento de Joias |

---

## Scripts

```bash
npm run dev        # Inicia o servidor de desenvolvimento
npm run build      # Gera o build de produção
npm run start      # Inicia o servidor de produção
npx prisma studio  # Abre o Prisma Studio (visualizador do banco)
npx prisma migrate dev   # Roda as migrations
npx prisma generate      # Gera o cliente Prisma
```

---

## Branch Strategy

```
main              # Produção — código estável
feat/melhorias    # Branch atual de desenvolvimento
```

Para fazer merge de uma feature na main:
```bash
git checkout main
git merge feat/melhorias
git push
```

---

<div align="center">
  <strong>DOUR·ATTA</strong> — Joias Exclusivas · Feitas à Mão · Ouro 18K
</div>
