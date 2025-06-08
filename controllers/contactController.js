const AddContact = require("../models/contactUs/AddContact");
const ContactForm = require("../models/contactUs/ContactForm");

const { apiResponse } = require("../helpers/apiResponse");

exports.getContactDetails = (req, res, next) => {
    AddContact.find()
        .then((result) => {
            apiResponse(
                res,
                true,
                200,
                "Contact details",

                {
                    contact_details: { ...result[0]?._doc },
                }
            );
        })
        .catch((err) => {});
};

exports.postAddContact = (req, res, next) => {
    const { mobile, email } = req?.body;
    const details = new AddContact({ mobile, email });

    return details
        .save()
        .then((result) => {
            apiResponse(res, true, 200, "Contact details added successfully!", {
                contact_details: [result],
            });
        })
        .catch((err) => {
            apiResponse(
                res,
                true,
                422,
                "Provide with the correct data.",
                [],
                ["Provide with the correct data."]
            );
        });
};

exports.postContactForm = (req, res, next) => {
    const { name, mobile, email, message } = req?.body;
    const contactUs = new ContactForm({
        name,
        mobile,
        email,
        message,
        status: 1,
    });

    contactUs
        .save()
        .then((result) => {
            apiResponse(res, true, 200, "Inquiry form submit successfully", {
                form_details: { ...result?._doc },
            });
        })
        .catch((err) => {
            apiResponse(res, true, 500, [], {
                message: "Internal Server error",
            });
        });
};
