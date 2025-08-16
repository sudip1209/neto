const pug = require("pug");
const path = require("path");
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const viewRouter = require("./routes/viewRoutes");
const cors = require("cors");
const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// 1) Global MIDDLEWARES
// Serving static files
app.use(express.static(path.join(__dirname, "public")));

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:3000");
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   next();
// });
// app.use(helmet());
// app.use((req, res, next) => {
//   res.setHeader(
//     "Content-Security-Policy",
//     "default-src 'self'; connect-src 'self' ws:;"
//   );
//   next();
// });

// app.use(
//   cors({
//     credentials: true,
//     origin: "http://localhost:3000", // Explicitly allow this origin
//   })
// );
// app.options("*", cors());
// app.use(cors());

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  console.error("Stack trace:", err.stack);

  // Pass to `sendErrorProd` or respond here as needed
  sendErrorProd(err, req, res);
});

// Test middleware to log request time and cookies
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log("Request Time:", req.requestTime); // Log request time
  console.log("Cookies:", req.cookies); // Log cookies
  next();
});

// 3) ROUTES

// Define routes for different parts of the application
app.use("/", viewRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);

// Handle all undefined routes with a 404 error
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
