# 🔐 Next.js Login System

Sistema de autenticação com telas de login e cadastro, desenvolvido com Next.js e CSS customizado com efeito glassmorphism.

---

## 📸 Telas

- **Login** — autenticação com email e senha
- **Cadastro** — registro com nome, email, senha e confirmação de senha

---

## 🚀 Tecnologias

- [Next.js](https://nextjs.org/) — framework React
- [Ionicons](https://ionic.io/ionicons) — ícones
- [Google Fonts — Poppins](https://fonts.google.com/specimen/Poppins) — tipografia
- CSS puro com efeito glassmorphism

---

## 📁 Estrutura do projeto

```
nextjs-login/
├── pages/
│   ├── _app.js           # configuração global (CSS + ícones)
│   ├── index.js          # tela de login (rota /)
│   ├── cadastro.js       # tela de cadastro (rota /cadastro)
│   └── api/
│       ├── login.js      # rota de API para login
│       └── cadastro.js   # rota de API para cadastro
├── public/
│   └── img/
│       └── Tela-login.png
├── src/
│   └── components/
│       ├── input/
│       │   └── input.js  # componente de campo reutilizável
│       └── LoginCard/
│           └── loginCard.js
└── styles/
    └── globals.css
```

---

## ⚙️ Como rodar localmente

**Pré-requisitos:** Node.js instalado

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/nextjs-login.git

# Entre na pasta
cd nextjs-login

# Instale as dependências
npm install

# Rode o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador.

---

## 📄 Licença

Este projeto está sob a licença MIT.