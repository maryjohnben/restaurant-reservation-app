const knex = require('../db/connection')

function list(reservation_date) {
    return knex('reservations')
    .select('*')
    .where({reservation_date})
    .orderBy('reservation_time')
}


function create(reservation) {
    return knex('reservations')
    .insert(reservation) //from post body
    .returning('*')
    .then((created)=> created[0])
}
//find reservation with id
function readReservation(reservation_id) {
    return knex('reservations')
    .select('*')
    .where({reservation_id})
    .first()
}
//updates cancelled reservation status
function updateReservationStatus(updatedReservationStatus) {
    return knex('reservations')
    .select('*')
    .where({reservation_id: updatedReservationStatus.reservation_id})
    .update(updatedReservationStatus)
    .returning('*')
    .then((updated)=> updated[0])
}
module.exports = {
    list,
    create,
    readReservation,
    updateReservationStatus
}