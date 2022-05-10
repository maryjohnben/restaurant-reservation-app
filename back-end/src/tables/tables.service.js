const knex = require("../db/connection");

//list all table by asc table_name
function list() {
  return knex("tables").select("*").orderBy("table_name");
}

//creates a new table
function create(table) {
  return knex("tables")
    .insert(table)
    .returning("*")
    .then((newEntry) => newEntry[0]);
}

function readTable(table_id) {
  return knex("tables").select("*").where({ table_id }).first();
}

function updateTableStatus(updatedTable) {
  return knex("tables")
    .select("*")
    .where({ table_id: updatedTable.table_id })
    .update(updatedTable)
    .returning('*')
    .then((updated) => updated[0]);
}

module.exports = {
  list,
  create,
  readTable,
  updateTableStatus,
};
