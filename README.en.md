<h1 align="center">Imobify - Backend</h1>

## 🔧 Installation

Requirements:

- Node.js v18 or higher
- A PostgreSQL instance, or Docker.

```bash
# 1. install the project dependencies
npm install

# 2. copy .env.template to .env
cp .env.template .env

# 3. fill out .env with your environment variables

# 4. run Prisma migrations
npx prisma migrate dev

# 5. start the project in watch mode
npm run start:dev
```
The API will now be available at `http://localhost:3000/`.

### Using Docker:

[Docker](https://www.docker.com/get-started/) is recommended for running the development and test databases.

Use the following scripts:

```bash
# initialize the development database
npm run db:dev:up

# stop the development database
npm run db:dev:rm

# restart the development database
npm run db:dev:restart

# initialize the testing database
npm run db:test:up

# stop the testing database
npm run db:test:rm

# restart the testing database
npm run db:test:restart
```

## 💻 Tech
- [NestJS](https://nestjs.com/) - Node.js framework for building efficient, reliable and scalable server-side applications.
- [Prisma](https://www.prisma.io/) with [PostgreSQL](https://www.postgresql.org/) - ORM and data storage.
- [Docker](https://www.docker.com/) - Development and testing environments with containerized databases.

## ⚙️ Utilities

This project is configured with:
 
 - [husky](https://github.com/typicode/husky) for Git hooks
    - runs lint-staging, eslint and prettier on pre-commit
    - runs tests on pre-push
    - validates commit message with commitlint on commit-msg
 - [commitizen](https://github.com/commitizen/cz-cli) with [commitlint](https://github.com/conventional-changelog/commitlint) for enforcing conventional commits: \<type>[optional scope]: \<description>
    - for reference: [conventional commits](https://gist.github.com/Zekfad/f51cb06ac76e2457f11c80ed705c95a3)