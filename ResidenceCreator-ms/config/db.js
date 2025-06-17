const mongoose = require('mongoose');
const {Sequelize} = require('sequelize');

const MONGO_URI =  process.env.MONGO_URI;
const POSTGRES_URI = process.env.POSTGRES_URI;

const sequelize = new Sequelize(POSTGRES_URI, {
  dialect: 'postgres',
  logging: false
});

const connectDB = async () => {
    // Conexión MongoDB
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB conectado');

    // Conexión PostgreSQL
    await sequelize.authenticate();
    console.log('PostgreSQL conectado');


};

module.exports = {connectDB, sequelize};