const { MongoClient } = require("mongodb");

let _db;

const mongoConnect = (callback) => {
    MongoClient.connect(
        "mongodb+srv://Vinodmestha:admin@cluster0.hlnkemg.mongodb.net/webinar"
        // "mongodb+srv://anandvyas1029:eMbhps6om5tfszql@webinatr.lqfam4h.mongodb.net/?retryWrites=true&w=majority&appName=webinatr"
    )
        .then((client) => {
            console.log("Connected!!");
            _db = client?.db();
            callback();
        })
        .catch((err) => {
            console.log(err);
        });
};

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw "No database found";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
