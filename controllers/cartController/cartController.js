const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Cart = require("../../models/cart/cart");
const PaymentGateways = require("../../models/cart/paymentGatways");
const Webinars = require("../../models/webinars/add");
const { apiResponse } = require("../../helpers/apiResponse");
const {
    paymentOptions,
    summaryHandler,
    cartDetails,
} = require("../../helpers/summaryHandler");

const ObjectId = mongoose.Types.ObjectId;

//payment gateways
exports.paymentGateways = async (req, res, next) => {
    const { label, slug } = req?.body;
    let gateways = new PaymentGateways({ label, slug });

    gateways.save().then(async () => {
        return paymentOptions().then((result) => {
            apiResponse(
                res,
                true,
                200,
                "Payment Gateways",
                { payment_gateways: result },
                []
            );
        });
    });
};

//summary handlers
exports.cartSummary = async (req, res, next) => {
    return cartDetails(req, res);
};

exports.addToCart = async (req, res, next) => {
    try {
        const token = req?.headers?.authorization?.split(" ")[1]; // Get token from headers
        const decodedToken = jwt?.verify(token, "rajnishAppSecretToken"); // Verify the token
        const userId = decodedToken.userId; // Extract user ID from the token

        const { _id, add_ons, quantity } = req?.body;

        // Find the user's cart or create a new one if it doesn't exist
        let cart = await Cart.findOne({ user_id: userId, isExpress: false });
        if (!cart) {
            cart = new Cart({ user_id: userId, items: [], isExpress: false });
        }
        // Check if the webinar already exists in the cart
        const itemIndex = cart.items.findIndex((item) =>
            item.webinar.equals(_id)
        );

        // Check if the webinar exists
        const webinar = await Webinars.findById(_id);
        if (!webinar) {
            return apiResponse(res, false, 422, "Item not found", [], []);
        }

        const selectedAddOns = add_ons
            .map((add_on) => {
                const webinarAddOn = webinar?.add_ons?.find((item) =>
                    new ObjectId(item?._id)?.equals(new ObjectId(add_on))
                );

                if (webinarAddOn) {
                    // totalAddOnsPrice += webinarAddOn?.price;
                    return {
                        _id: webinarAddOn.id,
                        label: webinarAddOn.label,
                        price: webinarAddOn.price,
                    };
                }
                return null;
            })
            .filter(Boolean);

        // if (itemIndex !== -1) {
        //     // If webinar exists, increment the quantity
        //     cart.items[itemIndex].quantity++;
        // } else {
        // If webinar doesn't exist, add it to the cart
        cart.items.push({
            webinar: webinar,
            quantity: quantity,
            selected_add_ons: selectedAddOns,
        });
        // }

        // Add the webinar ID to the cart
        // cart?.items?.push(webinar);
        await cart.save();

        apiResponse(res, true, 200, "Item added to the cart", [], []);
        return cart;
    } catch (error) {
        next(error);
    }
};

exports.updateCart = async (req, res, next) => {
    try {
        const token = req?.headers?.authorization?.split(" ")[1]; // Get token from headers
        const decodedToken = jwt.verify(token, "rajnishAppSecretToken"); // Verify the token
        const userId = decodedToken.userId; // Extract user ID from the token

        const { cart_id, _id, quantity } = req?.body;

        let cart = await Cart.findOne({ user_id: userId, isExpress: false });
        if (!cart) {
            return apiResponse(res, true, 422, "Cart not found", [], []);
        }
        // Check if the webinar already exists in the cart
        const itemIndex = cart?.items?.findIndex((item) =>
            item?.webinar?.equals(_id)
        );

        // Check if the webinar exists
        const webinar = await Webinars.findById(_id);
        if (!webinar) {
            return apiResponse(res, false, 422, "Item not found", [], []);
        }

        if (itemIndex !== -1) {
            if (quantity < 1) {
                // Remove the item if quantity is less than 1
                cart.items.splice(itemIndex, 1);
            } else {
                // Update the quantity if the item exists
                cart.items[itemIndex].quantity = quantity;
            }
        } else {
            if (quantity > 0) {
                // Add new item to the cart
                cart.items.push({
                    webinar: _id,
                    quantity: quantity,
                });
            }
        }

        await cart.save();
        return cartDetails(req, res);
    } catch (error) {
        next(error);
    }
};

exports.removeItem = async (req, res, next) => {
    try {
        const token = req?.headers?.authorization?.split(" ")[1];
        const decodedToken = jwt.verify(token, "rajnishAppSecretToken");
        const userId = decodedToken.userId;

        const { _id } = req?.body;

        let cart = await Cart.findOne({ user_id: userId, isExpress: false });
        if (!cart) {
            return apiResponse(res, true, 422, "Cart not found", [], []);
        }

        const itemIndex = cart?.items?.findIndex((item) =>
            item?.webinar?.equals(_id)
        );

        if (itemIndex !== -1) {
            // cart.items = cart?.items?.filter((item) => {
            //     return item?._id !== _id;
            // });
            // console.log(cart.items);
            cart?.items?.splice(itemIndex, 1);
            await cart.save();
            return cartDetails(req, res);
        } else {
            return apiResponse(
                res,
                false,
                422,
                "Item not found in cart",
                [],
                []
            );
        }
    } catch (error) {
        next(error);
    }
};

exports.emptyCart = async (req, res, next) => {
    try {
        const token = req?.headers?.authorization?.split(" ")[1];
        const decodedToken = jwt.verify(token, "rajnishAppSecretToken");
        const userId = decodedToken.userId;

        let cart = await Cart.findOne({ user_id: userId, isExpress: false });
        if (!cart) {
            return apiResponse(res, true, 422, "Cart not found", [], []);
        }

        cart.items = [];
        await cart.save();
        return cartDetails(req, res);
    } catch (error) {
        next(error);
    }
};

exports.cartCount = async (req, res, next) => {
    // const token = req?.headers?.authorization?.split(" ")[1];
    // const decodedToken = jwt.verify(token, "rajnishAppSecretToken");
    // const userId = decodedToken.userId;
    // let cartCount;
    // await Cart?.findOne({ user_id: userId }).then((res) => {
    //     cartCount = res?.items?.length;
    // });
    // return apiResponse(res, true, 200, "Cart count", { count: cartCount }, []);
};

// const paypal = require("@paypal/checkout-server-sdk");
// const Order = require("../models/order");

// PayPal client configuration
