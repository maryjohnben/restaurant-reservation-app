import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { listTables, readReservation, updateTableStatus } from "../utils/api";
import AssignTableForm from "./AssignTableForm";

export default function NewSeating() {
  const initial = {
    table_id: null,
  };

  const [tables, setTables] = useState([]);
  const [reservation, setReservation] = useState(null);
  const [formData, setFormData] = useState({ ...initial });
  const [errors, setErrors] = useState(null);

  const history = useHistory();
  const { reservation_id } = useParams();
  console.log(reservation_id);


  //Loads reservation.
  useEffect(() => {
    const ac = new AbortController();
    async function read() {
      //   setErrors(false)
      try {
        const response = await readReservation(reservation_id, ac.signal);
        setReservation(response);
        console.log(response);
        return response;
      } catch (error) {
        setErrors(error);
      }
    }
    read();
    return () => ac.abort();
  }, [reservation_id]);

  //table pulled
  useEffect(() => {
    const ac = new AbortController();
    async function list() {
      //   setErrors(false)
      try {
        const response = await listTables(ac.signal);
        setTables(response);
        // console.log(response);
        return response;
      } catch (error) {
        setErrors(error);
      }
    }
    list();
    return () => ac.abort();
  }, []);

  const cancelHandler = () => {
    history.goBack();
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const ac = new AbortController();
    updateTableStatus(formData.table_id, reservation.reservation_id, ac.signal)
      .then(() => history.push("/dashboard"))
      .catch(setErrors);
    return () => ac.abort();
  };

//   useEffect(() => {
//     if (submitted) {
//         const ac = new AbortController();
//         async function updateTable() {
//             try {
//                 const response = await updateTableStatus(
//                     formData.table_id,
//                     reservation_id,
//                     ac.signal
//                     );
//                     setSubmitted(false)
//           console.log('hello', response)
//           history.push("/dashboard");
//           return response;
//         } catch (error) {
//           setErrors(error);
//         }
//       }
//       updateTable();
//       return () => ac.abort();
//     }
//   }, [formData.table_id, reservation_id, history, submitted]);

  return (
    <div className="table-responsive col-md-6">
      <h1>Seat Reservation</h1>
      <ErrorAlert error={errors} />
      {reservation && (
        <h4>
          {`# ${reservation.reservation_id} - ${reservation.first_name} ${
            reservation.last_name
          } on ${reservation.reservation_date.slice(0, 10)} at ${reservation.reservation_time.slice(0, 5)} for ${
            reservation.people
          }`}
        </h4>
      )}
      {tables.length && (
        <AssignTableForm
          setFormData={setFormData}
          cancelHandler={cancelHandler}
          submitHandler={submitHandler}
          tables={tables}
        />
      )}
    </div>
  );
}
