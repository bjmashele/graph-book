/* eslint-disable quotes */
import express from "express";

const app = express();
const PORT = 8080;

app.get("/", (req, res) => res.send("Hello graphbook"));
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
