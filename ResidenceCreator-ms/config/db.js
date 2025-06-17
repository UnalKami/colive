const mongoose = require('mongoose');
const {Sequelize} = require('sequelize');

const MONGO_URI =  process.env.MONGO_URI;
const POSTGRES_URI = process.env.POSTGRES_URI;

const sequelize = new Sequelize(POSTGRES_URI, {
  dialect: 'postgres',
  logging: false
});

const connectDB = async () => {
  try {
    // Conexión MongoDB
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB conectado');

    // Conexión PostgreSQL
    await sequelize.authenticate();
    console.log('PostgreSQL conectado');

  } catch (error) {
    console.error('Error al conecetar a las bases de datos:', error.message);
    process.exit(1);
  }
};

module.exports = {connectDB, sequelize};