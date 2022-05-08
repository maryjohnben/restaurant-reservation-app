const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasRequiredProperties = require("../errors/hasRequiredProperties");
/**
 * List handler for reservation resources
 */
async function list(req, res) {
  if (req.query.date) {
    const { date } = req.query;
    const data = await service.list(date);
    res.status(200).json({ data });
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
  "reservation_time",
  "status",
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
  console.log(day.getHours());
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

async function create(req, res, next) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}


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
    asyncErrorBoundary(create),
  ],
};
