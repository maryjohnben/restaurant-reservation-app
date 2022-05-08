import React from "react";

export default function InputForm({
        formData,
        setFormData,
        submitHandler,
        cancelHandler,
        title,
    })
     {
  const handleChange = (event) => {
      const value = event.target.value;
      setFormData({...formData, [event.target.name]: value})
  }

  return (
    <form onSubmit={submitHandler} className="w-75 p-3">
    <div className="form-group">
    <h1>
          <span>{title}</span>
          
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
        name='last_name'
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
        placeholder='000-000-0000'
        pattern="([0-9]{3}-)?[0-9]{3}-[0-9]{4}"
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
        pattern="\d{4}-\d{2}-\d{2}"
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
        pattern="[0-9]{2}:[0-9]{2}"
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
        onChange={handleChange}
        value={formData.people}
      ></input>
      </div>
      <button onClick={cancelHandler} type="cancel" className="btn btn-secondary">
        Cancel
      </button>
      <button
        type='submit'
        className="btn btn-primary"
        style={{ margin: "3px" }}
      >
        Submit
      </button>
    </form>
  );
}
