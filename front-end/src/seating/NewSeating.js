import React, {useEffect, useState} from "react";
import { useHistory, useParams } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { listTables, readReservation, updateTableStatus } from "../utils/api";
import AssignTableForm from "./AssignTableForm";

export default function NewSeating() {
const initial = {
    table_id: null
}

    const [tables, setTables] = useState([]);
    const [reservation, setReservation] = useState({})
    const [formData, setFormData] = useState({...initial})
    const [errors, setErrors] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    
    const history = useHistory()
    const {reservation_id} = useParams()
    console.log(reservation_id)
    const cancelHandler = () => {
        history.goBack()
    }

    // useEffect(()=>{
    //     const ac = new AbortController();
    //     async function read() {
    //     //   setErrors(false)
    //       try {
    //         const response = await readReservation(reservation_id, ac.signal)
    //         setReservation(response);
    //         console.log(response);
    //         return response;
    //       } catch(error) {
    //         setErrors(error)
    //       } 
    //     }
    //     read();
    //     return () => ac.abort()
    // }, [reservation_id])
     //Loads reservation.
  useEffect(() => {
    const ac = new AbortController();
    readReservation(reservation_id, ac.signal)
      .then(setReservation)
      .catch(setErrors);
    return () => ac.abort();
  }, [reservation_id]);

   
//table pulled
    // useEffect(()=>{
    //     const ac = new AbortController();
    //     async function list() {
    //     //   setErrors(false)
    //       try {
    //         const response = await listTables(ac.signal)
    //         setTables(response);
    //         // console.log(response);
    //         return response;
    //       } catch(error) {
    //         setErrors(error)
    //       } 
    //     }
    //     list();
    //     return () => ac.abort()
    // }, [])
    useEffect(() => {
        const ac = new AbortController();
        listTables(ac.signal).then(setTables).catch(setErrors);
        return () => ac.abort();
      }, []);

    

    const submitHandler = (event) => {
        event.preventDefault()
        setSubmitted(true)
    }

    useEffect(()=> {
        if(submitted) {
        const ac = new AbortController();
            async function updateTable() {
            //   setErrors(false)
              try {
                const response = await updateTableStatus(formData.table_id, reservation_id, ac.signal)
                setTables(response);
                // console.log(response);
                history.push('/dashboard')
                return response;
              } catch(error) {
                setErrors(error)
              } 
            }
            updateTable();
            return () => ac.abort()
        }
        }, [formData.table_id, reservation_id, submitted, history])

    return(
       <div className="table-responsive col-md-6">
           <h1>Seat Reservation</h1>
           <ErrorAlert error={errors} />
            <h4>
               {`# ${reservation.reservation_id} - ${reservation.first_name} ${reservation.last_name} on ${reservation.reservation_date} at ${reservation.reservation_time} for ${reservation.people}`} 
            </h4>
            {(tables.length &&
            <AssignTableForm setFormData={setFormData} 
            cancelHandler={cancelHandler}
            submitHandler={submitHandler}
            tables={tables}/>)}
        </div>
    )


}