const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
app.use(express.json());
app.use(express.static("public"));

let notes = [];
let useMongo = false;
let coll;

const client = new MongoClient(process.env.MONGODB_URI || "mongodb://localhost:27017", {
  serverSelectionTimeoutMS: 3000,
});
client.connect().then(() => {
  coll = client.db("smoke").collection("notes");
  useMongo = true;
  console.log("mongo connected");
}).catch((err) => {
  console.error("mongo connection failed, using in-memory db:", err.message);
});

app.get("/api/notes", async (_, res) => {
  if (useMongo) return res.json(await coll.find().toArray());
  res.json(notes);
});
app.post("/api/notes", async (req, res) => {
  const { text } = req.body;
  if (useMongo) {
    const { insertedId } = await coll.insertOne({ text, at: new Date() });
    return res.json({ _id: insertedId, text });
  }
  const note = { _id: String(Date.now()), text, at: new Date() };
  notes.push(note);
  res.json(note);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on ${port}`));
