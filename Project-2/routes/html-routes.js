const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/reporting", (req, res) => {
  res.render("reporting");
});

router.get("/maps", (req, res) => {
  res.render("maps");
});

module.exports = router;
