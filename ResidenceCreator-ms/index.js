require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const routes = require('./routes/residenceRoutes');

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log(`Solicitud recibida: ${req.method} ${req.url}`);
  next();
});

// Conectar a MongoDB
connectDB();

// Prefijo API Gateway: GraphQL o REST según arquitectura
// Aquí implementamos REST endpoints
app.use('/api', routes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 ResidenceCreator-ms corriendo en puerto ${PORT}`));
