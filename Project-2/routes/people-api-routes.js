const express = require("express");

const db = require("../models");

const router = express.Router();

router.get("/api/people", (req, res) => {
  db.Person.findAll().then((dbPeople) => {
    res.json(dbPeople);
  });
});

router.get("/api/people/:status/:condition?/:value?", (req, res) => {
  const params = req.params;

  const where = {
    status: params.status,
  };

  if (params.condition && params.value) {
    where[params.condition] = params.value;
  }

  // const { status } = req.params;
  db.Person.count({
    where: where,
    include: [db.Location],
    attributes: [
      "Location.country",
      "Location.city",
      "Location.state",
      "Location.lat",
      "Location.lng",
    ],
    col: "LocationId",
    group: [
      "Location.country",
      "Location.city",
      "Location.state",
      "Location.lat",
      "Location.lng",
    ],
  }).then((dbPeople) => {
    res.json(dbPeople);
  });
});

router.post("/api/people", (req, res) => {
  const person = req.body;
  db.Person.create(person).then((dbPeople) => {
    res.status(201).json({
      success: true,
      id: dbPeople.insertId,
    });
  });
});

module.exports = router;
