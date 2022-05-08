import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { createReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import InputForm from "./InputForm";

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
  
  //creating new reservation
  useEffect(()=>{
    if(submitted) {
      const ac = new AbortController();
      setReservationsError(null)
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
  }, [submitted, formData, history])

  return (
    <>
    <ErrorAlert error={reservationsError} />
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