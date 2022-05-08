const tables = require('./01-tablesData.json')
exports.seed = async function (knex) {
  await knex.raw("TRUNCATE TABLE tables RESTART IDENTITY CASCADE")
  await knex('tables').insert(tables)
};
