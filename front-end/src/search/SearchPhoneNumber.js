import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationTable from "../dashboard/ReservationTable";
import { listReservations } from "../utils/api";
import SearchForm from "./SearchForm";

/*
SearchByPhone contains logic for how to handle search submission.
All reservations that match the search query are displayed in a table
Otherwise 'No reservations found' is displayed.
*/
export default function SearchPhoneNumber() {
  const initial = {
    mobile_number: ""
  }
  
  //contains phone number
  const [formData, setFormData] = useState({...initial});
  const [reservations, setReservations] = useState([]);
  const [errors, setErrors] = useState(null);
  const [submitted, setSubmitted] = useState(false)


  const handleSubmission = (event) => {
    event.preventDefault();
    setSubmitted(true)
    const ac = new AbortController();
    const mobile_number = formData.mobile_number;
    setErrors(null)
    listReservations({ mobile_number }, ac.signal)
      .then(setReservations)
      .catch(setErrors);
    return () => ac.abort();
  };
console.log('lll', reservations)

  return (
    <>
      <h1>
        Search Reservations
      </h1>
      <ErrorAlert error={errors} />
      <SearchForm
        onSubmit={handleSubmission}
        formData={formData}
        setFormData={setFormData}
      />
      {submitted &&
      <>
      {reservations.length >= 1 ? (
        <div>
          <ReservationTable
            reservations={reservations}
            />
        </div>
      ) : (
        <h3>No Reservations Found</h3>
        )}
        </>}
    </>
  );
}