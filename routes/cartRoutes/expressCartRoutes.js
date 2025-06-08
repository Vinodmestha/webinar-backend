const { Router } = require("express");

const { tokenAuth } = require("../../middleware/tokenAuth");
const expressCartController = require("../../controllers/cartController/expressCartController");

const router = Router();

router.post("/add", tokenAuth, expressCartController?.addToExpressCart);
router.post("/update", tokenAuth, expressCartController?.updateExpressCart);

module.exports = router;
