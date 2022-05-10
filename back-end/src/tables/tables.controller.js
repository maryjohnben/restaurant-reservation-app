const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasRequiredProperties = require("../errors/hasRequiredProperties");
const reservationsService = require("../reservations/reservations.service");

//lists tables
async function list(req, res, next) {
  const data = await service.list();
  res.status(200).json({ data });
}
const hasProperties = hasRequiredProperties("capacity", "table_name");
const hasPropertiesForUpdate = hasRequiredProperties('reservation_id');

function isTableNameTwoCharacters(req, res, next) {
  const { table_name } = req.body.data;
  if (table_name.length < 2) {
    return next({
      status: 400,
      message: `table_name should be atleast two characters long.`,
    });
  }
  next();
}

//checks if input in people is integer and greater than 0
function isInteger(req, res, next) {
  let { capacity } = req.body.data;
  // if(capacity.isS)
  
  // console.log(capacity)
  capacity = Number(capacity);
  if (!Number.isInteger(capacity)) {
   return next({
      status: 400,
      message: "Input for 'capacity' must be a valid number.",
    });
  }
  next();
}

async function create(req, res, next) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

async function tableExists(req, res, next) {
  const table_id = Number(req.params.table_id);
  console.log(table_id);
  const table = await service.readTable(table_id);
  if (table) {
    res.locals.table = table;
    return next();
  }
  next({ status: 404, message: `Table ${table_id} is not found.`});
}

// async function readTable(req, res, next) {
//   const data = await readTable(res.locals.table.table_id);
//   res.status(200).json({ data });
// }

async function updateTableStatus(req, res, next) {
  const updatedTable = {
    ...req.body.data,
    occupied: true,
    table_id: res.locals.table.table_id,
  };
  console.log(updatedTable);
  const data = await service.updateTableStatus(updatedTable);
  res.json({ data });
}

async function tableAssignValidation(req, res, next) {
  const { reservation_id } = req.body.data;
  if (!reservation_id) {
    return next({
      status: 400,
      message: `${reservation_id} reservation_id missing`,
    });
  }
  const reservation = await reservationsService.readReservation(
    Number(reservation_id)
  );
  console.log(reservation);
  if (!reservation) {
    return next({
      status: 404,
      message: `Reservation id ${reservation_id} not found.`,
    });
  }
  if (Number(res.locals.table.capacity) < Number(reservation.people)) {
    return next({
      status: 400,
      message:
        "Number of people to be seated cannot be more than the capacity of the table.",
    });
  }
  if (res.locals.table.occupied === true) {
    return next({
      status: 400,
      message: "Table is already occupied please choose another table.",
    });
  }
  next();
}
function tableAvailable(req,res,next) {
  if (res.locals.table.occupied === false) {
    return next({
      status: 400,
      message: "Table is not occupied.",
    });
  }
  if (!res.locals.table.reservation_id) {
    next({
      status: 400,
      message: "Table is not occupied.",
    });
}
next()
}

async function deleteOccupancy(req,res,next) {
    const table_id = res.locals.table.table_id
    const data = await service.deleteOccupancy(table_id)
    console.log(data)
    res.status(200).json({data})
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [
    hasProperties,
    isTableNameTwoCharacters,
    isInteger,
    asyncErrorBoundary(create),
  ],
  // readTable: [asyncErrorBoundary(tableExists), asyncErrorBoundary(readTable)],
  update: [
    asyncErrorBoundary(tableExists),
    hasPropertiesForUpdate,
    asyncErrorBoundary(tableAssignValidation),
    asyncErrorBoundary(updateTableStatus),
  ],
  destroy:[asyncErrorBoundary(tableExists),
    tableAvailable,
  asyncErrorBoundary(deleteOccupancy)]
};
