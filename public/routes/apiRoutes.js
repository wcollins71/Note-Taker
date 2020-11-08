const notes = require("../../db/db.json");
const fs = require("fs");
const moment = require("moment");
const dbFile = "./db/db.json";

module.exports = function (app) {

    app.get("/api/notes", function (req, res) {
        res.json(JSON.parse(fs.readFileSync(dbFile)));
    });

    app.post("/api/notes", function (req, res) {
        const existingNotes = JSON.parse(fs.readFileSync(dbFile))
        const addedNote = req.body;
        let noteID = moment().unix();
        addedNote.id = noteID;
        existingNotes.push(addedNote);
        fs.writeFile(dbFile, JSON.stringify(existingNotes), function (err) {
            if (err) {
                return console.log(err);
            }
            console.log(`Note ${noteID} added!`);
        })
        res.json(true);
    });

    app.delete("/api/notes/:id", (req, res) => {
        let noteId = req.params.id;
        fs.readFile(dbFile, "utf8", (err, data) => {
            if (err) throw err;
            const allNotes = JSON.parse(data);
            const newAllNotes = allNotes.filter(note => note.id != noteId);
            fs.writeFile(dbFile, JSON.stringify(newAllNotes, null, 2), err => {
                if (err) throw err;
                res.json("");
                console.log(`Note ${noteId} deleted!`)
            });
        });
    });
};