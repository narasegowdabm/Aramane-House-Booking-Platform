// External Module
const express = require("express");
const authRouter = express.Router();

// Local Module
const authController = require("../controllers/authController");

authRouter.get("/signUp", authController.getSignUp);
authRouter.post("/signUp", authController.postSignUp);
authRouter.get("/login", authController.getLogin);
authRouter.post("/login", authController.postLogin);
authRouter.post("/logout", authController.postLogout);

module.exports = authRouter;
