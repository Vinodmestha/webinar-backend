const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const { validationResult } = require("express-validator");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const { apiResponse } = require("../helpers/apiResponse");

const User = require("../models/auth/User");
const { addToBlacklist } = require("../helpers/blacklist");
const {
    validateEmail,
    validateName,
    validateMobile,
    stringChecker,
} = require("../helpers/validators");

const transporter = nodemailer.createTransport(
    sendgridTransport({ auth: { api_key: "api key from sendgrid a/c" } })
);

const errorHandler = (res, status, msg) => {
    return apiResponse(res, false, status, msg, [], []);
};

exports.signUp = (req, res, next) => {
    const { email, name, password, mobile, status } = req?.body;
    console.log("Password", name);
    if (!validateEmail(email)) {
        return errorHandler(res, 422, "Invalid email");
    }
    if (!validateName(name)) {
        return errorHandler(res, 422, "Enter a valid Name.");
    }
    if (!stringChecker(password)) {
        return errorHandler(res, 422, "Password cannot be empty!");
    }
    if (!validateMobile(mobile)) {
        return errorHandler(res, 422, "Invalid mobile!");
    }

    User?.findOne({ email: email })
        .then((userAvailable) => {
            if (userAvailable) {
                return errorHandler(res, 422, "User Already registered!");
            }
            return bcrypt
                .hash(password, 12)
                .then((encryptedPass) => {
                    const user = new User({
                        email: email,
                        password: encryptedPass,
                        mobile: mobile,
                        name: name,
                        status: status,
                    });
                    return user.save();
                })
                .then((result) => {
                    apiResponse(
                        res,
                        true,
                        201,
                        "User registered successfully",
                        [],
                        []
                    );
                })
                .then(() => {
                    // transporter.sendMail({
                    //     to: email,
                    //     from: "test@test.com",
                    //     subject: "Signup succeeded!",
                    //     html: "<h1>You successfully signed up!</h1>",
                    // });
                });
        })
        .catch((err) => {});
};

exports.login = async (req, res, next) => {
    const { email, password } = req?.body;
    if (!email || !password) {
        return apiResponse(
            res,
            false,
            422,
            "Invalid username or password!",
            [],
            []
        );
    }

    let loadedUser;
    await User.findOne({ email: email })
        .then((user) => {
            if (!user) {
                return apiResponse(
                    res,
                    false,
                    422,
                    "A user with this email could not be found.",
                    [],
                    []
                );
                // const error = new Error(
                //     "A user with this email could not be found."
                // );
                // error.statusCode = 422;
                // throw error;
            }
            loadedUser = user;
            return bcrypt.compare(password, user.password);
        })
        .then((isEqual) => {
            // if (matched) {
            //     req.session.isLoggedIn = true;
            //     req.session.user = user;
            //     return req.session.save((err) => console.log(err));
            // }
            if (!isEqual) {
                return apiResponse(
                    res,
                    false,
                    200,
                    "Invalid username or password",
                    [],
                    []
                );
                // const error = new Error("Wrong password!");
                // error.statusCode = 401;
                // throw error;
            }

            const token = jwt.sign(
                {
                    email: loadedUser.email,
                    userId: loadedUser._id.toString(),
                },
                "rajnishAppSecretToken",
                { expiresIn: "1d" }
            );

            apiResponse(
                res,
                true,
                200,
                "User logged in successfully",
                {
                    data: {
                        ...loadedUser?._doc,
                        token: token,
                    },
                },
                []
            );
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.logout = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];

    if (token) {
        addToBlacklist(token);
        return apiResponse(res, true, 200, "Logged out Successfully");
    } else {
        return apiResponse(res, true, 401, "No token found");
    }
};
