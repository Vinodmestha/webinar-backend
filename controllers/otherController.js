const WhyUsAdd = require("../models/whyUs/add");

exports.whyUsList = (req, res, next) => {
    WhyUsAdd.find()
        .then((result) => {
            apiResponse(res, true, 200, "Why us feature", {
                why_us: [...result],
            });
        })
        .catch((err) => {
            apiResponse(res, true, 500, "Internal Server error", {}, [err]);
        });
};

exports.addWhyUs = (req, res, next) => {
    const { label, icon, desc } = req?.body;
    const whyUs = new WhyUsAdd({ label, icon, desc });
    whyUs
        .save()
        .then((result) => {
            apiResponse(res, true, 201, "Why us feature added", {
                why_us: [result],
            });
        })
        .catch((err) => {
            apiResponse(res, true, 500, "Why us feature added", {}, [err]);
        });
};

const { apiResponse } = require("../helpers/apiResponse");
