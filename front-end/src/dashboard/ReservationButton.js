import React from "react";
import { Link } from "react-router-dom";
import { next, previous, today } from "../utils/date-time";

export default function ReservationDisplay({date}) {
    return (
        <nav aria-label="...">
  <ul className="pagination">
    <li className="page-item">
      <Link className="page-link" to={`/dashboard?date=${previous(date)}`} tabIndex="-1">Previous</Link>
    </li>
    <li className="page-item">
        <Link className="page-link" to={`/dashboard?date=${today()}`}>Today</Link></li>
    <li className="page-item">
      <Link className="page-link" to={`/dashboard?date=${next(date)}`}>Next</Link>
    </li>
  </ul>
</nav>
    )
}