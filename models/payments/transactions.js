const { Schema, model } = require("mongoose");

const TransactionSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Orders",
        required: true,
    },
    amount: { type: Number, required: true },
    status: { type: String, default: "Pending" },
    created_at: { type: Date, default: Date.now },
});

module.exports = model("Transactions", TransactionSchema);
