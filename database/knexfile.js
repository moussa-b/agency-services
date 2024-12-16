/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
require('dotenv').config({ path: process.env.NODE_ENV === 'production' ? '../../.env' : '../.env' });
const path = require('path');

const filename = path.resolve(path.join(__dirname, '..', process.env.DATABASE_FILE));
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
