const ontologyController = require('./../controllers/ontology.controller.js');
const ontologyRouter = require('express').Router();

ontologyRouter.post('/ontology', ontologyController.createDatabase);
ontologyRouter.get('/ontology', ontologyController.getAllNodes);
ontologyRouter.get('/ontology/child', ontologyController.getChildNodes);
ontologyRouter.get('/ontology/screen_events', ontologyController.getScreenEvents);
ontologyRouter.get('/ontology/scenarios', ontologyController.getScenario);
ontologyRouter.get('/ontology/scenarios/names', ontologyController.getScenarioNames);

module.exports = ontologyRouter;
