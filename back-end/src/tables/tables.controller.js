const service = require('./tables.service');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary')
const hasRequiredProperties = require('../errors/hasRequiredProperties')
//lists tables
async function list(req,res,next) {
    const data = await service.list()
    res.status(200).json({data})
}

const hasProperties = hasRequiredProperties('table_name', 'capacity')

function isTableNameTwoCharacters(req,res,next) {
    const {table_name} = req.body.data
    if(table_name.length < 2) {
       return next({
            status: 400,
            message: 'Table name should be atleast two characters long.'
        })
    }
    next()
}
//checks if input in people is integer and greater than 0
function isInteger(req, res, next) {
    let { capactity } = req.body.data;
    capactity = Number(capactity);
    if (!Number.isInteger(capactity)) {
      next({
        status: 400,
        message: "Input for capacity must be a valid number.",
      });
    }
      next();
  }

async function create(req,res,next) {
    const data = await service.create(req.data.body)
    res.status(201).json({data})
}

module.exports={
    list: [asyncErrorBoundary(list)],
    create:[isInteger, isTableNameTwoCharacters, hasProperties, asyncErrorBoundary(create)],
}