const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const CartSchema = new Schema({
    // user: {
    //     type: Schema.Types.ObjectId,
    //     ref: "User",
    // },
    // items: [
    //     {
    //         type: Schema.Types.ObjectId,
    //         ref: "Item",
    //     },
    // ],
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
    },
    items: [
        {
            webinar: { type: mongoose.Schema.Types.ObjectId, ref: "Webinars" },
            quantity: { type: Number, default: 1 },
            selected_add_ons: [
                {
                    addon: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "AddOns",
                    },
                    label: { type: String, required: true },
                    price: { type: Number, required: false },
                },
            ],
            // required: true
        },
    ],
    grand_total: {
        type: Number,
        default: 0,
    },
    isExpress: { type: Boolean, default: false }, // New field to indicate express cart
});

module.exports = model("Cart", CartSchema);
