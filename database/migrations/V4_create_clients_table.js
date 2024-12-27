/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    const exists = await knex.schema.hasTable('clients');
    if (!exists) {
        return knex.schema.createTable('clients', (table) => {
            table.increments('id').primary(); // id INTEGER PRIMARY KEY AUTOINCREMENT
            table.text('uuid'); // uuid TEXT
            table.string('first_name').notNullable(); // first_name TEXT NOT NULL
            table.string('last_name').notNullable(); // last_name TEXT NOT NULL
            table.string('email').notNullable(); // email TEXT NOT NULL
            table.string('phone'); // phone TEXT
            table.string('sex'); // sex TEXT
            table.text('address'); // address TEXT
            table.datetime('created_at').defaultTo(knex.fn.now()); // created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            table.datetime('updated_at'); // updated_at DATETIME
        });
    }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('clients');
};
