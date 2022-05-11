import React from "react";
import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { readReservation, updateReservation } from "../utils/api";
import { formatAsDate } from "../utils/date-time";
import isTuesday from "../utils/validateTuesday";
import isPastDateAndClosed from "../utils/validateInPastAndClosed";
import InputForm from "./InputForm";

//makes editing of reservation possible. Customers can update fields as needed. Prefills form to be filled out easily.
export default function EditReservation() {
  const initial = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
  };
  //sets data when typed in
  const [formData, setFormData] = useState({ ...initial });
  //catches the error and displays as needed
  const [error, setError] = useState([]);

  //pulls data from params to be used later
  const { reservation_id } = useParams();
  useEffect(() => {
    setError(null);
    const ac = new AbortController();
    async function read() {
      try {
        let response = await readReservation(reservation_id, ac.signal);
        setFormData({
          ...response,
          reservation_date: formatAsDate(response.reservation_date),
        });
        return response;
      } catch (error) {
        setError(error);
      }
    }
    read();
    return () => ac.AbortController;
  }, [reservation_id]);

  const history = useHistory();
  //validates and make sure data meets criteria
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
  //handles submission after editing
  function submitHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    const reservationErrors = validate(formData);
    if (reservationErrors.length) {
      return setError(reservationErrors);
    }
    const ac = new AbortController();
    async function update() {
      try {
        //updates reservation form
        let response = await updateReservation(
          formData,
          reservation_id,
          ac.signal
        );
        history.push(`/dashboard?date=${formData.reservation_date}`);
        return response;
      } catch (error) {
        setError(error);
      }
    }
    update();
    return () => ac.abort();
  }

  const cancelHandler = () => {
    history.push();
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
