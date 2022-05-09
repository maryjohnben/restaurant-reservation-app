import React, { useState } from "react";
import { useHistory } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationTable from "../dashboard/ReservationTable";
import { listReservations, reservationStatusCancelled } from "../utils/api";
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
  const [reservations, setReservations] = useState(null);
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

  const history = useHistory()
  const handleCancel = async (reservation_id) => {
      const ac = new AbortController();
      const  mobile_number  = formData.mobile_number;
        const result = window.confirm(
            "Do you want to cancel this reservation? This cannot be undone."
        )
        if (result) {
          // history.go();
        reservationStatusCancelled(reservation_id)
        .then(() => listReservations({ mobile_number }, ac.signal))
        .then(setReservations)
        .then(()=> setSubmitted(true))
        // window.location.reload(false)
        .catch(setErrors);
        }
        // history.go()
        return () => ac.abort()
      };

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
      {reservations ? (
        <div>
          <ReservationTable
            reservations={reservations}
            handleCancel={handleCancel}
            />
        </div>
      ) : (
        <h3>No Reservations Found</h3>
        )}
        </>}
    </>
  );
}