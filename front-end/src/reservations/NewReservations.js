import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { createReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import InputForm from "./InputForm";
import InvalidDateTime from "../layout/InvalidDateTime";
import validateTuesday from '../utils/validateTuesday'
import validateInPast from '../utils/validateInPastAndClosed'

export default function NewReservations() {
    const initial = {
      first_name: '',
      last_name : '',
      mobile_number: '',
      reservation_date: '',
      reservation_time: '',
      people: 0,
  }
  const [formData, setFormData] = useState({...initial})
  const [submitted, setSubmitted] = useState(false)
  const [timeError, setTimeError] = useState([])
  //state for any errors that may occur from the API.
  const [reservationsError, setReservationsError] = useState(null);
  const history = useHistory()
  
  const submitHandler = (event) => {
    event.preventDefault();
    setSubmitted(true);
  }
  const cancelHandler = () => {
    history.go(-1)
  }

  const isTuesday = validateTuesday(formData.reservation_date)
  const isPast = validateInPast(formData.reservation_date, formData.reservation_time)
  
console.log('is tuesday', isTuesday)
console.log('is past', isPast)

//creating new reservation
useEffect(()=>{
  if(submitted) {
    setTimeError([])
    setSubmitted(false)
    if(isTuesday) setTimeError(arr => [...arr, isTuesday])
    if(isPast) setTimeError(arr => [...arr, isPast])
    if(isTuesday || isPast) return;
    const ac = new AbortController();
    setReservationsError(null)
    // setTimeError(null);
    async function create() {
      try {
        const response = await createReservation(formData, ac.signal)
        history.push(`/dashboard?date=${formData.reservation_date}`)
        return response;
      } catch(error) {
        setReservationsError(error)
      } 
    }
    create();
    return () => ac.abort()
  }
}, [submitted, formData, history, isPast, isTuesday])

// console.log('timeerror',timeError)
// console.log('submit',submitted)
return (
  <>
    <ErrorAlert error={reservationsError} />
    <InvalidDateTime error={timeError} />
    <InputForm 
    formData={formData}
    setFormData={setFormData}
    submitHandler={submitHandler}
    cancelHandler={cancelHandler}
    title='Create Reservation'
    />
    </>
  )
}