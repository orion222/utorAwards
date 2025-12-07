#!/usr/bin/env node
"use strict";

const PORT = process.env.PORT || 3000;

require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(express.json());

app.use(
  "/uploads",
  (_req, res, next) => {
    res.header("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(path.join(__dirname, "uploads"))
);

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

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.on("error", (err) => {
  console.error(`cannot start server: ${err.message}`);
  process.exit(1);
});
