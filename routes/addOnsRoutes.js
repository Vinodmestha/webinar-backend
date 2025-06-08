const { Router } = require("express");

const addOnsController = require("../controllers/addOnsController");

const router = Router();

//add ons add
router.post("/add", addOnsController.postAddOns);

//addons list
router.post("/list", addOnsController.addOnsList);

module.exports = router;
