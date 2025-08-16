// const mongoose = require("mongoose");
// const dotenv = require("dotenv");

// dotenv.config({ path: "./config.env" });
// const app = require("./app");

// const DB = process.env.DATABASE.replace(
//   "<PASSWORD>",
//   process.env.DATABASE_PASSWORD
// );

// // Connect to MongoDB
// mongoose
//   .connect(DB, {})
//   .then(() => console.log("DB connection successful!"))
//   .catch((err) => {
//     console.error("DB connection error:", err.message);
//     process.exit(1);
//   });

// // 🚨 Do NOT call app.listen here for Vercel
// // Just export the app
// module.exports = app;


const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const app = require("./app");

// 🚨 No DB connection here
module.exports = app;

