const { Router } = require("express");

const webinarsController = require("../controllers/webinarsController");

const router = Router();
const addOnsRoutes = require("./addOnsRoutes");

router.get("/types", webinarsController.types);

router.post("/types/add", webinarsController.addTypes);

// get webinars
router.post("/list", webinarsController.postWebinarsList);

//add new webinar
router.post("/add", webinarsController.postAddWebinar);

//update webinars list
router.post("/update", webinarsController.postUpdateWebinar);

//details
router.post("/details", webinarsController.postWebinarDetails);

//add ons
router.use("/add-ons", addOnsRoutes);

module.exports = router;
