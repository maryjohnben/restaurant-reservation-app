import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { createReservation } from "../utils/api";
import InputForm from "./InputForm";

export default function NewReservations() {
    const initial = {
      first_name: '',
      last_name : '',
      mobile_number: '',
      reservation_date: '',
      people: '',
  }
  const [formData, setFormData] = useState({...initial})
  const [submitted, setSubmitted] = useState(false)
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
      async function create() {
        const abort = new AbortController();
        const response = await createReservation(formData, abort.signal)
        return response;
      }
      create();
    }
  }, [submitted, formData])

  return (
    <>
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