const fs = require("fs");
const util = require("util");
const path = require("path");
const { resolve } = require("path");

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

const DBPath = path.join(__dirname, "../db/db.json");

module.exports = function(app) {
    
    app.get("/api/notes", function(req, res){
        readDB()
        .then(data => res.json(data));
    });

    app.post("/api/notes", function(req, res){
        let newNote = req.body;
        newNote.id = generateID();

        readDB()
        .then(notes => {
            notes.push(newNote);
            return writeDB(JSON.stringify(notes));
        }).then(() => res.json(newNote));
    });

    app.delete('/api/notes/:id', function (req, res) {
        let id = req.params.id;
        readDB()
        .then(notes => {
            var removeIndex = notes.map(item => item.id).indexOf(id);
            ~removeIndex && notes.splice(removeIndex, 1);
            return writeDB(JSON.stringify(notes));
        })
        .then(response => res.json(true));
    });

    function readDB() {
        return new Promise(function(resolve, reject) {
            readFileAsync(DBPath, "utf8")
            .then(data => resolve(JSON.parse(data)))
            .catch(err => reject(err));
        });
    }

    function writeDB(data) {
        return new Promise(function(resolve, reject) {
            writeFileAsync(DBPath, data, "utf8")
            .then(function () {
                resolve(`Succesfully Updated DB at ${DBPath}`);
            })
            .catch(err => reject(err));
        });
    }

    function generateID() {
        return '_' + Math.random().toString(36).substr(2, 9);
    };
};