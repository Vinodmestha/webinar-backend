const { Router } = require("express");

const { tokenAuth } = require("../../middleware/tokenAuth");
const cartController = require("../../controllers/cartController/cartController");
const orderController = require("../../controllers/orders/orderController");

const router = Router();

router.get("/summary", tokenAuth, cartController?.cartSummary);
router.post("/add", tokenAuth, cartController?.addToCart);
router.post("/update", tokenAuth, cartController?.updateCart);
router.post("/remove-item", tokenAuth, cartController?.removeItem);
router.post("/remove-all", tokenAuth, cartController?.emptyCart);
router.get("/count", tokenAuth, cartController?.cartCount);

//orderroute
router.post("/create-order", tokenAuth, orderController?.createOrderController);
router.post(
    "/capture-order",
    tokenAuth,
    orderController?.captureOrderController
);

module.exports = router;
