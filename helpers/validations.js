const AddContact = require("../models/contactUs/AddContact");
const { apiResponse } = require("./apiResponse");

exports.contactDetailsExistence = async (req, res, next) => {
    try {
        const existingContact = await AddContact.findOne();
        if (existingContact) {
            return apiResponse(res, true, 400, [], {
                contact_details:
                    "Contact details already exist. Cannot create more.",
            });
        }
        next();
    } catch (error) {
        apiResponse(res, true, 500, [], "Internal server error");
    }
};
