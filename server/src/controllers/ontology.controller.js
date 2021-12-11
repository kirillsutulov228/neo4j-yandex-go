const ontologyService = require('./../services/ontology.service.js');
const express = require('express');

const ontologyController = {
  createDatabase: async (req, res, next) => {
    try {
      await ontologyService.createDatabase();
      res.sendStatus(200);
    } catch(err) {
      console.error(err);
      res.sendStatus(500);
    }
  },

  getAllNodes: async (req, res, next) => {
    const { names, labels } = req.query;
    try {
      return res.json(await ontologyService.findNodes({ names, labels }));
    } catch (err) {
      res.sendStatus(400);
    }
  },

  getChildNodes: async (req, res, next) => {
    const { relations, names, labels } = req.query;
    try {
      return res.send(await ontologyService.getChildNodes({ relations, names, labels }));
    } catch (err) {
      res.sendStatus(400);
    }
  },

  getScenario: async (req, res, next) => {
    const { name } = req.query;
    try {
      return res.send(await ontologyService.getScenario({ name }));
    } catch (err) {
      res.sendStatus(400);
    }
  },

  getScreenEvents: async (req, res, next) => {
    const { name } = req.query;
    try {
      return res.send(await ontologyService.getAllScreenEvents({ name }));
    } catch (err) {
      res.sendStatus(400);
    }
  },
  getScenarioNames: async (req, res, next) => {
    try {
      return res.send(ontologyService.getScenarioNames());
    } catch (err) {
      res.sendStatus(400);
    }
  },
}

module.exports = ontologyController;