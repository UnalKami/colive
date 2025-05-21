const mongoose = require('mongoose');

const MONGO_URI =  'mongodb://root:cincopatodos@mongo_db:27017/residence_db?authSource=admin';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB conectado');
  } catch (error) {
    console.log(MONGO_URI);
    console.error('Error al conectar a MongoDB:', error.message);
    process.exit(1);
  }
};
module.exports = connectDB;