const { Schema, model } = require("mongoose");

const Types = new Schema(
    {
        label: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = model("Types", Types);
