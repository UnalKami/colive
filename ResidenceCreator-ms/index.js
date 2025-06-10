require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const conjuntoRoutes = require('./routes/conjuntoRoutes');
const residenceRoutes = require('./routes/residenceRoutes');

const mongoose = require("mongoose")

const app = express();

connectDB();

async function startServer() {
  const server = new ApolloServer({typeDefs, resolvers});
  await server.start();
  server.applyMiddleware({app});

  app.listen({port:3001}, () =>
    console.log(`Conexión exitosa a http://localhost:3001${server.graphqlPath}`)
  );
}

startServer();