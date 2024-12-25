/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.raw(`
  CREATE TRIGGER "update_clients_updated_at" AFTER UPDATE ON "clients" 
  FOR EACH ROW 
  BEGIN
    UPDATE clients
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = OLD.id;
  END;`);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.raw(`DROP TRIGGER IF EXISTS update_clients_updated_at;`);
};
