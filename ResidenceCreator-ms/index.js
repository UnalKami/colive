require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { connectDB } = require('./config/db'); 
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const Reserva = require('./models/Reserva'); //modelo de Reserva

const visitantesRouter = require('./routes/visitantes');

const app = express();
// app.use(bodyParser.json());

app.use('/api/visitantes', visitantesRouter);


connectDB();

const startApolloServer = async () => {
  const server = new ApolloServer({ typeDefs, resolvers,
    context: ({ req }) => ({
      Reserva, // exponer el modelo a los resolvers
      req
    })
  });
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });


  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () =>
    console.log(`🚀 ResidenceCreator-ms corriendo en puerto ${PORT}\n🚀 GraphQL en /graphql`)
  );
};

startApolloServer();