/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
const path = require('path');
const pathPrefix = process.env.NODE_ENV === 'production' ? '../..' : '..'
require('dotenv').config({ path: pathPrefix + '/.env' });

const filename = path.resolve(path.join(__dirname, pathPrefix , process.env.DATABASE_FILE));
console.log('Running knexfile.js with process.env.DATABASE_FILE = ', filename);

module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: filename
    },
    useNullAsDefault: true,
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations'
    },
    seeds: {
      directory: './seeds'
    },
  },

  staging: {
    client: 'sqlite3',
    connection: {
      filename: process.env.DATABASE_FILE
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations'
    },
    seeds: {
      directory: './seeds'
    },
  },

  production: {
    client: 'sqlite3',
    connection: {
      filename: filename
    },
    useNullAsDefault: true,
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations'
    },
    seeds: {
      directory: './seeds'
    },
  }

};
