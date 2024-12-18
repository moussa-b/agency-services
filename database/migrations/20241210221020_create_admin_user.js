/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const bcrypt = require('bcrypt');

exports.up = function(knex) {
  if (process.env.NODE_ENV === 'development') {
    console.log('ADMIN_USER_PASSWORD = ', process.env.ADMIN_USER_PASSWORD);
  }
  return bcrypt.hash(process.env.ADMIN_USER_PASSWORD, 10).then((cryptedPassword) => {
    return knex.raw(`
      INSERT INTO users (uuid, username, email, password, first_name, last_name, role, is_active, created_at) VALUES
          ('fa2e07d2-8560-4788-ae12-3afc0037223a', 'admin', 'admin@example.com', '${cryptedPassword}', 'Administrator', 'System', 'ADMIN', 1, CURRENT_TIMESTAMP);
  `)
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.raw(`DELETE FROM users WHERE uuid = 'fa2e07d2-8560-4788-ae12-3afc0037223a';`);
};
