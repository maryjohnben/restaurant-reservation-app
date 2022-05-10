import React from "react"
import {useState, useEffect} from "react"
import { useHistory, useParams } from "react-router-dom";
import { readReservation, updateReservation} from "../utils/api";
import InvalidDateTime from '../layout/InvalidDateTime'
import { formatAsDate } from "../utils/date-time";

/*
EditReservation contains logic for how to handle submitting an update reservation.
Displays any errors that come from API.
Upon initial render, form is populated with pre-existing information from reservation.
*/
export default function EditReservation() {
  const initial = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
  };
  
  const { reservation_id } = useParams();
  const history = useHistory();
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({...initial});
  useEffect(() => {
    setError(null);
    const ac = new AbortController()
    async function read() {
    try {
   let response =  await readReservation(reservation_id, ac.signal)
      setFormData({...response,
      reservation_date: formatAsDate(response.reservation_date)})
      return response
    } catch(error) {
      setError(error)
    }
  }
  read()
  return()=> ac.AbortController
  }, [reservation_id]);

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

  function validate(formData){
    const errors = []

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

    function isOpenHours({ reservation_time }){
      const hour = parseInt(reservation_time.split(":")[0]);
      const mins = parseInt(reservation_time.split(":")[1]);

      if (hour <= 10 && mins <= 30){
          errors.push(new Error("Restaurant is only open after 10:30 am"));
      }

      if (hour >= 22){
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
function submitHandler(event){
  event.preventDefault();
  event.stopPropagation();

  const reservationErrors = validate(formData);

  if (reservationErrors.length) {
    return setError(reservationErrors);
  }
 const ac = new AbortController()
 async function update() {
   try {
  let response = await updateReservation(formData, reservation_id, ac.signal)
  history.goBack()
  return response
   } catch(error) {
    setError(error)
   }
  }
  update()
  return()=> ac.abort()
}

return (
  <form onSubmit={submitHandler} className="w-75 p-3">
      <InvalidDateTime errors={error} />
      <div className="form-group">
        <h1>
          <span>Edit Table</span>
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
          id="reservation_date"
          name="reservation_date"
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
          id="reservation_time"
          name="reservation_time"
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
