<h1 align="center">Imobify - Backend</h1>
<p align="center"><b>Read in <a href="https://github.com/imobify/imobify-backend/blob/main/README.en.md">English</a></b></p>

## 🔧 Instalação

Requisitos:

- Node.js v18 ou maior.
- Uma instância do PostgreSQL, ou Docker.

```bash
# 1. instale as dependências do projeto
npm install

# 2. copie .env.template para .env
cp .env.template .env

# 3. preencha o arquivo .env com suas variáveis de ambiente

# 4. execute as migrations do Prisma
npx prisma migrate dev

# 5. execute o projeto em modo de desenvolvimento
npm run start:dev
```
A API ficará disponível em `http://localhost:3000/`.

### Utilizando Docker:

[Docker](https://www.docker.com/get-started/) é recomendado para instanciar bancos de dados localmente para desenvolvimento e testes.

Use os seguintes scripts:

```bash
# inicializa o banco de dados de desenvolvimento
npm run db:dev:up

# para o banco de dados de desenvolvimento
npm run db:dev:rm

# reinicia o banco de dados de desenvolvimento
npm run db:dev:restart

# inicializa o banco de dados de testes
npm run db:test:up

# para o banco de dados de testes
npm run db:test:rm

# reinicia o banco de dados de testes
npm run db:test:restart
```

## 💻 Tecnologias
- [NestJS](https://nestjs.com/) - Framework Node.js para construção de aplicações eficientes, confiáveis e escaláveis no lado do servidor.
- [Prisma](https://www.prisma.io/) com [PostgreSQL](https://www.postgresql.org/) - ORM e banco de dados.
- [Docker](https://www.docker.com/) - Ambientes de desenvolvimento e testes com bancos de dados em containers.
- [Cloudinary](https://cloudinary.com/) - Serviço em cloud para upload e entrega de imagens.

## ⚙️ Utilitários

Este repositório está configurado com:
 
 - [husky](https://github.com/typicode/husky) para Git hooks
    - executa lint-staging, eslint e prettier em pre-commit
    - executa os testes em pre-push
    - valida a mensagem de commit com commitlint em commit-msg
 - [commitizen](https://github.com/commitizen/cz-cli) com [commitlint](https://github.com/conventional-changelog/commitlint) para impor commits padronizados: \<tipo>[escopo opcional]: \<descrição>
    - referência: [conventional commits](https://gist.github.com/Zekfad/f51cb06ac76e2457f11c80ed705c95a3)