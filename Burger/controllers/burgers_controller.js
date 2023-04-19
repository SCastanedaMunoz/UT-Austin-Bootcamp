const burger = require("../models/burger");

const express = require("express");
const { request } = require("express");

const router = express.Router();

router.get("/", (req, res) => {
    burger.selectAll((data) => {
        const viewData = {
            burgers: data
        };
        res.render("index", viewData);
    });
});

router.post("/api/burgers", (req, res) => {
    const { name } = req.body;
    burger.insertOne(["burger_name"], [name], (data) => {
        res.json({ id: data.insertId });
    });
});

router.put("/api/burgers/:id", (req, res) => {

    burger.updateOne({devoured: true}, {id: req.params.id}, (result) => {
        if (result.changedRows == 0) {
            // If no rows were changed, then the ID must not exist, so 404
            return response.status(404).end();
        }
        res.status(200).end();
    });
});

module.exports = router;