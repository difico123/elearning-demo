<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

Elearning UET Backend - A NestJS-based e-learning platform backend with MySQL, Redis, and Elasticsearch.

## Prerequisites

- Node.js (v16 or higher)
- Docker and Docker Compose (for running databases)
- npm or yarn

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=ttlab
DB_NAME=elearning2020

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_USER=
REDIS_PASSWORD=

# Application Configuration
APP_PORT=5000
APP_NAME=Elearning_UET
API_URL=http://localhost:5000/
FRONTEND_URL=http://localhost:3000,http://localhost:3001

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_ID=your-email@gmail.com
EMAIL_PASS=your-app-password

# Google OAuth (Optional)
CLIENT_ID=your-google-client-id
CLIENT_SECRET=your-google-client-secret

# Stripe Configuration (Optional)
STRIPE_API_KEY=your-stripe-api-key

# File Upload Configuration
UPLOADED_FILES_DESTINATION=public
```

### 3. Start Docker Services

Start MySQL, Redis, and Elasticsearch using Docker Compose:

```bash
docker compose up -d
```

This will start:
- MySQL on port 3306
- Redis on port 6379
- Elasticsearch on port 9200

**Note:** If you're on Apple Silicon (M1/M2/M3), the docker-compose.yaml has been configured for ARM64 compatibility.

### 4. Run Database Migrations

Run migrations to set up the database schema:

```bash
npm run migration:up
```

### 5. Seed the Database (Optional)

Populate the database with initial data:

```bash
npm run seed:run
```

### 6. Start the Application

#### Development Mode (with hot reload):
```bash
npm run start:dev
```

#### Production Mode:
```bash
npm run build
npm run start:prod
```

#### Regular Start:
```bash
npm run start
```

## Running the app

```bash
# development
$ npm run start

# watch mode (recommended for development)
$ npm run start:dev

# production mode
$ npm run build
$ npm run start:prod
```

## API Documentation

Once the server is running, access the Swagger API documentation at:
- http://localhost:5000/docs

## Available Scripts

- `npm run start:dev` - Start in development mode with hot reload
- `npm run build` - Build the application
- `npm run start:prod` - Start in production mode
- `npm run migration:up` - Run database migrations
- `npm run migration:down` - Drop database schema
- `npm run seed:run` - Run database seeders
- `npm run restart:seed` - Drop, migrate, and seed database
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
