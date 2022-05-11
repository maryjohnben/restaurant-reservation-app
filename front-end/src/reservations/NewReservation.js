import React, { useState } from "react";
import { useHistory } from "react-router";
import { createReservation } from "../utils/api";
import isPastDateAndClosed from "../utils/validateInPastAndClosed";
import isTuesday from "../utils/validateTuesday";
import InputForm from "./InputForm";

//creates new reservation form
export default function NewReservation() {
  const initial = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
  };
  const history = useHistory();
//stores data entered
  const [formData, setFormData] = useState({ ...initial });
  //catches the error and displays as needed
  const [error, setError] = useState([]);
//validates that data passed is meets the criteria
  function validate(formData) {
    let validationErrors = [];
    if (isTuesday(formData.reservation_date))
      validationErrors.push(isTuesday(formData.reservation_date));
    if (
      isPastDateAndClosed(formData.reservation_date, formData.reservation_time)
    )
      validationErrors.push(
        isPastDateAndClosed(
          formData.reservation_date,
          formData.reservation_time
        )
      );
    return validationErrors;
  }
//handles submission and creates form or throws errors
  function submitHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    const reservationErrors = validate(formData);
    if (reservationErrors.length) {
      return setError(reservationErrors);
    }
    const ac = new AbortController();
    createReservation(formData, ac.signal)
      .then(() => history.push(`/dashboard?date=${formData.reservation_date}`))
      .catch(setError);
    return () => ac.abort();
  }

  const cancelHandler = () => {
    history.goBack();
  };

  return (
    <main>
      <h1> Create Reservation </h1>
      <InputForm
        formData={formData}
        setFormData={setFormData}
        submitHandler={submitHandler}
        cancelHandler={cancelHandler}
        error={error}
      />
    </main>
  );
}
