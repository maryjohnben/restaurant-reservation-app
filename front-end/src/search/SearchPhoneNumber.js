import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationTable from "../dashboard/ReservationTable";
import { listReservations, reservationStatusCancelled } from "../utils/api";
import SearchForm from "./SearchForm";

//makes searching customers using mobile number possible. Pulls customers using phone number reagrdless of the status.
export default function SearchPhoneNumber() {
  const initial = {
    mobile_number: "",
  };

  //contains phone number
  const [formData, setFormData] = useState({ ...initial });
  const [reservations, setReservations] = useState([]);
  const [errors, setErrors] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmission = (event) => {
    setSubmitted(true);
    event.preventDefault();
    const ac = new AbortController();
    const mobile_number = formData.mobile_number;
    setErrors(null);
    listReservations({ mobile_number }, ac.signal)
      .then(setReservations)
      .catch(setErrors);
    return () => ac.abort();
  };

  const handleCancel = async (reservation_id) => {
    const ac = new AbortController();
    const mobile_number = formData.mobile_number;
    const result = window.confirm(
      "Do you want to cancel this reservation? This cannot be undone."
    );
    if (result) {
      await reservationStatusCancelled(reservation_id, ac.signal);
      const response = await listReservations({ mobile_number }, ac.signal);
      setReservations(response);
      return response;
    }
    return () => ac.abort();
  };

  //pulls data if number valid else no reservation found.
  return (
    <>
      <h1>Search Reservations</h1>
      <ErrorAlert error={errors} />
      <SearchForm
        onSubmit={handleSubmission}
        formData={formData}
        setFormData={setFormData}
      />
      {submitted && (
        <>
          {reservations.length >= 1 ? (
            <div>
              <ReservationTable
                reservations={reservations}
                handleCancel={handleCancel}
              />
            </div>
          ) : (
            <h3>No Reservations Found</h3>
          )}
        </>
      )}
    </>
  );
}
