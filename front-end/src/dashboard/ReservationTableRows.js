import React from "react";
import {Link} from 'react-router-dom'

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
      <th>{reservation.reservation_id}</th>
      <td>{`${reservation.last_name}, ${reservation.first_name}`}</td>
      <td>{reservation.mobile_number}</td>
      <td>{reservation.reservation_time}</td>
      <td>{reservation.reservation_date}</td>
      <td>{reservation.people}</td>
      <td>
      <td className="text-center">
            <a href={`/reservations/${reservation.reservation_id}/seat`}>
              <button className="btn btn-secondary" type="button">
                Seat
              </button>
            </a>
          </td>
        </td>
    </tr>
    )
}