const router = require("express").Router();

const webinarRoutes = require("./webinarRoutes");
const speakerRoutes = require("./speakerRoutes");
const contactRoutes = require("./contactRoutes");
const authRoutes = require("./authRoutes");
const otherRoutes = require("./others");

const cartRoutes = require("./cartRoutes/cartRoutes");
const expressCartRoutes = require("./cartRoutes/expressCartRoutes");

router.use("/webinars", webinarRoutes);
router.use("/speakers", speakerRoutes);
router.use("/contact", contactRoutes);
router.use("/auth", authRoutes);

//cart routes
router.use("/express-cart", expressCartRoutes);
router.use("/cart", cartRoutes);

router.use("/", otherRoutes);

module.exports = router;
