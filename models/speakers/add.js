const { Schema, model } = require("mongoose");

const SpeakersAdd = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            required: true,
        },
        about: {
            type: String,
            required: true,
        },
        designation: {
            type: String,
            required: false,
        },
    },
    { timestamps: true }
);

module.exports = model("Speakers", SpeakersAdd);
