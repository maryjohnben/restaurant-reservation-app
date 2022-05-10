import React from "react";
import {Link, useHistory} from 'react-router-dom'
import { reservationStatusCancelled } from "../utils/api";

export default function ReservationTableRows(
    {reservation, handleCancel},
) {
  const history = useHistory()
  // if(reservation.status === 'finished' || reservation.status === 'cancelled') return null;
    
    return (
        <tr key={reservation.reservation_id}>
      <th scope='row'>{reservation.reservation_id}</th>
      <td>{`${reservation.last_name}, ${reservation.first_name}`}</td>
      <td>{reservation.mobile_number}</td>
      <td>{reservation.reservation_time}</td>
      <td>{reservation.reservation_date}</td>
      <td>{reservation.people}</td>
      <td data-reservation-id-status={reservation.reservation_id}>{reservation.status}</td>
        
        {reservation.status === 'booked' && (
        <>
          <td className="text-center">
            <a href={`/reservations/${reservation.reservation_id}/seat`}>
              <button className="btn btn-secondary" type="button">
                Seat
              </button>
            </a>
          </td>
         <td>
         <Link to={`/reservations/${reservation.reservation_id}/edit`}>
           <button type="button" className="btn btn-secondary">
             Edit
           </button>
         </Link>
       </td>
       
       <td>
         <button
           type="button"
           className="btn btn-secondary"
           data-reservation-id-cancel={reservation.reservation_id}
           onClick={() => handleCancel(reservation.reservation_id)}
           >
           Cancel
         </button>
       </td>
       </>
    )}
        </tr>
    );
}