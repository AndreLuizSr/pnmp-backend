# pnmp-backend (backend)
PNMP - Patient notification and monitoring platform ("Plataforma de Notificação e Acompanhamento de Doentes" em Português). Documento técnico: https://docs.google.com/document/d/1TG5ZlwZ9juKItxYGcApI55a5WIDy-6EOl-4vX6-KEcw/edit?usp=sharing

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation MongoDB to test

```bash
$ docker run -d --name mongodb -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=admin -p 27017:27017 mongo
```

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

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
