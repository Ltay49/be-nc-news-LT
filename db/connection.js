const { Pool } = require('pg');
const ENV = process.env.NODE_ENV || 'dev';

require('dotenv').config({
  path: `${__dirname}/../.env.${ENV}`,
});
console.log(ENV)

if (!process.env.PGDATABASE) {
  throw new Error('PGDATABASE not set');
}
console.log(process.env.PGDATABASE)

module.exports = new Pool();
