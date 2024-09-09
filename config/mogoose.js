const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://sanauaransari99:chand123456789@cluster0.pnyl9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
);

// mongodb://127.0.0.1:27017/employeeReviewSystem
// const db = mongoose.connection;
const db = mongoose.connection;

db.on(
  "error",
  console.error.bind(console, "Error while connecting to the database")
);

db.once("open", function () {
  console.log("Successfully connected to the MONGOBD BRO YEHHHHHHHH!!!");
});
module.exports = db;
