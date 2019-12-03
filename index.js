const express = require("express");

const db = require("./data/db.js");
const server = express();

server.use(express.json()); // needed to parse JSON from the body

server.get("/api/users", (req, res) => {
    db.find()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(error => {
            console.log("error on GET /users", error);
            res
                .status(500)
                .json({ errorMessage: "The users information could not be retrieved." });
        });
});

server.get("/api/users/:id", (req, res) => {
    const id = req.params.id;
    db.findById(id)
        .then(user => {
            if (user) {
                res.status(200).json(user);
            }
            else {
                res.status(404)
                    .json({ message: "The user with the specified ID does not exist." })
            }
        })
        .catch(error => {
            console.log("error on GET /users", error);
            res
                .status(500)
                .json({ errorMessage: "The users information could not be retrieved." });
        });
});

server.post("/api/users", (req, res) => {
    const userData = req.body; //express does not know how to parse JSON
    db.insert(userData)
        .then(user => {
            console.log(user)
            if (user) {
                res
                    .status(201).json(userData);

            } else {
                res
                    .status(400)
                    .json({ errorMessage: "Please provide name and bio for the user." })
            }
        })
        .catch(error => {
            console.log("error on POST /api/users", error);
            res
                .status(500)
                .json({ errorMessage: "There was an error while saving the user to the database." });
        });
})

server.delete("/api/users/:id", (req, res) => {
    const id = req.params.id;
    db.remove(id)
        .then(removed => {
            if (removed) {
                res.status(404).json({ message: "The user with the specified ID does not exist." })
            } else {
                res.status(200).json({ message: "user deleted" })
            }
        })

        .catch(error => {
            console.log("error on DELETE api/users", error);
            res
                .status(500)
                .json({ errorMessage: "The user could not be removed" });
        });
})

server.put("/api/users/:id", (req, res) => {
    const id = req.params.id;
    const userData = req.body; //express does not know how to parse JSON
    db.update(id, userData)
        .then(user => {
            console.log(user)
            if (user.name && user.bio) {
                res
                    .status(200).json(userData);

            } else {
                res
                    .status(404)
                    .json({ errorMessage: "The user with the specified ID does not exist." })
            } if (user.id) {
                res.status(400)
                    .json({ errorMessage: "Please provide name and bio for the user." })
            }
        })
        .catch(error => {
            console.log("error on POST /api/users", error);
            res
                .status(500)
                .json({ errorMessage: "There was an error while saving the user to the database." });
        });
})

const port = 5000;
server.listen(port, () => console.log(`\n ** API running in port ${port} ** \n`));