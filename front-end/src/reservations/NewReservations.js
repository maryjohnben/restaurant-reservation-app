// import React, { useEffect, useState } from "react";
// import { useHistory } from "react-router";
// import { createReservation } from "../utils/api";
// import ErrorAlert from "../layout/ErrorAlert";
// import InputForm from "./InputForm";
// import InvalidDateTime from "../layout/InvalidDateTime";
// import validateTuesday from "../utils/validateTuesday";
// import validateInPast from "../utils/validateInPastAndClosed";

// export default function NewReservations() {
  
//   const [dateErrors, setDateErrors] = useState(null);
//   //state for any errors that may occur from the API.
//   const [reservationsError, setReservationsError] = useState(null);
//   const history = useHistory();

//   const isTuesday = validateTuesday(formData.reservation_date);
//   const isPast = validateInPast(
//     formData.reservation_date,
//     formData.reservation_time
//   );

//   const submitHandler = (event) => {
//     event.preventDefault();
//     const ac = new AbortController();
//     setReservationsError(null);

//     //if any true value will be added in
//     if (isTuesday || isPast) {
//       setDateErrors([isTuesday ? isTuesday : null, isPast ? isPast : null]);
//       return;
//     }
//     setDateErrors(null);
//     createReservation(formData, ac.signal)
//       .then(() => history.push(`/dashboard?date=${formData.reservation_date}`))
//       .catch(setReservationsError);
//     return () => ac.abort();
//   };

//   return (
//     <div>
//       <div>
//         <ErrorAlert error={reservationsError} />
//         <InvalidDateTime errors={dateErrors} />
//       </div>
//       <div>
//         <InputForm
//           formData={formData}
//           setFormData={setFormData}
//           submitHandler={submitHandler}
//           cancelHandler={() => history.goBack()}
//           title="Create Reservation"
//         />
//       </div>
//     </div>
//   );
// }
