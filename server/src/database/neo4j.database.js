const neo4j = require('neo4j-driver');

let driver = null;

const {
  DB_URI,
  DB_USERNAME,
  DB_PASSWORD
} = process.env;

module.exports = {
  async connectToNeo4j() {
    driver = neo4j.driver(DB_URI, neo4j.auth.basic(DB_USERNAME, DB_PASSWORD));
    await driver.verifyConnectivity();
    console.log('Neo4j connection established');
  },

  /**
   * @returns {neo4j.Session}
   */
  getNeo4jSession() {
    if (!driver) {
      throw new Error('Attempt to get session without connection');
    }
    return driver.session();
  }
}
