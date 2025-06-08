const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Cart = require("../models/cart/cart");
const Webinars = require("../models/webinars/add");
const PaymentGateways = require("../models/cart/paymentGatways");
const { apiResponse } = require("./apiResponse");

// const { v4: uuidv4 } = require("uuid");
const ObjectId = mongoose.Types.ObjectId;

exports.summaryHandler = (prices) => {
    return [
        { label: "Base Price", value: `$${prices?.base}` },
        { label: "Add ons", value: `$${prices?.add_ons}` },
        // { label: "Grand Total", value: `$${prices?.grandTotal}` },
    ];
};

exports.paymentOptions = async () => {
    const options = [];
    return PaymentGateways.find().then((result) => {
        for (let i in result) {
            options.push({
                _id: result[i]?._id,
                label: result[i]?.label,
                slug: result[i]?.slug,
            });
        }
        return options;
    });
};

exports.cartDetails = async (req, res) => {
    const token = req?.headers?.authorization?.split(" ")[1]; // Get token from headers
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    const userId = decodedToken.userId; // Extract user ID from the token
    const cart = await Cart.findOne({ user_id: userId, isExpress: false });

    if (!cart) {
        return apiResponse(res, true, 422, "Cart not found", [], []);
    }

    let cartItems = cart?.items;

    if (cartItems?.length) {
        return this.paymentOptions().then(async (gateways) => {
            let products = [],
                grandTotal = 0,
                base_total = 0,
                totalAddOnsPrice = 0;

            for (let i in cartItems) {
                const webinar = await Webinars.findById(cartItems[i]?.webinar);

                base_total = webinar?.price * cartItems[i]?.quantity;
                grandTotal = grandTotal + base_total;

                products?.push({
                    _id: webinar?._id,
                    title: webinar?.title,
                    slug: webinar?.slug,
                    description: webinar?.description,
                    image: webinar?.image,
                    time: webinar?.time,
                    date: webinar?.date,
                    category: webinar?.category,
                    speakers: webinar?.speakers,
                    price: webinar?.price,
                    quantity: cartItems[i]?.quantity,
                    selected_add_ons: cartItems[i]?.selected_add_ons,
                    status: webinar?.status,
                });
            }

            cart.grand_total = grandTotal;
            await cart.save();

            let prices = {
                base: base_total,
                add_ons: totalAddOnsPrice,
                grandTotal: grandTotal,
            };
            const response = {
                cart_id: cart?._id,
                payment_gateways: gateways,
                gateway: gateways[0],
                items: products,
                grand_total: grandTotal,
                summary: this.summaryHandler(prices),
            };
            apiResponse(
                res,
                true,
                200,
                "Cart summary",
                { cart_details: { ...response } },
                []
            );
        });
    } else {
        apiResponse(res, true, 200, "Cart is empty", [], []);
    }
};

exports.expressCartDetails = async (req, res) => {
    const token = req?.headers?.authorization?.split(" ")[1]; // Get token from headers
    const decodedToken = jwt.verify(token, "rajnishAppSecretToken"); // Verify the token
    const userId = decodedToken.userId; // Extract user ID from the token

    const { _id, add_ons, quantity } = req?.body;

    const webinar = await Webinars?.findById(_id);
    if (!webinar) {
        return res?.status(422)?.json({ error: "Webinar not found" });
    }

    // Remove any existing express cart for the user
    await Cart.deleteMany({ user_id: userId, isExpress: true });

    let totalAddOnsPrice = 0;
    const selectedAddOns = add_ons
        .map((add_on) => {
            const webinarAddOn = webinar?.add_ons?.find((item) =>
                new ObjectId(item?._id)?.equals(new ObjectId(add_on))
            );

            if (webinarAddOn) {
                totalAddOnsPrice += webinarAddOn?.price;
                return {
                    ...webinarAddOn,
                };
            }
            return null;
        })
        .filter(Boolean);

    let cart = new Cart({
        user_id: userId,
        items: [
            {
                webinar: webinar,
                quantity: quantity,
                selected_add_ons: selectedAddOns,
            },
        ],
        isExpress: true,
    });
    await cart.save();
    // cart.items.push({
    //     webinar: webinar,
    //     quantity: quantity,
    //     selected_add_ons: selectedAddOns,
    // });

    let cartItems = cart?.items;

    if (cartItems?.length) {
        return this.paymentOptions().then(async (gateways) => {
            let products = [],
                grandTotal = 0;

            products?.push({
                _id: webinar?._id,
                title: webinar?.title,
                slug: webinar?.slug,
                description: webinar?.description,
                image: webinar?.image,
                time: webinar?.time,
                date: webinar?.date,
                category: webinar?.category,
                speakers: webinar?.speakers,
                price: webinar?.price,
                quantity: quantity,
                status: webinar?.status,
                selected_add_ons: cartItems[0]?.selected_add_ons,
            });
            grandTotal = (webinar?.price + totalAddOnsPrice) * quantity;

            cart.grand_total = grandTotal;
            await cart.save();

            let prices = {
                base: webinar?.price * quantity,
                add_ons: totalAddOnsPrice * quantity,
                grandTotal: grandTotal,
            };

            const response = {
                cart_id: cart?._id,
                payment_gateways: gateways,
                gateway: gateways[0],
                items: products,
                grand_total: grandTotal,
                summary: this.summaryHandler(prices),
            };
            apiResponse(
                res,
                true,
                200,
                "Cart summary",
                { cart_details: { ...response } },
                []
            );
        });
    } else {
        apiResponse(res, true, 200, "Cart is empty", [], []);
    }
};

exports.itemAddOns = (price) => {
    let options = [
        { label: "LIVE", value: price },
        { label: "On-Demand", value: price },
        { label: "DVD", value: price },
        { label: "e-TRANSCRIPT", value: price },
        { label: "LIVE + DVD", value: price },
        { label: "DVD + e-TRANSCRIPT", value: price },
        { label: "LIVE + e-TRANSCRIPT", value: price },
        { label: "LIVE + DVD + e-TRANSCRIPT", value: price },
        { label: "DVD with Copyright", value: price },
        { label: "Web Download", value: price },
        { label: "Web Download + DVD", value: price },
        { label: "On-Demand + DVD", value: price },
        { label: "On-Demand + Transcript", value: price },
        { label: "Web Download + e-Transcript", value: price },
        { label: "LIVE + Web Download", value: price },
        { label: "On-Demand + DVD + Transcript", value: price },
        { label: "On-Demand + Web Download", value: price },
    ];
    return options;
};
