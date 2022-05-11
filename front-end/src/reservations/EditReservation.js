import React from "react";
import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { readReservation, updateReservation } from "../utils/api";
import InvalidDateTime from "../layout/InvalidDateTime";
import { formatAsDate } from "../utils/date-time";

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

  //pulls data from params to be used later
  const { reservation_id } = useParams();
  const history = useHistory();
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({ ...initial });
  //pulls reservation data to be updated
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

  //tracks form when being updated
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

  //checks that data passed in to be valid and displays error message when encountered
  function validate(formData) {
    const errors = [];
    //only future reservations are allowed
    function isFutureDate({ reservation_date, reservation_time }) {
      const dt = new Date(`${reservation_date}T${reservation_time}`);
      if (dt < new Date()) {
        errors.push(
          new Error(
            "Date and/or time cannot be in the past. Please select another date/time."
          )
        );
      }
    }
    //restaurant closed
    function isTuesday({ reservation_date }) {
      const day = new Date(reservation_date).getUTCDay();
      if (day === 2) {
        errors.push(
          new Error("Restaurant is closed Tuesday. Please select another day.")
        );
      }
    }
    //closing and opening hours
    function isOpenHours({ reservation_time }) {
      const hour = parseInt(reservation_time.split(":")[0]);
      const mins = parseInt(reservation_time.split(":")[1]);

      if (hour < 10 || (hour === 10 && mins < 30)) {
        errors.push(
          new Error(
            "Restaurant will not open until 10:30 AM. Please reserve a later time."
          )
        );
      }

      if (hour > 21 || (hour === 21 && mins > 30)) {
        errors.push(
          new Error(
            "Restaurant closes at 10:30 PM and last time available for reservation is 9:30 PM. Please pick another time."
          )
        );
      }
    }

    isFutureDate(formData);
    isTuesday(formData);
    isOpenHours(formData);

    return errors;
  }

  const cancelHandler = () => {
    history.go(-1);
  };

  function submitHandler(event) {
    event.preventDefault();

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
        history.goBack();
        return response;
      } catch (error) {
        setError(error);
      }
    }
    update();
    return () => ac.abort();
  }
  //form that makes editing of reservation possibleXF
  return (
    <form onSubmit={submitHandler} className="w-75 p-3">
      <InvalidDateTime errors={error} />
      <div className="form-group">
        <h1>
          <span>Edit Reservation</span>
        </h1>
        <label htmlFor="first_name">First Name</label>
        <input
          className="form-control"
          type="text"
          id="first_name"
          name="first_name"
          required={true}
          onChange={handleChange}
          value={formData.first_name}
        ></input>
      </div>
      <label htmlFor="last_name">Last Name</label>
      <input
        className="form-control"
        type="text"
        id="last_name"
        name="last_name"
        required={true}
        onChange={handleChange}
        value={formData.last_name}
      ></input>
      <div className="form-group">
        <label htmlFor="mobile_number">Mobile Number</label>
        <input
          className="form-control"
          type="tel"
          id="mobile_number"
          name="mobile_number"
          required={true}
          placeholder="000-000-0000"
          onChange={handleChange}
          value={formData.mobile_number}
        ></input>
      </div>
      <div className="form-group">
        <label htmlFor="reservation_date">Date of Reservation</label>
        <input
          className="form-control"
          type="date"
          id="reservation_date"
          name="reservation_date"
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
          id="reservation_time"
          name="reservation_time"
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
          id="people"
          name="people"
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
