const { Schema, model } = require("mongoose");

const AddOns = new Schema(
    {
        label: {
            type: String,
            required: true,
        },
        // price: {
        //     type: Number,
        //     required: false,
        // },
    },
    { timestamps: true }
);

module.exports = model("AddOns", AddOns);
