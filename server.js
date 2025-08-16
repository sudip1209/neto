// const mongoose = require("mongoose");
// const dotenv = require("dotenv");

// // Handle uncaught exceptions
// process.on("uncaughtException", (err) => {
//   console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
//   console.log(err.name, err.message);
//   process.exit(1);
// });

// dotenv.config({ path: "./config.env" });
// const app = require("./app");

// // Replace password placeholder in DB connection string
// const DB = process.env.DATABASE.replace(
//   "<PASSWORD>",
//   process.env.DATABASE_PASSWORD
// );

// // Mongoose connection
// mongoose
//   .connect(DB)
//   .then(() => console.log("DB connection successful!"))
//   .catch((err) => {
//     console.log("DB connection error:", err.message);
//     process.exit(1); // Ensure graceful exit on failure
//   });

// const port = process.env.PORT || 3000;
// const server = app.listen(port, () => {
//   console.log(`App running on port ${port}...`);
// });

// // Handle unhandled promise rejections
// process.on("unhandledRejection", (err) => {
//   console.log("UNHANDLED REJECTION! 💥 Shutting down...");
//   console.log(err.name, err.message);
//   server.close(() => {
//     process.exit(1);
//   });
// });

const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB, {}).then(() => console.log("DB connection successful!"));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
