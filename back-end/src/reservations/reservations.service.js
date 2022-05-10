const knex = require("../db/connection");
//pulls reservations data from the table and orders the result by reservation time
function list(reservation_date) {
  return knex("reservations")
    .select("*")
    .where({ reservation_date })
    .orderBy("reservation_time");
}
//creates reservations when propmpted. Receives data body to create new reservation
function create(reservation) {
  return knex("reservations")
    .insert(reservation) //from post body
    .returning("*")
    .then((created) => created[0]);
}

//find reservation with id
function readReservation(reservation_id) {
  return knex("reservations").select("*").where({ reservation_id }).first();
}
//updates reservation status using
function updateReservation(updatedReservationStatus) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: updatedReservationStatus.reservation_id })
    .update(updatedReservationStatus)
    .returning("*")
    .then((updated) => updated[0]);
}
//updates reservations to make changes to form made later on possible.
function update(updatedReservation) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: updatedReservation.reservation_id })
    .update(updatedReservation)
    .returning("*")
    .then((updatedNew) => updatedNew[0]);
}
//searches for customers when provided with mobile number if needed
function searchMobile(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}
module.exports = {
  list,
  create,
  readReservation,
  updateReservation,
  update,
  searchMobile,
};
