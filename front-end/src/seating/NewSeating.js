import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { listTables, readReservation, updateTableStatus } from "../utils/api";
import AssignTableForm from "./AssignTableForm";

//component that makes seating assignment possible. updates seating status depending on the person being assigned. If he is seated status changes to seated and once he is done status is changed to finished and archieved. This data can later be pulled in case needed using phone number.
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

  //Loads reservation.
  useEffect(() => {
    const ac = new AbortController();
    async function read() {
      try {
        const response = await readReservation(
          Number(reservation_id),
          ac.signal
        );
        setReservation(response);
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
      try {
        const response = await listTables(ac.signal);
        setTables(response);
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

  return (
    <div className="table-responsive col-md-6">
      <h1>Seat Reservation</h1>
      <ErrorAlert error={errors} />
      {reservation && (
        <h4>
          {`# ${reservation.reservation_id} - ${reservation.first_name} ${
            reservation.last_name
          } on ${reservation.reservation_date.slice(0, 10
          )} at ${reservation.reservation_time.slice(0, 5)} for ${
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
