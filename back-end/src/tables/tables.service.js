const knex = require("../db/connection");

//list all table by asc table_name
function list() {
  return knex("tables")
  .select("*")
  .orderBy("table_name");
}

//creates a new table
function create(table) {
  return knex("tables")
    .insert(table)
    .returning("*")
    .then((newEntry) => newEntry[0]);
}

module.exports = {
  list,
  create,
};
