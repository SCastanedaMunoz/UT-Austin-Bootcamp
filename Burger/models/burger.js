const orm = require("../config/orm");

const table = "burgers";

const burger = {
    selectAll(cb) {
        orm.selectAll(table, cb);
    },
    insertOne(cols, vals, cb) {
        orm.insertOne(table, cols, vals, cb);
    },
    updateOne(objColVals, condition, cb) {
        orm.updateOne(table, objColVals, condition, cb);
    }
};

module.exports = burger;