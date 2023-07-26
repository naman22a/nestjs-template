# Nest JS Template

[Nest JS Template](https://github.com/namanarora1022/nestjs-template) is a starter repository for my personal Nest JS projects.

## Features covered

-   📱 NestJS — latest version
-   🎉 TypeScript - Type checking
-   ⚙️ Dotenv - Supports environment variables
-   🔐 Authentication - JWT, RSA256, Access and Refresh tokens
-   🏪 MikroORM - Database ORM
-   🏪 PostgreSQL - Open-Source Relational Database
-   🧠 Configuration - Single config for all
-   📃 Swagger - API Documentation
-   ⛑️ Helmet - secure HTTP headers
-   📏 ESLint — Pluggable JavaScript linter
-   🦋 Prettier - Opinionated Code Formatter

## File Structure

```
nestjs-template
├── coverage                                      * Coverage reports
├── dist                                          * Optimized code for production
├── src
|   └── auth                                      * Folder where authentication is handled
|   └── common                                    * Common constants, interfaces, pipes, dto, entity,guards, custom validators etc.
|   └── config                                    * Folder where all the configuration is stored
|       └── configuration.ts                      * All configuration of env variables is stored here.
|       └── env.validation.ts                     * Enviroment variables are validated here
|       └── index.ts                              * Re export all the files
|       └── mikro-orm.config.ts                   * Configuration for mirko orm database
|   └── migrations                                * Folder where all the migrations are stored
|   └── modules                                   * Folder where specific modules are stored
|         └── <module>
|     │       └── __tests__                       * Tests for controllers, services and guards etc.
|     │       └── dto                             * Data Transfer Objects.
|     │       └── index.ts                        * Re exports some important files
|     │       └── <module>.model.ts               * Entity file for <module>
|     │       └── <module>.model.ts               * Controller file for <module>
|     │       └── <module>.module.ts              * root module file for module
|     │       └── <module>.service.ts             * Service file for <module>
│   └── shared                                    * All shared modules are stored here
│   └── app.module.ts                             * Root module of the application
│   └── main.ts                                   * The entry file of the application which uses the core function NestFactory to create a Nest application instance
├── test                                          * End to end test files for the application
├── typings                                       * Typescript typings for libraries are stored here in .d.ts files
├── .env.example                                  * Sample configuration file.
├── .eslintrc.js                                  * All eslint rules are stored in this file
├── .gitignore                                    * Files and folders to be ignored by git are added here like .env and node_modules
├── .prettierrc                                   * Prettier config
├── nest-cli.json                                 * NestJS cli config
├── package.json                                  * Stores a list of all nodejs dependencies
├── tsconfig.build.json                           * Stores configuration for typescript rules for build
├── tsconfig.json                                 * Stores configuration for typescript rules
├── yarn.lock                                     * Stores a list dependencies of all nodejs dependencies with version numbers
```

## Getting started

```bash
# 1. Clone the repository
$ git clone https://github.com/namanArora1022/nestjs-template

# 2. Enter your newly-cloned folder.
$ cd nestjs-template

# 3. Create Environment variables file.
$ cp .env.example .env

# 4. Install dependencies (preferred: yarn)
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Stay in touch

-   Author - [Naman Arora](https://namanarora.vercel.app)
-   Twitter - [@namanarora1022](https://twitter.com/namanarora1022)
<!-- - Website - [https://nestjs.com](https://nestjs.com/) -->

## License

Nest is [MIT licensed](LICENSE).
