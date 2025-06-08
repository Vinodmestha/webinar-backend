const { Schema, model } = require("mongoose");

const WhyUsAdd = new Schema(
    {
        label: {
            type: String,
            required: true,
        },
        icon: {
            type: String,
            required: true,
        },
        desc: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = model("Why-Us", WhyUsAdd);
