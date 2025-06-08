const { Schema, model } = require("mongoose");

const ContactForm = Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        mobile: {
            type: Number,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        status: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = model("ContactForm", ContactForm);
