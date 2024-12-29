# Demo Project - WebApp with NestJS

This project is a web application developed as a demonstration. Built with **NestJS**, it showcases my backend development skills with a focus on API design and management.

## Main Features

### User Management:
- **Account Creation**: Registering new users with data validation.
- **Secure Login**: Authentication using JWT (JSON Web Token).
- **Account Recovery**: Password reset via email or secure token.
- **Password Change**: Updating user credentials.

### Generic Entity Management (Example: Clients):
- **Full CRUD**: Create, Read, Update, and Delete operations.
- **Data Validation**: Ensuring data integrity and consistency through strict schemas.
- **Pagination and Filters**: Efficient handling of large datasets - Work in progress.

## Technologies Used
- **NestJS**: A modular backend framework built with TypeScript.
- **MySQL / MariaDB**: Relational database for data storage. Fallback automatically to Sqlite if no database provided.
- **Passport.js**: Authentication strategies management.
- **Swagger**: Interactive documentation for REST APIs.

## Prerequisites
- **Node.js** (v16 or later)
- **npm**

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
