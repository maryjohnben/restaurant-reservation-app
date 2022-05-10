import React from "react";
import { Link, useHistory } from "react-router-dom";
import { reservationStatusCancelled } from "../utils/api";

//row that populates the reservation table on the dashbaord. This component also incorporates seat, edit and cancel as needed.
export default function ReservationTableRows({ reservation }) {
  const history = useHistory();
  const handleCancel = async (reservation_id) => {
    const ac = new AbortController();
    const result = window.confirm(
      "Do you want to cancel this reservation? This cannot be undone."
    );
    if (result) {
      history.go();
      const response = await reservationStatusCancelled(
        reservation_id,
        ac.signal
      );
      return response;
    }
    return () => ac.abort();
  };
  return (
    <tr>
      <th scope="row">{reservation.reservation_id}</th>
      <td>{reservation.first_name}</td>
      <td>{reservation.last_name}</td>
      <td>{reservation.mobile_number}</td>
      <td>{reservation.reservation_time}</td>
      <td>{reservation.reservation_date}</td>
      <td>{reservation.people}</td>
      <td data-reservation-id-status={reservation.reservation_id}>
        {reservation.status}
      </td>
      <td>
        {reservation.status === "booked" && (
          <>
            <Link to={`/reservations/${reservation.reservation_id}/seat`}>
              <button className="btn btn-primary" style={{ margin: "2px" }}>
                Seat
              </button>
            </Link>
            <Link to={`/reservations/${reservation.reservation_id}/edit`}>
              <button
                type="button"
                style={{ margin: "2px" }}
                className="btn btn-secondary"
              >
                Edit
              </button>
            </Link>
            <button
              style={{ margin: "2px" }}
              className="btn btn-danger"
              data-reservation-id-cancel={reservation.reservation_id}
              onClick={() => handleCancel(reservation.reservation_id)}
            >
              Cancel
            </button>
          </>
        )}
      </td>
    </tr>
  );
}
