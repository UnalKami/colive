// filepath: /app/db.js
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('db2', 'postgres2', 'cincopatodos', {
  host: 'cl-guest-dbdr',
  dialect: 'postgres', // o 'postgres', 'sqlite', etc.
  port: 5433
});

module.exports = sequelize;