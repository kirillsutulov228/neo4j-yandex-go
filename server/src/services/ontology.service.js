const ontologyCreateConfig = require('../configs/ontology.config.json');
const { getNeo4jSession } = require('../database/neo4j.database.js');

function formatNeo4jResponse(res) {
  const result = [];
  for (const record of res.records) {
    for (let i = 0; i < record._fields.length; ++i) {
      const jsonRecord = {};

      if (record._fields[i].properties.params) {
        record._fields[i].properties.params = JSON.parse(record._fields[i].properties.params);
      }

      jsonRecord.properties = record._fields[i].properties;
      jsonRecord.labels = record._fields[i].labels;

      result.push(jsonRecord);
    }
  }
  return result;
}

const ontologyService = {
  async createDatabase() {
    const session = getNeo4jSession();
    const transaction = session.beginTransaction();

    try {
      await transaction.run('MATCH (n) DETACH DELETE n');
      for (const screen of ontologyCreateConfig.screens) {
        await transaction.run(`CREATE (n: Screen $props)`, {
          props: {
            name: screen.name,
            description: screen.description
          }
        });
        for (const event of screen.events) {
          await transaction.run(
            `
              CREATE (n: Event $props) WITH n AS n
              MATCH (s: Screen) WHERE s.name = '${screen.name}'
              CREATE (s)-[r: ${event.rel}]->(n)
            `,
            {
              props: {
                name: event.name,
                description: event.description,
                params: JSON.stringify(event.params)
              }
            }
          );
        }
      }

      for (const [className, elements] of Object.entries(ontologyCreateConfig.screenElements)) {
        for (const element of elements) {
          await transaction.run(
            `
          CREATE (n: Element:${className} $props) WITH n AS n
          MATCH (s: Screen) WHERE s.name = '${element.parent}'
          CREATE (s)-[r: hasElement]->(n)
        `,
            {
              props: {
                name: element.name,
                description: element.description
              }
            }
          );

          for (const event of element.events) {
            await transaction.run(
              `
              CREATE (n: Event $props) WITH n AS n
              MATCH (s: Element:${className}) WHERE s.name = '${element.name}'
              CREATE (s)-[r: ${event.rel}]->(n)
            `,
              {
                props: {
                  name: event.name,
                  description: event.description,
                  params: JSON.stringify(event.params)
                }
              }
            );
          }
        }
      }
      for (const [scenarioName, steps] of Object.entries(ontologyCreateConfig.scenarios)) {
        for (let i = 0; i < steps.length - 1; ++i) {
          const query = `
            MATCH (s1:Screen {name: "${steps[i]}"})
            MATCH (s2:Screen {name: "${steps[i + 1]}"}) 
            CREATE (s1)-[r:ScenarioTransition {name: "${scenarioName}", step: ${i + 1} }]->(s2)\n
          `;
          await transaction.run(query);
        }
      }
      await transaction.commit();
    } catch (err) {
      throw new Error('Database error\n' + err.message);
    } finally {
      await session.close();
    }
  },

  async findNodes(options) {
    const { names, labels } = options;

    let query = 'MATCH (n)';

    const labelsArr = labels && labels.split(',');
    const namesArr = names && names.split(',');

    if (names && labels) {
      query = `MATCH (n) WHERE (${namesArr.map((s) => `n.name = '${s}'`).join(' OR ')}) AND (${labelsArr
        .map((s) => `n:${s}`)
        .join(' OR ')})`;
    } else if (names) {
      query = `MATCH (n) WHERE ${namesArr.map((s) => `n.name = '${s}'`).join(' OR ')}`;
    } else if (labels) {
      query = `MATCH (n) WHERE ${labelsArr.map((s) => `n:${s}`).join(' OR ')}`;
    }
    query += ' RETURN n';

    const session = getNeo4jSession();
    try {
      return formatNeo4jResponse(await session.run(query));
    } catch (err) {
      throw new Error(err.message);
    } finally {
      await session.close();
    }
  },

  async getAllScreenEvents(options) {
    let { name } = options;

    if (!name) {
      return await this.findNodes({ labels: 'Event' });
    }

    const session = getNeo4jSession();

    try {
      let check = `
        MATCH (screen:Screen)-[:hasElement]->(elem:Element)
        WHERE screen.name='${name}'
        return elem;
      `;

      const result = await session.run(check);

      let query = null;

      if (result.records.length > 0) {
        query = `
          MATCH (screen:Screen)-[:hasEvent]->(event1:Event)
          MATCH (screen:Screen)-[:hasElement]->(elem:Element)-[:hasEvent]->(event2: Event)
          WHERE screen.name='${name}'
          UNWIND [event1, event2] as list
          RETURN DISTINCT list
        `;
      } else {
        query = `
          MATCH (screen:Screen)-[:hasEvent]->(event1:Event)
          WHERE screen.name='${name}'
          RETURN DISTINCT event1
        `;
      }
      return formatNeo4jResponse(await session.run(query));
    } catch (err) {
      throw new Error(err.message);
    } finally {
      await session.close();
    }
  },

  async getScenario(options) {
    const name = options.name;
    if (!name || !(name in ontologyCreateConfig.scenarios)) {
      return [];
    }
    let query = '';
    for (let i = 0; i < ontologyCreateConfig.scenarios[name].length; ++i) {
      query += `MATCH (a${i}:Screen {name: "${ontologyCreateConfig.scenarios[name][i]}"})\n`;
    }
    query += 'RETURN ';
    query += ontologyCreateConfig.scenarios[name].map((_v, i) => `a${i}`).join(', ');
    const session = getNeo4jSession();
    try {
      return formatNeo4jResponse(await session.run(query));
    } catch (err) {
      throw new Error(err.message);
    } finally {
      await session.close();
    }
  },

  async getChildNodes(options) {
    let { names, labels, relations = '' } = options;
    if (!names && !labels && !relations) {
      return await this.findNodes({});
    }
    if (relations) {
      relations = `:${relations.split(',').join('|')}`;
    }
    let query = `MATCH (p)-[${relations}*1]->(c)`;
    const conditions = [];
    if (names) {
      conditions.push(
        names
          .split(',')
          .map((v) => `p.name = '${v}'`)
          .join(' OR ')
      );
    }
    if (labels) {
      conditions.push(
        labels
          .split(',')
          .map((v) => `p:${v}`)
          .join(' OR ')
      );
    }
    if (conditions.length) {
      query += ` WHERE ${conditions.map((v) => `(${v})`).join(' AND ')}`;
    }
    query += ' RETURN c';

    const session = getNeo4jSession();
    try {
      return formatNeo4jResponse(await session.run(query));
    } catch (err) {
      throw new Error(err.message);
    } finally {
      await session.close();
    }
  },

  getScenarioNames() {
    return Object.keys(ontologyCreateConfig.scenarios);
  }
};

module.exports = ontologyService;
