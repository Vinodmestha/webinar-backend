const Speakers = require("../models/speakers/add");

const { apiResponse } = require("../helpers/apiResponse");

//get all speakers
exports.getSpeakers = (req, res, next) => {
    Speakers.find()
        .then((result) => {
            apiResponse(res, true, 200, "Speakers list", {
                speakers: [...result],
            });
        })
        .catch(() => {});
};

exports.postAddSpeakers = (req, res, next) => {
    const { name, slug, image, about, designation } = req?.body;
    const speaker = new Speakers({
        name,
        about,
        image,
        slug,
        designation,
    });

    speaker
        .save()
        .then((result) => {
            apiResponse(res, true, 201, "Speaker added successfully!", {
                speakers: [result],
            });
        })
        .catch((err) => {
            apiResponse(res, false, 500, "Speakers list", [], [err]);
        });
};

exports.postSpeakersDetails = (req, res, next) => {
    let speakerId = req?.body?.speaker_id;

    if (speakerId) {
        return Speakers.findById(speakerId)
            .then((result) => {
                apiResponse(res, true, 200, "Speakers details", {
                    details: result,
                });
            })
            .catch((err) => {
                apiResponse(
                    res,
                    false,
                    500,
                    "Internal Server error",
                    [],
                    [err]
                );
            });
    }
    return apiResponse(res, false, 422, "Speaker id is required", null, {
        speaker_id: "speaker id is required",
    });
};
