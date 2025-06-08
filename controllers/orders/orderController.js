const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));
const jwt = require("jsonwebtoken");

const path = require("path");
const express = require("express");
const app = express();
const { apiResponse } = require("../../helpers/apiResponse");
const Cart = require("../../models/cart/cart");
const Orders = require("../../models/payments/orders");

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, JWT_SECRET, BASE_URL } =
    process.env;
// console.log("payment", PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, BASE_URL);

app.use(express.static("client"));
app.use(express.json());

const generateAccessToken = async () => {
    try {
        if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
            throw new Error("MISSING_API_CREDENTIALS");
        }
        const auth = Buffer.from(
            PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET
        ).toString("base64");
        const response = await fetch(`${BASE_URL}/v1/oauth2/token`, {
            method: "POST",
            body: "grant_type=client_credentials",
            headers: {
                Authorization: `Basic ${auth}`,
            },
        });

        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error("Failed to generate Access Token:", error);
    }
};
const handleResponse = async (res) => {
    try {
        const response = await res.json(),
            statusCode = res.status;
        return {
            response,
            statusCode,
        };
    } catch (err) {
        const errorMessage = await res.text();
        throw new Error(errorMessage);
    }
};

// createOrder
const createOrder = async (cart_id, userId) => {
    const cart = await Cart?.findOne({
        _id: cart_id,
        user_id: userId,
    });

    const accessToken = await generateAccessToken();
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
    };
    const order_url = `${BASE_URL}/v2/checkout/orders`;

    const orderPayload = {
        intent: "CAPTURE",
        purchase_units: [
            {
                amount: {
                    currency_code: "USD",
                    value: cart?.grand_total,
                },
            },
        ],
    };

    const orderResponse = await fetch(order_url, {
        headers: { ...headers },
        method: "POST",
        body: JSON.stringify(orderPayload),
    });

    return handleResponse(orderResponse).then(
        async ({ response, statusCode }) => {
            // if (statusCode === 201) {
            const details_url = `${BASE_URL}/v2/checkout/orders/${response?.id}`;
            const detailsResponse = await fetch(details_url, {
                headers: { ...headers },
                method: "GET",
            });
            let orderDetails = handleResponse(detailsResponse);
            return orderDetails;
            // }
        }
    );

    // Create the order object
    //             const order = new OrderSchema({
    //                 cart: cart._id,
    //                 items: orderItems,
    //                 total: orderTotal,
    //             });

    //             // Save the order to MongoDB
    //             const savedOrder = await order.save();
    //             console.log({ savedOrder });
    //             // return savedOrder;
};
exports.createOrderController = async (req, res) => {
    try {
        const token = req?.headers?.authorization?.split(" ")[1];
        const decodedToken = jwt?.verify(token, JWT_SECRET);
        const userId = decodedToken.userId;

        const { cart_id } = req.body;
        const { response, statusCode } = await createOrder(cart_id, userId);

        const result = {
            order_id: response?.id,
            currency: response?.purchase_units[0]?.amount?.currency_code,
            amount: response?.purchase_units[0]?.amount?.value,
            email_address: response?.purchase_units[0]?.payee?.email_address,
            merchant_id: response?.purchase_units[0]?.payee?.merchant_id,
        };
        apiResponse(
            res,
            true,
            statusCode,
            "Order Created Successfully",
            result,
            []
        );
    } catch (error) {
        apiResponse(res, true, 500, "Failed to create order.", [], []);
    }
};

// captureOrder
const captureOrder = async (orderID) => {
    const accessToken = await generateAccessToken();
    const url = `${BASE_URL}/v2/checkout/orders/${orderID}/capture`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });

    return handleResponse(response);
};
exports.captureOrderController = async (req, res) => {
    try {
        const { order_id } = req?.body;
        const { response, statusCode } = await captureOrder(order_id);

        // const order = new Orders({})

        let result = {
            order_id: response?.id,
            customer_details: {
                firstName: response?.payer?.name?.given_name,
                lastName: response?.payer?.name?.surname,
                email: response?.payer?.email_address,
            },
            payment_details: {
                id: response?.id,
                status: response?.purchase_units[0]?.payments?.captures[0]
                    ?.status,
                address: response?.purchase_units[0]?.shipping?.address,
                summary:
                    response?.purchase_units[0]?.payments?.captures[0]
                        ?.seller_receivable_breakdown,
            },
            create_at:
                response?.purchase_units[0]?.payments?.captures[0]?.create_time,
            update_at:
                response?.purchase_units[0]?.payments?.captures[0]?.update_time,

            // payment_source: response?.payment_source,
            // reference_id: response?.purchase_units[0]?.reference_id,
            // payment_id: response?.purchase_units[0]?.payments?.captures[0]?.id,
            // status: response?.status,
            // payer: response?.payer,
            // payer_id: response?.payer?.payer_id,
        };
        // console.log("result", result);
        apiResponse(res, true, statusCode, "Payment Successful", result, []);
    } catch (error) {
        apiResponse(res, true, 500, "Failed to capture order.", [], []);
    }
};
