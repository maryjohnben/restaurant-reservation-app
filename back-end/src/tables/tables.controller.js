const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasRequiredProperties = require("../errors/hasRequiredProperties");
const { read } = require("../reservations/reservations.controller");
//lists tables
async function list(req, res, next) {
  const data = await service.list();
  res.status(200).json({ data });
}
const hasProperties = hasRequiredProperties("capacity", "table_name");

function isTableNameTwoCharacters(req, res, next) {
  const { table_name } = req.body.data;
  if (table_name.length < 2) {
    return next({
      status: 400,
      message: "Table name should be atleast two characters long.",
    });
  }
  next();
}

//checks if input in people is integer and greater than 0
function isInteger(req, res, next) {
  let { capacity } = req.body.data;
  capacity = Number(capacity);
  if (!Number.isInteger(capacity)) {
    return next({
      status: 400,
      message: "Input for capacity must be a valid number.",
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
  const table = await service.read(table_id);
  if (table) {
    res.locals.table = table;
    return next();
  }
  next({ status: 404, message: "Table is not found." });
}
async function readTable(req, res, next) {
  const data = await res.locals.table.table_id;
  res.status(200).json({ data });
}

async function updateTableStatus(req,res,next) {
const updatedTable = {
  ...req.body.data,
  occupied: true,
  table_id: res.locals.table.table_id,
}
console.log(updatedTable);
const data = await service.updateTableStatus(updatedTable);
res.json({data})
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [
    hasProperties,
    isTableNameTwoCharacters,
    isInteger,
    asyncErrorBoundary(create),
  ],
  read:[asyncErrorBoundary(tableExists), asyncErrorBoundary(readTable)],
  update:[asyncErrorBoundary(tableExists), asyncErrorBoundary(updateTableStatus)],
};
