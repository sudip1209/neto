// const path = require("path");
// const express = require("express");
// const morgan = require("morgan");
// const rateLimit = require("express-rate-limit");
// const helmet = require("helmet");
// const mongoSanitize = require("express-mongo-sanitize");
// const xss = require("xss-clean");
// const hpp = require("hpp");
// const cookieParser = require("cookie-parser");
// const cors = require("cors");

// const AppError = require("./utils/appError");
// const globalErrorHandler = require("./controllers/errorController");
// const tourRouter = require("./routes/tourRoutes");
// const userRouter = require("./routes/userRoutes");
// const reviewRouter = require("./routes/reviewRoutes");
// const viewRouter = require("./routes/viewRoutes");

// const app = express();

// // Pug setup
// app.set("view engine", "pug");
// app.set("views", path.join(__dirname, "views"));

// // 1) GLOBAL MIDDLEWARES
// // Static files
// app.use(express.static(path.join(__dirname, "public")));

// // Security headers
// // app.use(helmet());

// // Logging (dev only)
// if (process.env.NODE_ENV === "development") {
//   app.use(morgan("dev"));
// }

// // Rate limiting
// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000,
//   message: "Too many requests from this IP, please try again in an hour!",
// });
// app.use("/api", limiter);

// // Body parsers
// app.use(express.json({ limit: "10kb" }));
// app.use(express.urlencoded({ extended: true, limit: "10kb" }));
// app.use(cookieParser());

// // Data sanitization
// app.use(mongoSanitize());
// app.use(xss());

// // Prevent parameter pollution
// app.use(
//   hpp({
//     whitelist: [
//       "duration",
//       "ratingsQuantity",
//       "ratingsAverage",
//       "maxGroupSize",
//       "difficulty",
//       "price"
//     ]
//   })
// );

// // Test middleware
// app.use((req, res, next) => {
//   req.requestTime = new Date().toISOString();
//   console.log("Request Time:", req.requestTime);
//   console.log("Cookies:", req.cookies);
//   next();
// });

// // 2) ROUTES
// app.use("/", viewRouter);
// app.use("/api/v1/tours", tourRouter);
// app.use("/api/v1/users", userRouter);
// app.use("/api/v1/reviews", reviewRouter);

// // 404 handler
// app.all("*", (req, res, next) => {
//   next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
// });


const path = require("path");
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const viewRouter = require("./routes/viewRoutes");

const app = express();

// 🔑 Connect DB here
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {})
  .then(() => console.log("DB connection successful!"))
  .catch((err) => {
    console.error("DB connection error:", err.message);
  });

// Pug setup
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// 1) GLOBAL MIDDLEWARES
app.use(express.static(path.join(__dirname, "public")));
app.use(helmet());
app.use(cors({ origin: "*" }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

app.use(mongoSanitize());
app.use(xss());
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price"
    ]
  })
);

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 2) ROUTES
app.use("/", viewRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;


// // GLOBAL ERROR HANDLER
// app.use(globalErrorHandler);

// module.exports = app;
