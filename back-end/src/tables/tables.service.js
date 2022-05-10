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

async function updateTableStatus(updatedTable) {
  await knex("tables")
    .select("*")
    .where({ table_id: updatedTable.table_id })
    .update(updatedTable)
    .returning('*')
    .then((updated) => updated[0])

    const response = await knex("reservations")
    .select("*")
    .where({ reservation_id: updatedTable.reservation_id })
    .update({ status: "seated" })
    .returning('*')
  return response[0];
}
//delete table occupancy and changes reservation status to finished
async function deleteOccupancy(table) {
  await knex("reservations")
  .select("*")
  .where({ reservation_id: table.reservation_id })
  .update({ status: "finished" })
  .returning("*")
  
  const response = await knex('tables')
  .where({table_id: table.table_id})
  .update({occupied: false, reservation_id: null}).returning('*')
  .then((newEntry)=>newEntry[0]);

  return response;
}

module.exports = {
  list,
  create,
  readTable,
  updateTableStatus,
  deleteOccupancy,
};
