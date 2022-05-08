import React from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";

export default function ReservationTableRows(
    {reservation},
) {
// const history = useHistory()
    // const handleCancel = async (id) => {
    //     const result = window.confirm(
    //         "Do you want to cancel this reservation? This cannot be undone."
    //     );
    //     if (result) {
    //       history.go();
    //       const abortController = new AbortController();
    //       return await deleteDeck(id, abortController.signal);
    //     }
    //   };
    return (
        <tr key={reservation.reservation_id}>
      <th scope="row">{reservation.reservation_id}</th>
      <td>{`${reservation.last_name}, ${reservation.first_name}`}</td>
      <td>{reservation.mobile_number}</td>
      <td>{reservation.reservation_time}</td>
      <td>{reservation.reservation_date}</td>
      <td>{reservation.people}</td>
      <td>placeholder</td>
      <td>
          <Link to={`/reservations/${reservation.reservation_id}/seat`}>
            <button 
            type="button" 
            className="btn btn-secondary">
              Seat
            </button>
          </Link>
        </td>
      <td>
        <Link to={`/reservations/${reservation.reservation_id}/edit`}>
          <button 
          type="button" 
          className="btn btn-secondary">
            Edit
          </button>
        </Link>
      </td>
      <td>
        <button
          type="button"
          className="btn btn-secondary"
          data-reservation-id-cancel={reservation.reservation_id}
        //   onClick={() => handleCancel(reservation.reservation_id)}
        >
          Cancel
        </button>
      </td>
    </tr>
    )
}