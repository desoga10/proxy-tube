const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const axios = require("axios");
const fetch = require("node-fetch");
const got = require("got");

require("dotenv").config();

const app = express();

app.use(morgan("tiny"));
app.use(cors());

//routes
app.get("/videos", async (req, res) => {
  const url =
    "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=UUhi_aILZkMMx8_KlVAsbI7g&maxResults=10";
  (async () => {
    try {
      await fetch(`${url}&key=${process.env.GOOGLE_API_KEY}`)
        .then((response) => response.json())
        .then((json) => {
          res.json(json.items);
        });
    } catch (error) {
      console.log(error.response.body);
    }
  })();
});

//Not Found Middleware
function routesNotFound(req, res, next) {
  res.status(404);
  const error = new Error("Not Found");
  next(error);
}
//Error Handler Middleware
function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return res.status(res.statusCode || 500);
  }

  res.json({ message: err.message });
}

app.use(routesNotFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening on Port, ${port}`);
});
