const { Router } = require("express");

const speakerController = require("../controllers/speakerController");
const { tokenAuth } = require("../middleware/tokenAuth");

const router = Router();

//speakers list
router.get("/list", speakerController?.getSpeakers);

//add new speaker
router.post("/add", tokenAuth, speakerController?.postAddSpeakers);

//get speaker details
router.post("/details", speakerController?.postSpeakersDetails);

module.exports = router;
