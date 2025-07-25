require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { connectDB } = require('./config/db'); 
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const Reserva = require('./models/Reserva'); //modelo de Reserva

const visitantesRouter = require('./routes/visitantes');
const residencesRouter = require('./routes/residences');

const app = express();


connectDB();

const startApolloServer = async () => {
  const server = new ApolloServer({ typeDefs, resolvers,
    context: ({ req }) => ({
      Reserva, // exponer el modelo a los resolvers
      req
    })
  });
  await server.start();
  
  // Apollo Server debe aplicarse ANTES de body-parser
  server.applyMiddleware({ app, path: '/graphql' });
  
  // Ahora configurar body-parser para las rutas REST
  app.use(bodyParser.json());
  app.use('/api/visitantes', visitantesRouter);
  app.use('/api/residences', residencesRouter);

  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () =>
    console.log(`🚀 ResidenceCreator-ms corriendo en puerto ${PORT}\n🚀 GraphQL en /graphql\n🚀 REST API en /api`)
  );
};

startApolloServer();