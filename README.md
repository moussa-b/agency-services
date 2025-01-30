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
npm install
```

### Setup environment

#### 1. Create .env file

The `.env` file must be created in project root folder, at the same level than `package.json` file. It can be generated by running the following command in terminal.

```bash
echo "# JWT secret key used for authentication
JWT_SECRET=jwtsecret123

# Password for the initial admin user
ADMIN_USER_PASSWORD=admin123

# Optional database connexion
# DATABASE_URL=mysql://agencyservices:agencyservices@localhost:3306/agency_db

# Optional email configuration for sending emails
EMAIL_USER=admin@example.com
EMAIL_PASSWORD=password123
EMAIL_SMTP_HOST=example.com
EMAIL_SMTP_PORT=465
EMAIL_SMTP_SECURE=true

# Optional front-end application URL
FRONT_END_URL=http://localhost:4300

# Optional swagger documentation API details
SWAGGER_ROUTE=/api/docs
SWAGGER_USER=api_doc_user
SWAGGER_PASSWORD=swagger123" > .env
```

#### 2. Minimal `.env` file

Some of the environment variables created at point #1 are optional. However, the `.env` file must at least contain the following environment variables.

```
JWT_SECRET=jwtsecret123
ADMIN_USER_PASSWORD=admin123
```

#### 3. Sample complete `.env` file

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

All variables not marqued as **required** are optional.

- `JWT_SECRET`: This is a **required** variable that holds a secret key used for generating JSON Web Tokens (JWT) for authentication purposes. Keep this value secure as it allows users to be authenticated within the application.
- `ADMIN_USER_PASSWORD`: This is a **required** variable that defines the initial password for the admin user. It's recommended to change this password after the initial setup for security reasons.
- `DATABASE_URL`: This variable stores the connection string for the database. It uses the mysql protocol and specifies the username (agencyservices), password (agencyservices), hostname (localhost), port (3306), and database name (agency_db). If this variable is omitted Sqlite will be used for the database.
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

1. This `.env` file should not be committed to version control systems like Git as it contains sensitive information.
2. Consider using environment variables to manage these configurations in production environments.
3. While email-related environment variables are optional, it is highly recommended to provide valid values. Without them, account-related features such as account creation and password management will not.

## Compile and run the project

**Important Note:**

Be sure that proper `.env` file is present before running the application.

### Run with npm

To run the application in development mode, run the following command:

```bash
npm run start
```

To run the application in development mode and watch for code changes, run the following command:

```bash
npm run start:dev
```

To run the application in production mode, run the following command:

```bash
npm run start:prod
```

### Run tests

To run unit tests with, run the following command:
```bash
npm run test
```
To run e2e tests with, run the following command:
```bash
npm run test:e2e
```
To run test coverage, run the following command:
```bash
npm run test:cov
```

### Run with Docker

**Important Note:**

Be sure that proper `.env` file is present before building the Docker image.

#### 1. Running the application with an SQLite Database

Build the Docker image by running the following command from the project's root directory:
```bash
docker build --no-cache -t agency-services .
```
Start the newly built Docker image using the following command:
```bash
docker run -p3000:3000 --env-file .env -d --name container-agency-services agency-services:latest
```

#### 2. Running the application with an MySQL Database

To launch the services, including a MySQL container connected to the NestJS application, run the following command:
```bash
docker-compose up -d
```
To stop the services, use the command:
```bash
docker-compose stop
```
To restart the services after stopping them, run:
```bash
docker-compose start
```
Alternatively the services can be restarted with the folling command:
```bash
docker-compose restart
```

## API Usage with cURL

You can verify that the application is running correctly by making API requests using cURL.

### Authentication

Retrieve a JWT token by authenticating. The password `pwd` must be replaced by the one set in environment variable `ADMIN_USER_PASSWORD`.

```sh
curl http://localhost:4300/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"pwd"}'
```

The response will include a JWT token that must be used in subsequent requests.

```json
{"accessToken":"YOUR_JWT_TOKEN"}
```

### Client CRUD Operations (Protected by JWT)

#### 1. Create a Client

```sh
curl http://localhost:4300/api/clients \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"lastName":"SAMPLE","firstName":"Client","email":"sample.client@example.com","phone":"01.02.03.94.05","sex":"M","preferredLanguage":"en","address":"1 Rue de Rivoli, 75000 PARIS"}'
```

#### 2. Get All Clients

```sh
curl http://localhost:4300/api/clients \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN'
```

#### 3. Get a Single Client

The variable `{clientId}` must be replaced by a valid client id for subsequent requests.

```sh
curl http://localhost:4300/api/clients/{clientId} \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN'
```

#### 4. Update a Client

```sh
curl http://localhost:4300/api/clients/{clientId} \
  -X 'PATCH' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"id":3,"lastName":"SAMPLE - UPDATED","firstName":"Client","email":"sample.client@example.com","phone":"01.02.03.94.05","sex":"M","preferredLanguage":"en","address":"1 Rue de Rivoli, 75000 PARIS"}'
```

#### 5. Delete a Client

```sh
curl http://localhost:4300/api/clients/{clientId} \
  -X 'DELETE' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' 
```

## Miscellaneous Docker commands

Clean volumes, images, networks
```bash
docker image prune -a -f && docker volume prune -a -f && docker network prune -f
```
