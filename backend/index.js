#!/usr/bin/env node
"use strict";

const port = (() => {
  const args = process.argv;

  if (args.length !== 3) {
    console.error("usage: node index.js port");
    process.exit(1);
  }

  const num = parseInt(args[2], 10);
  if (isNaN(num)) {
    console.error("error: argument must be an integer.");
    process.exit(1);
  }

  return num;
})();

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // TODO: update origin link with link from WEBSITE
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(express.json());

// ADD YOUR WORK HERE
const userRouter = require("./routes/userRoutes");
const transactionRouter = require("./routes/transactionRoutes");
const eventRouter = require("./routes/eventRoutes");
const authRouter = require("./routes/authRoutes");
const promotionRouter = require("./routes/promotionRoutes");

app.use("/users", userRouter);
app.use("/transactions", transactionRouter);
app.use("/events", eventRouter);
app.use("/auth", authRouter);
app.use("/promotions", promotionRouter);

// catch any non-existing routes
app.all("*", (_req, res) => {
  res.status(405).json({ error: "Method not allowed" });
});

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

server.on("error", (err) => {
  console.error(`cannot start server: ${err.message}`);
  process.exit(1);
});
