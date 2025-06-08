const AddOns = require("../models/webinars/addOns");

const { apiResponse } = require("../helpers/apiResponse");

exports.postAddOns = (req, res, next) => {
    const { label } = req?.body;
    const addOns = new AddOns({ label });

    addOns
        .save()
        .then((result) => {
            console.log(result);
            apiResponse(
                res,
                true,
                201,
                "Webinar addons added successfully!",
                [],
                // {
                //     webinars: WebinarAdd?.find({ category }).then((res) => {
                //         return res;
                //     }),
                // }
                []
            );
        })
        .catch((err) => {
            if (!err?.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.addOnsList = (req, res, next) => {
    AddOns.find()
        .then((result) => {
            apiResponse(res, true, 200, "Add ons list", {
                types: result,
            });
        })
        .catch(() => {});
};
