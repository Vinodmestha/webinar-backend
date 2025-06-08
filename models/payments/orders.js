const { Schema, model } = require("mongoose");

const OrderSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    cart: {
        type: Schema.Types.ObjectId,
        ref: "Cart",
        required: true,
    },

    details: [
        {
            webinar: {
                type: Schema.Types.ObjectId,
                ref: "Webinars",
                required: true,
            },
            quantity: { type: Number, required: true },
            selected_add_ons: [
                {
                    addon: {
                        type: Schema.Types.ObjectId,
                        ref: "AddOns",
                    },
                    label: { type: String, required: true },
                    price: { type: Number, required: false },
                },
            ],
        },
    ],
    grand_total: { type: Number, required: true },
    status: { type: String, default: "Pending" },
    created_at: { type: Date, default: Date.now },
});
module.exports = model("Orders", OrderSchema);
