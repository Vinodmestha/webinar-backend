const { Schema, model, default: mongoose } = require("mongoose");

const Types = require("./types");

const WebinarAdd = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        time: {
            type: String,
            required: false,
        },
        date: {
            type: Date,
            required: true,
        },
        category: {
            type: Array,
            required: true,
        },
        speakers: {
            type: Array,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        webinar_info: {
            type: [
                {
                    label: String,
                    value: String,
                    desc: String,
                },
            ],
            required: false,
        },
        add_ons: [
            {
                addon: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "AddOns",
                },
                label: { type: String, required: true },
                price: { type: Number, required: false },
            },
        ],
        status: {
            type: Number,
            required: true,
            default: 1,
        },
    },
    { timestamps: true }
);
// WebinarAddSchema.pre('save', function (next) {
//     const webinarInfoArray = Object.entries(this.webinar_info).map(([key, value]) => ({
//         label: key,
//         value
//     }));
//     this.webinar_info = webinarInfoArray;
//     next();
// });

module.exports = model("Webinars", WebinarAdd);
