const { Schema, model } = require("mongoose");

const PaymentGatewaysSchema = new Schema({
    slug: {
        type: String,
        required: true,
    },
    label: {
        type: String,
        required: true,
    },
    status: {
        type: Number,
        required: false,
    },
});

module.exports = model("Payment Gateways", PaymentGatewaysSchema);
