import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { today } from "../utils/date-time";
import useQuery from "../utils/useQuery";
import ReservationButton from "./ReservationButton";
import ReservationTable from "./ReservationTable";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard() {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  
  //hook to pull date query from the url if there is no action present then date is defaulted to today()
  const query = useQuery();
  let date = query.get('date')
  if(!date) {
    date = today()
  }
  // console.log(date)
  
  useEffect(loadDashboard, [date]);
  
  //list all reservation on a given day
  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
    .then(setReservations)
    .catch(setReservationsError);
    //add in tables data
    return () => abortController.abort();
  }
  
  // console.log(reservations)
  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <ReservationButton date={date} />
      <ReservationTable reservations={reservations} />
    </main>
  );
}

export default Dashboard;
