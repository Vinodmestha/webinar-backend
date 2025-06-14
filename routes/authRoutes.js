const { Router } = require("express");
const { body } = require("express-validator");

const router = Router();
const User = require("../models/auth/User");
const authController = require("../controllers/authController");
const { tokenAuth } = require("../middleware/tokenAuth");

//user register
router.post(
    "/signup",
    // [
    //     body("email")
    //         .isEmail()
    //         .withMessage("Please enter a valid email.")
    //         .custom((value, { req }) => {
    //             return User.findOne({ email: value }).then((userDoc) => {
    //                 if (userDoc) {
    //                     return Promise.reject("E-Mail address already exists!");
    //                 }
    //             });
    //         })
    //         .normalizeEmail(),
    //     body("password").trim().isLength({ min: 5 }),
    //     body("name").trim().not().isEmpty(),
    // ],
    authController?.signUp
);

//user login
router.post("/login", authController?.login);

//user logout
router.post("/logout", tokenAuth, authController?.logout);

module.exports = router;
