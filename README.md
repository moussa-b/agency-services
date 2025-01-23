# Demo Project - WebApp with NestJS

This project is a web application developed as a demonstration. Built with **NestJS**, it showcases my backend development skills with a focus on API design and management.

## Main Features

### User Management:
- **Account Creation**: Registering new users with data validation.
- **Secure Login**: Authentication using JWT (JSON Web Token).
- **Account Recovery**: Password reset via email or secure token.
- **Password Change**: Updating user credentials.

### Generic Entity Management (Example: Clients, Calendar Events):
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

### Install dependancies

```bash
$ npm install
```

### Setup environment

#### 1. Create .env file

```bash
$ touch .env
```

#### 2. Sample `.env` file

```
# This file stores sensitive configuration variables for the application.
# It should not be committed to version control.

# Database connection details
DATABASE_URL=mysql://agencyservices:agencyservices@localhost:3306/agency_db

# JWT secret key used for authentication
JWT_SECRET=jwtsecret123

# Password for the initial admin user
ADMIN_USER_PASSWORD=admin123

# Email configuration for sending emails
EMAIL_USER=admin@example.com
EMAIL_PASSWORD=password123
EMAIL_SMTP_HOST=example.com
EMAIL_SMTP_PORT=465
EMAIL_SMTP_SECURE=true

# Front-end application URL
FRONT_END_URL=http://localhost:4300

# Swagger documentation API details
SWAGGER_ROUTE=/api/docs
SWAGGER_USER=api_doc_user
SWAGGER_PASSWORD=swagger123
```

**Explanation of each variable:**

- `DATABASE_URL`: This variable stores the connection string for the database. It uses the mysql protocol and specifies the username (agencyservices), password (agencyservices), hostname (localhost), port (3306), and database name (agency_db). If this variable is omitted Sqlite will be used for the database.
- `JWT_SECRET`: This variable holds a secret key used for generating JSON Web Tokens (JWT) for authentication purposes. Keep this value secure as it allows users to be authenticated within the application.
- `ADMIN_USER_PASSWORD`: This variable defines the initial password for the admin user. It's recommended to change this password after the initial setup for security reasons.
- `EMAIL_USER`: This variable specifies the email address used to send emails from the application.
- `EMAIL_PASSWORD`: This variable stores the password for the email address specified in `EMAIL_USER`.
- `EMAIL_SMTP_HOST`: This variable defines the hostname of the SMTP server used for sending emails.
- `EMAIL_SMTP_PORT`: This variable specifies the port number of the SMTP server.
- `EMAIL_SMTP_SECURE`: This variable indicates whether a secure connection (TLS) should be used when sending emails.
- `FRONT_END_URL`: This variable stores the base URL of the front-end application.
- `SWAGGER_ROUTE`: This variable defines the route path for accessing the Swagger documentation API.
- `SWAGGER_USER`: This variable specifies the username for accessing the Swagger documentation API.
- `SWAGGER_PASSWORD`: This variable stores the password for the Swagger documentation API user.

**Important Note:**

This `.env` file should not be committed to version control systems like Git as it contains sensitive information.
Consider using environment variables to manage these configurations in production environments.

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
