const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasRequiredProperties = require("../errors/hasRequiredProperties");
/**
 * List handler for reservation resources
 */
//if data is received as query then finished and cancelled statuses are filtered out so that
//just booked and seated will be on display at all time
//but if mobile number is received as query then a list of all reservation including
//cancelled and finished will be returned
async function list(req, res) {
  if (req.query.date) {
    const { date } = req.query;
    const reservations = await service.list(date);
    const result = reservations.filter(
      (reservation) =>
        reservation.status !== "finished" && reservation.status !== "cancelled"
    );
    res.status(200).json({ data: result });
  }
  if (req.query.mobile_number) {
    const { mobile_number } = req.query;
    const reservations = await service.searchMobile(mobile_number);
    res.status(200).json({ data: reservations });
  }
}

//checks if these required properties are in the ine data body
const hasProperties = hasRequiredProperties(
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people"
);

//checks if any fields entered are invalid meaning already existing in the table
const VALID_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "people",
  "status",
  "reservation_time",
  "reservation_id",
  "created_at",
  "updated_at",
];

function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;

  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  ); //if any of the keys does not match valid properties array then that is filtered to invalidFields

  if (invalidFields.length) {
    //if there is anything invalid
    return next({
      //goes to error handler
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
  next();
}
//checks if input in people is integer and greater than 0
function isInteger(req, res, next) {
  let { people } = req.body.data;
  people = Number(people);
  if (people < 1 || !Number.isInteger(people)) {
    return next({
      status: 400,
      message:
        "Input for 'people' should be greater than zero and must be a valid number.",
    });
  }
  next();
}

//check if date is in valid format
function isDateFormatValid(req, res, next) {
  const { reservation_date } = req.body.data;
  const validFormat = /[0-9]{4}-[0-9]{2}-[0-9]{2}/;
  if (!validFormat.test(reservation_date)) {
    return next({
      status: 400,
      message: `reservation_date ${reservation_date} is not valid`,
    });
  } else {
    next();
  }
}
//make sure time format is valid
function isTimeFormatValid(req, res, next) {
  const { reservation_time } = req.body.data;
  const validFormat = /[0-2]{1}[0-9]{1}:[0-5]{1}[0-9]{1}/;
  if (!validFormat.test(reservation_time)) {
    return next({
      status: 400,
      message: `reservation_time ${reservation_time} is not valid`,
    });
  } else {
    next();
  }
}
//make sure that date and time is not in the past if it is then an error will the thrown
function isDatePast(req, res, next) {
  const { reservation_date, reservation_time } = req.body.data;
  let today = new Date();
  let day = new Date(`${reservation_date} ${reservation_time}`);
  if (today > day) {
    return next({
      status: 400,
      message: `Date for reservation must be in the future. Please select a future date.`,
    });
  }

  if (day.getHours() < 10 || (day.getHours() === 10 && day.getMinutes() < 30)) {
    return next({
      status: 400,
      message:
        "Restaurant will not open until 10:30 AM. Please reserve a later time.",
    });
  }
  if (day.getHours() > 21 || (day.getHours() === 21 && day.getMinutes() > 30)) {
    return next({
      status: 400,
      message:
        "Restaurant closes at 10:30 PM and last time available for reservation is 9:30 PM. Please pick another time.",
    });
  }
  next();
}
//restaurant is closed on tuesdays so if date is on tuesday then reservations will be rejected
function isTuesday(req, res, next) {
  const { reservation_date } = req.body.data;
  let day = new Date(reservation_date);
  if (day.getUTCDay() === 2) {
    return next({
      status: 400,
      message: "Restaurant is closed on Tuesday. Please select another day.",
    });
  }
  next();
}
//received data from request to create new reservations
async function create(req, res, next) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

//sets res.locals to validate that reservations exists before any further actions are proceeded
async function reservationExists(req, res, next) {
  const reservation = await service.readReservation(
    Number(req.params.reservation_id)
  );
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `${req.params.reservation_id} Reservation cannot be found.`,
  });
}
//id is passed to retrieve reservation data
async function read(req, res, next) {
  const data = await service.readReservation(
    Number(res.locals.reservation.reservation_id)
  );
  res.status(200).json({ data });
}

//checks the status of the update reservation
async function validateStatusUpdateRequest(req, res, next) {
  if (!req.body.data.status) {
    return next({ status: 400, message: "Body should contain status" });
  }

  if (
    req.body.data.status !== "booked" &&
    req.body.data.status !== "seated" &&
    req.body.data.status !== "finished" &&
    req.body.data.status !== "cancelled"
  ) {
    return next({
      status: 400,
      message: `'Status' cannot be '${req.body.data.status}'. It can only be 'booked', 'seated', 'finished', or 'cancelled'.`,
    });
  }
  //if status is finished then reservation cannot be edited
  if (res.locals.reservation.status === "finished") {
    return next({
      status: 400,
      message: `'finished' reservation cannot be changed`,
    });
  }
  next();
}
//make sure that status is booked because only this has options to edit and seat and cancel
function checkStatus(req, res, next) {
  let { status } = req.body.data;
  if (!status) {
    status = "booked";
  }
  if (status !== "booked") {
    next({
      status: 400,
      message: `Status '${status}' is invalid`,
    });
  } else {
    next();
  }
}
//if anything is other than checked then it cannot be updates
function checkBooked(req, res, next) {
  if (res.locals.reservation.status !== "booked") {
    next({
      status: 400,
      message: "Cannot update anything other than with status 'booked'.",
    });
  } else {
    next();
  }
}
//updates reservation status based on the passed in data
async function updateReservation(req, res, next) {
  const updatedStatus = {
    ...req.body.data,
    reservation_id: res.locals.reservation.reservation_id,
  };
  const data = await service.updateReservation(updatedStatus);
  res.status(200).json({ data });
}
//updates the reservation form passed in through req.body
async function update(req, res, next) {
  const updatedReservation = {
    ...req.body.data,
    reservation_id: res.locals.reservation.reservation_id,
  };
  const data = await service.update(updatedReservation);
  res.status(200).json({ data });
}
// async function update(req, res, next) {
//   const updatedReservation = {
//     ...req.body.data,
//     reservation_id: res.locals.reservation.reservation_id,
//   };
//   const data = await service.update(updatedReservation);
//   res.status(200).json({ data });
// }

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [
    hasOnlyValidProperties,
    hasProperties,
    isDateFormatValid,
    isTimeFormatValid,
    isInteger,
    isTuesday,
    isDatePast,
    checkStatus,
    asyncErrorBoundary(create),
  ],
  updateReservationStatus: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(validateStatusUpdateRequest),
    asyncErrorBoundary(updateReservation),
  ],
  update: [
    asyncErrorBoundary(reservationExists),
    hasOnlyValidProperties,
    hasProperties,
    isDateFormatValid,
    isTimeFormatValid,
    isInteger,
    isTuesday,
    isDatePast,
    checkBooked,
    asyncErrorBoundary(update),
  ],
  read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
};
