import React, { useState } from "react";
import { useHistory } from "react-router";
import { createReservation } from "../utils/api";
import InvalidDateTime from "../layout/InvalidDateTime";

export default function InputForm() {
  const initial = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
  };
  const history = useHistory();

  const [formData, setFormData] = useState({ ...initial });

  function handleChange(event) {
    const value = event.target.value;
    setFormData((prevState) => ({
      ...prevState,
      [event.target.name]: value,
    }));
  }

  function handleChangeNum(event) {
    const value = event.target.value;
    setFormData((prevState) => ({
      ...prevState,
      [event.target.name]: Number(value),
    }));
  }

  const [error, setError] = useState(null);

  function validate(formData) {
    let errors = [];
    function isFutureDate({ reservation_date, reservation_time }) {
      const dt = new Date(`${reservation_date}T${reservation_time}`);
      if (dt < new Date()) {
        errors.push(new Error("Reservation must be set in the future"));
      }
    }

    function isTuesday({ reservation_date }) {
      const day = new Date(reservation_date).getUTCDay();
      if (day === 2) {
        errors.push(new Error("No reservations available on Tuesday."));
      }
    }

    function isOpenHours({ reservation_time }) {
      const hour = parseInt(reservation_time.split(":")[0]);
      const mins = parseInt(reservation_time.split(":")[1]);

      if (hour <= 10 && mins <= 30) {
        errors.push(new Error("Restaurant is only open after 10:30 am"));
      }

      if (hour >= 22) {
        errors.push(new Error("Restaurant is closed after 10:00 pm"));
      }
    }

    isFutureDate(formData);
    isTuesday(formData);
    isOpenHours(formData);

    return errors;
  }
  const cancelHandler = () => {
    history.goBack();
  };
  function submitHandler(event) {
    event.preventDefault();
    event.stopPropagation();

    const reservationErrors = validate(formData);

    console.log(reservationErrors);
    if (reservationErrors.length) {
      return setError(reservationErrors);
    }
const ac = new AbortController()
    createReservation(formData, ac.signal)
      .then(() => history.push(`/dashboard?date=${formData.reservation_date}`))
      .catch(setError);
    return () => ac.abort();
  }

  return (
    <form onSubmit={submitHandler} className="w-75 p-3">
        <InvalidDateTime errors={error} />
        <div className="form-group">
          <h1>
            <span>Create Table</span>
          </h1>
          <label htmlFor="first_name">First Name</label>
          <input
            className="form-control"
            type="text"
            name="first_name"
            id="first_name"
            required={true}
            onChange={handleChange}
            value={formData.first_name}
          ></input>
        </div>
        <label htmlFor="last_name">Last Name</label>
        <input
          className="form-control"
          type="text"
          name="last_name"
          id="last_name"
          required={true}
          onChange={handleChange}
          value={formData.last_name}
        ></input>
        <div className="form-group">
          <label htmlFor="mobile_number">Mobile Number</label>
          <input
            className="form-control"
            type="tel"
            name="mobile_number"
            id="mobile_number"
            required={true}
            placeholder="000-000-0000"
            // pattern="([0-9]{3}-)?[0-9]{3}-[0-9]{4}"
            onChange={handleChange}
            value={formData.mobile_number}
          ></input>
        </div>
        <div className="form-group">
          <label htmlFor="reservation_date">Date of Reservation</label>
          <input
            className="form-control"
            type="date"
            name="reservation_date"
            id="reservation_date"
            // pattern="\d{4}-\d{2}-\d{2}"
            required={true}
            onChange={handleChange}
            value={formData.reservation_date}
          ></input>
        </div>
        <div className="form-group">
          <label htmlFor="reservation_time">Time of Reservation</label>
          <input
            className="form-control"
            type="time"
            name="reservation_time"
            id="reservation_time"
            // pattern="[0-9]{2}:[0-9]{2}"
            required={true}
            onChange={handleChange}
            value={formData.reservation_time}
          ></input>
        </div>
        <div className="form-group">
          <label htmlFor="people">Number of guests</label>
          <input
            className="form-control"
            type="number"
            name="people"
            id="people"
            min={1}
            required={true}
            onChange={handleChangeNum}
            value={formData.people}
          ></input>
        </div>
        <button
          onClick={cancelHandler}
          type="cancel"
          className="btn btn-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          style={{ margin: "3px" }}
        >
          Submit
        </button>
      </form>
  );
}
