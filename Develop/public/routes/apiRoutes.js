const notes = require("../../db/db.json");
const fs = require("fs");
const moment = require("moment");
const dbFile = "db/db.json";

module.exports = function (app) {

    app.get("/api/notes", function (req, res) {
        res.json(notes);
    });

    app.post("/api/notes", function (req, res) {
        const addedNote = req.body;
        let noteID = moment().unix();
        addedNote.id = noteID;
        notes.push(addedNote);
        let jsonNotes = JSON.stringify(notes)
        fs.writeFile(dbFile, jsonNotes, function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("Success!");
        })
        res.json(true);
    });

    app.delete("/api/notes/:id", (req, res) => {

        let noteId = req.params.id;
        console.log(req.params.id)
        fs.readFile(dbFile, "utf8", (err, data) => {
            if (err) throw err;
            // console.log(JSON.parse(data))
            const allNotes = JSON.parse(data);
            const newAllNotes = allNotes.filter(note => note.id != noteId);

            fs.writeFile(dbFile, JSON.stringify(newAllNotes, null, 2), err => {
                if (err) throw err;
                res.json(true);
                console.log("Note deleted!")
            });
            
        });
    });

};
