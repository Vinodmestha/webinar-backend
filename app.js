let path = require("path");
const dotenv = require("dotenv");
const envFile =
    process.env.NODE_ENV === "production"
        ? ".env.production"
        : ".env.development";
dotenv.config({ path: path.resolve(__dirname, envFile) });

const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const routes = require("./routes");
// const mongoConnect = require("./utils/database");

const app = express();
const multer = require("multer");

// const crypto = require("crypto");
// const secretKey = crypto.randomBytes(32).toString("hex");
// console.log("Generated Secret Key:", secretKey);

const PORT = process.env.PORT || 8484,
    DB_URL = process.env.DB_URL;

// const fileStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "images");
//     },
//     filename: (req, file, cb) => {
//         cb(null, new Date().toISOString() + "-" + file.originalname);
//     },
// });

// const fileFilter = (req, file, cb) => {
//     if (
//         file.mimetype === "image/png" ||
//         file.mimetype === "image/jpg" ||
//         file.mimetype === "image/jpeg"
//     ) {
//         cb(null, true);
//     } else {
//         cb(null, false);
//     }
// };

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
// app.use(bodyParser.json()); // application/json
// app.use(
//     multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
// );
// app.use("/images", express.static(path.join(__dirname, "images")));

//routes

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
    );
    next();
});
// cors({
//     origin: "*",
//     credentials: true,
// });
app.use(cors());

//storing session for every logged-in user
// const store = new MongoDBStore({
//     uri: DB_URL,
//     collection: "session",
// });
// app.use(
//     session({
//         secret: "rajWebinarSecret",
//         resave: false,
//         saveUninitialized: false,
//         store: store,
//         // cookie: { maxAge: 60000 } // Set cookie expiration time
//     })
// );

app.use(bodyParser.json());
app.use("/api", routes);

app.use((error, req, res, next) => {
    const status = error?.statusCode || 500;
    const msg = error?.message;
    res.status(status).json({ message: msg });
});

// app.use("/images", express.static(path.join(__dirname, "images")));

mongoose
    .connect(DB_URL)
    .then(async () => {
        console.log("connected");
        app.listen(PORT);
    })
    .catch((err) => {
        console.log(err);
    });

// mongoConnect.mongoConnect(() => {
//     app.listen(3000);
// });
