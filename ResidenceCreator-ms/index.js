require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const app = express();
// app.use(bodyParser.json());

connectDB();

const startApolloServer = async () => {
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });


  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () =>
    console.log(`🚀 ResidenceCreator-ms corriendo en puerto ${PORT}\n🚀 GraphQL en /graphql`)
  );
};

startApolloServer();