require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const conjuntoRoutes = require('./routes/conjuntoRoutes');
const residenceRoutes = require('./routes/residenceRoutes');

const app = express();

app.use(bodyParser.json());

connectDB();

app.use('/api', conjuntoRoutes);
app.use('/api', residenceRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 ResidenceCreator-ms corriendo en puerto ${PORT}`));
