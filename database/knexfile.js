/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
const path = require('path');
const { execSync } = require('child_process');
const pathPrefix = process.env.NODE_ENV === 'production' ? '../..' : '..';
require('dotenv').config({ path: pathPrefix + '/.env' });

const filename = path.resolve(
  path.join(
    __dirname,
    pathPrefix,
    process.env.DATABASE_FILE || './database/agency_db.sqlite',
  ),
);
if (process.env.DATABASE_URL?.length > 0) {
  console.log(
    'Running knexfile.js with process.env.DATABASE_URL = ',
    obfuscateDatabaseString(process.env.DATABASE_URL),
  );
} else {
  console.log(
    'Running knexfile.js with process.env.DATABASE_FILE = ',
    filename,
  );
}

function obfuscateDatabaseString(connectionString) {
  return connectionString.replace(
    /:\/\/(.*?):(.*?)@/,
    (match, user, password) => {
      return `://${user}:*****@`;
    },
  );
}

try {
  // Exécute la commande pour récupérer le chemin de npm
  const npmPath = execSync(
    process.platform === 'win32' ? 'where npm' : 'which npm',
  )
    .toString()
    .trim();
  console.log(`Path to npm: ${npmPath}`);
} catch (error) {
  console.error('Error fetching npm path:', error.message);
}

module.exports =
  process.env.DATABASE_URL?.length > 0
    ? {
        development: {
          client: 'mysql2',
          connection: process.env.DATABASE_URL,
          migrations: {
            tableName: 'knex_migrations',
            directory: './migrations',
          },
          seeds: {
            directory: './seeds',
          },
        },

        staging: {
          client: 'mysql2',
          connection: process.env.DATABASE_URL,
          migrations: {
            tableName: 'knex_migrations',
            directory: './migrations',
          },
          seeds: {
            directory: './seeds',
          },
        },

        production: {
          client: 'mysql2',
          connection: process.env.DATABASE_URL,
          migrations: {
            tableName: 'knex_migrations',
            directory: './migrations',
          },
          seeds: {
            directory: './seeds',
          },
        },
      }
    : {
        development: {
          client: 'sqlite3',
          connection: {
            filename: filename,
          },
          useNullAsDefault: true,
          migrations: {
            tableName: 'knex_migrations',
            directory: './migrations',
          },
          seeds: {
            directory: './seeds',
          },
        },

        staging: {
          client: 'sqlite3',
          connection: {
            filename: filename,
          },
          migrations: {
            tableName: 'knex_migrations',
            directory: './migrations',
          },
          seeds: {
            directory: './seeds',
          },
        },

        production: {
          client: 'sqlite3',
          connection: {
            filename: filename,
          },
          useNullAsDefault: true,
          migrations: {
            tableName: 'knex_migrations',
            directory: './migrations',
          },
          seeds: {
            directory: './seeds',
          },
        },
      };
