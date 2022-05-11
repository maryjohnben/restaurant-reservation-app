import React from "react";
import InvalidDateTime from "../layout/InvalidDateTime";

//form used by both create and edit reservation
export default function InputForm({
  formData,
  setFormData,
  error,
  cancelHandler,
  submitHandler,
}) {
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

  return (
    <form onSubmit={submitHandler} className="w-75 p-3">
      <InvalidDateTime error={error} />
      <div className="form-group">
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
