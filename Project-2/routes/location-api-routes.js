const express = require("express");

const db = require("../models");

const router = express.Router();

router.get("/api/location/:country/:state/:city", (req, res) => {
  const { country, state, city } = req.params;

  db.Location.findOne({
    where: { country: country, state: state, city: city },
  }).then((dbLocation) => {
    const id = dbLocation ? dbLocation.id : null;
    res.status(200).json({
      success: true,
      id: id,
    });
  });
});

router.post("/api/location", (req, res) => {
  const location = req.body;

  db.Location.findOrCreate({
    where: {
      country: location.country,
      state: location.state,
      city: location.city,
    },
    defaults: {
      lat: location.lat,
      lng: location.lng,
    },
  }).then((dbLocation) => {
    res.status(201).json({
      success: true,
      id: dbLocation[0].dataValues.id,
    });
  });
});

module.exports = router;
