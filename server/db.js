const mongoose = require("mongoose");
const mongoURI =
  "mongodb+srv://admin:E82Gf9mo4Zywxigc@cluster0.ngurvfs.mongodb.net/?retryWrites=true&w=majority";

const connectToMongo = () => {
  mongoose
    .connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Database connected!"))
    .catch((err) => console.log(err));
};

module.exports = connectToMongo;