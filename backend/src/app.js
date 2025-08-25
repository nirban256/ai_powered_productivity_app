import express from "express";

const app = express();

app.get("/", (req, res) => {
    res.status(200).send("Hello from server");
})

app.listen(5000, () => {
    console.log("App running on port 5000");
})