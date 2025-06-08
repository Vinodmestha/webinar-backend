const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Cart = require("../../models/cart/cart");
const PaymentGateways = require("../../models/cart/paymentGatways");
const Webinars = require("../../models/webinars/add");
const AddOns = require("../../models/webinars/addOns");
const { apiResponse } = require("../../helpers/apiResponse");
const {
    paymentOptions,
    summaryHandler,
    cartDetails,
    expressCartDetails,
} = require("../../helpers/summaryHandler");

const ObjectId = mongoose.Types.ObjectId;

exports.addToExpressCart = async (req, res, next) => {
    try {
        // const token = req.headers.authorization.split(' ')[1];
        // const decodedToken = jwt.verify(token, 'rajnishAppSecretToken');
        // const userId = decodedToken.userId;
        // const { _id, add_ons, quantity } = req?.body;

        // const webinar = await Webinars?.findById(_id);
        // if (!webinar) {
        //     return res?.status(422)?.json({ error: "Webinar not found" });
        // }

        //  // Remove any existing express cart for the user
        // await Cart.deleteMany({ user_id: userId, isExpress: true });

        // let totalAddOnsPrice = 0;
        // const selectedAddOns = add_ons
        //     .map((add_on) => {
        //         const webinarAddOn = webinar?.add_ons?.find((item) =>
        //             new ObjectId(item?._id)?.equals(new ObjectId(add_on))
        //         );

        //         if (webinarAddOn) {
        //             totalAddOnsPrice += webinarAddOn?.price;
        //             return {
        //                 ...webinarAddOn,
        //             };
        //         }
        //         return null;
        //     })
        //     .filter(Boolean);

        // const totalPrice = (webinar.price + totalAddOnsPrice) * quantity;

        // let cart = new Cart({ items: [] });
        // cart.items.push({
        //     webinar: webinar,
        //     quantity: 1,
        //     selected_add_ons: selectedAddOns,
        // });
        // // req.session.expressCart.push(cartItem);
        // const response = {
        //     cart_id: cart?._id,
        //     payment_gateways: gateways,
        //     gateway: gateways[0],
        //     items: products,
        //     grand_total: grandTotal,
        //     summary: this.summaryHandler(grandTotal),
        // };
        return expressCartDetails(req, res);

        // res.status(200).json({ message: "Item added to cart" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.updateExpressCart = async (req, res, next) => {};
