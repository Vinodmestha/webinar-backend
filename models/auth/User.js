const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        mobile: {
            type: Number,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        lname: {
            type: String,
            required: true,
        },
        dob: {
            type: String,
            required: false,
        },
        status: {
            type: Number,
            default: 1,
            required: false,
        },
        cart: {
            type: Schema.Types.ObjectId,
            ref: "Cart",
        },
        // posts: [
        //     {
        //         type: Schema.Types.ObjectId,
        //         ref: "Post",
        //     },
        // ],
    },
    { timestamps: true }
);

module.exports = model("User", UserSchema);
