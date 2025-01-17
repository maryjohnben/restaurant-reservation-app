import React from "react";
import ReservationTableRows from "./ReservationTableRows";

//displays the table that shows customers that have reserved for the day. Defaults to today unless chosen otherwis
export default function ReservationTable({ reservations, handleCancel }) {
  const rows = reservations.map((reservation) => (
    <ReservationTableRows
      handleCancel={handleCancel}
      reservation={reservation}
      key={reservation.reservation_id}
    />
  ));

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
          <th scope="col">Status</th>
          <th scope="col">Seat?</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}
