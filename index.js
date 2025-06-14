const express = require("express");
const { connectToMongoDB } = require("./database");
const rootRouter = require("./routes/index");
const cors = require("cors");
const { setUpEvents } = require("./events");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", rootRouter);
app.use("/uploads", express.static("uploads"));

setUpEvents();
connectToMongoDB();

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
