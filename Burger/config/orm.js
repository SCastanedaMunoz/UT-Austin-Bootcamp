const connection = require("./connection");

function printQuestionMarks(num) {
    let arr = [];

    for (let i = 0; i < num; i++) {
        arr.push("?");
    }

    return arr.toString();
}

function objToSql(obj) {
    let arr = [];

    for (let key in obj) {
        let value = obj[key];
        if (Object.hasOwnProperty.call(obj, key)) {
            if (typeof value === "string" && value.indexOf(" ") >= 0) {
                value = `'${value}'`;
            }
            arr.push(`${key}=${value}`);
        }
    }
    return arr.toString();
}

function throwOrTrigger(err, res, cb) {
    if (err) {
        throw err;
    }
    cb(res);
}

const orm = {
    selectAll: (table, cb) => {
        const queryString = "SELECT * FROM ??";
        connection.query(queryString, [table], (err, res) => {
            throwOrTrigger(err, res, cb);
        });
    },
    insertOne: (table, cols, vals, cb) => {
        const queryString = `INSERT INTO ?? (??) VALUES (${printQuestionMarks(vals.length)})`;
        connection.query(queryString, [table, cols.toString(), ...vals], (err, res) => {
            throwOrTrigger(err, res, cb);
        });
    },
    updateOne: (table, objColVals, condition, cb) => {

        let queryString = `UPDATE ${table}`;
        
        queryString += " SET ";
        queryString += objToSql(objColVals);
        queryString += " WHERE ";
        queryString += objToSql(condition);

        connection.query(queryString, (err, res) => {
            throwOrTrigger(err, res, cb);
        });
    }
};

module.exports = orm;