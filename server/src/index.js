require('./configs/dotenv.config.js');

const { connectToNeo4j } = require('./database/neo4j.database.js');
const ontologyRouter = require('./routes/ontology.router.js');
const cors = require('cors');
const corsOptions = require('./configs/cors.config.js');
const express = require('express');

const app = express();

app.use(
  cors(corsOptions),
  express.json(),
  express.urlencoded({ extended: true })
);

app.use(ontologyRouter);

start();

function start() {
  const { PORT, HOST } = process.env;

  connectToNeo4j().then(() => {
      app.listen(+PORT, HOST, () => {
        console.log('Server listening on port', +PORT);
      });
    }).catch(err => {
    console.error('Neo4j connection failed');
    console.error(err);
    process.exit(-1);
  });
}
