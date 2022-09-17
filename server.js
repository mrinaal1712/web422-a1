/*********************************************************************************
 * WEB422 – Assignment 1
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 * No part of this assignment has been copied manually or electronically from any other source
 * (including web sites) or distributed to other students.
 *
 * Name: ______________________ Student ID: ______________ Date: ________________
 * Cyclic Link: _______________________________________________________________
 *
 ********************************************************************************/

const express = require("express");
const cors = require("cors");
require("dotenv").config();
const HTTP_PORT = 3000;

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send({ message: "API Listening" });
});

const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();

db.initialize(process.env.MONGODB_CONN_STRING)
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`server listening on: ${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.post("/api/movies", (req, res) => {
  const movie = req.body;
  db.addNewMovie(movie)
    .then((saved) => {
      res.status(201);
      res.send(saved);
    })
    .catch((error) => {
      res.status(500);
      res.send({
        status: 500,
        message: "Not Found!",
      });
    });
});

app.get("/api/movies", (req, res) => {
  const page = req.query["page"] ? req.query["page"] : 1;
  const perPage = req.query["perPage"] ? req.query["perPage"] : 5;
  const title = req.query["title"];
  db.getAllMovies(page, perPage, title)
    .then((json) => {
      res.send(json);
    })
    .catch((error) => {
      res.status(500);
      res.send({
        status: 500,
        message: "Not Found!",
      });
    });
});

app.get("/api/movies/:id", (req, res) => {
  const id = req.params["id"];
  db.getMovieById(id)
    .then((json) => {
      res.send(json);
    })
    .catch((error) => {
      res.status(500);
      res.send({
        status: 500,
        message: "Check the provided movie id",
      });
    });
});

app.put("/api/movies/:id", (req, res) => {
  const id = req.params["id"];
  const movie = req.body;
  db.updateMovieById(movie, id)
    .then((updated) => {
      res.status(204);
      res.send({
        status: 204,
        message: "Movie updated successfully!",
      });
    })
    .catch((error) => {
      res.status(500);
      res.send({
        status: 500,
        message: "Cannot update the requested movie!",
      });
    });
});

app.delete("/api/movies/:id", (req, res) => {
  const id = req.params["id"];
  db.deleteMovieById(id)
    .then((response) => {
      if (response.deletedCount > 0) {
        res.status(500);
        res.send({
          status: 204,
          message: "Movie deleted successfully!",
        });
      } else {
        res.status(404);
        res.send({
          status: 404,
          message: "This movies does not exists!",
        });
      }
    })
    .catch((error) => {
      res.status(500);
      res.send({
        status: 500,
        message: "Check the provided movie id",
      });
    });
});
