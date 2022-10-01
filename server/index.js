const express = require("express");
const connectToMongo = require("./db.js");
const cors = require("cors");

connectToMongo();
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

//Available routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/products"));

app.listen(port, () => {
  console.log(`Shopping server listening on port: ${port}`);
});
