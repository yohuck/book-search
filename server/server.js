const express = require('express');
const { ApolloServer } = require('apollo-server-express')
const path = require('path');
require('dotenv').config()

const { typeDefs, resolvers} = require('./schemas')
const db = require('./config/connection');

const routes = require('./routes');
const { authMiddleware } = require('./utils/auth');

const app = express();
const PORT = process.env.PORT || 3001;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
})

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// if we're in production, serve client/build as static assets
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../client/build')));
// }

// app.use('/', express.static(path.join(__dirname, '../client/public')));



// app.use(routes);

const startGraphQLServer = async (typeDefs, resolvers) => {
  await server.start()
 server.applyMiddleware({ app })
}

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/public/index.html'));
});


db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`🌍 Now listening on localhost:${PORT}`)
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`)
  });
});

startGraphQLServer(typeDefs, resolvers)
