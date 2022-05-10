import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { today } from "../utils/date-time";
import useQuery from "../utils/useQuery";
import ReservationButton from "./ReservationButton";
import ReservationTable from "./ReservationTable";
import TableDisplay from "../table/TableDisplay-dashboard";
import { listTables } from "../utils/api";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
//this page showcase the main page of the app the dashboard
function Dashboard() {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesErrors, setTablesErrors] = useState(null);

  //hook to pull date query from the url if there is no action present then date is defaulted to today()
  const query = useQuery();
  let date = query.get("date");
  if (!date) {
    date = today();
  }


  useEffect(loadDashboard, [date]);

  //list all reservation on a given day
  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables(abortController.signal).then(setTables).catch(setTablesErrors);
    //add in tables data
    return () => abortController.abort();
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="row">
        <div className="table-responsive col-md-6">
          <h4 className="d-flex justify-content-left">
            Reservations for {date}
          </h4>
          <ErrorAlert error={reservationsError} />
          <ErrorAlert error={tablesErrors} />
          <div className="d-flex justify-content-left">
            <ReservationButton date={date} />
          </div>
          <ReservationTable reservations={reservations} />
        </div>
        <div
          className="table-responsive col-md-6"
          style={{ marginTop: "20px" }}
        >
          <h4
            className="d-flex justify-content-left"
            style={{ marginBottom: "10px", margin: "20px" }}
          >
            {" "}
            Assign Table
          </h4>
          <TableDisplay tables={tables} />
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
