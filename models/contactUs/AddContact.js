const { Schema, model } = require("mongoose");

const AddContact = Schema(
    {
        email: {
            type: String,
            required: true,
        },
        mobile: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = model("Contact", AddContact);
