//consists of features, whu-us, about,testimonials routes

const { Router } = require("express");

const otherController = require("../controllers/otherController");
const cartController = require("../controllers/cartController/cartController");

const router = Router();

//why-us section
router.get("/why-us", otherController?.whyUsList);
router.post("/why-us/add", otherController?.addWhyUs);

router.post("/payment-gateways", cartController?.paymentGateways);

module.exports = router;
