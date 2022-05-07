import React from "react";
import ReservationTableRows from "./ReservationTableRows";

export default function ReservationTable({
    reservations,
}) {
    // console.log(reservations)
    const rows = reservations.map((reservation)=> (
        <ReservationTableRows 
        reservation={reservation}
        key={reservation.reservation_id}
        />
    ));
// console.log(rows)
    return (
        <table className="table">
  <thead className="thead-dark">
    <tr>
      <th scope="col">#</th>
      <th scope="col">Name</th>
      <th scope="col">Phone</th>
      <th scope="col">Date</th>
      <th scope="col">Time</th>
      <th scope="col">People</th>
      {/* <th scope="col">Status</th> */}
    </tr>
  </thead>
  <tbody>
      {rows}
  </tbody>
</table>
    )
}