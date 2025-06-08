const { Router } = require("express");

const contactController = require("../controllers/contactController");
const { contactDetailsExistence } = require("../helpers/validations");

const router = Router();

//get contact us details
router.get("/details", contactController?.getContactDetails);

//add contact details
router.post("/add", contactDetailsExistence, contactController?.postAddContact);

//contact us form submit
router.post("/submit", contactController?.postContactForm);

module.exports = router;
