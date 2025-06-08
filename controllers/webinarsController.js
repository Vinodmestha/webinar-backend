const WebinarAdd = require("../models/webinars/add");
const Types = require("../models/webinars/types");
const AddOns = require("../models/webinars/addOns");

const { apiResponse } = require("../helpers/apiResponse");

exports.types = (req, res, next) => {
    Types.find()
        .then((result) => {
            apiResponse(res, true, 200, "Types list", {
                types: result,
            });
        })
        .catch(() => {});
};

exports.addTypes = (req, res, next) => {
    const { label, slug, image } = req?.body;
    const types = new Types({ label, slug, image });

    types
        .save()
        .then((result) => {
            apiResponse(res, true, 201, "Types added successfully!", {
                types: [result],
            });
        })
        .catch(() => {});
};

exports.postWebinarsList = (req, res, next) => {
    const { webinar_type } = req?.body;

    WebinarAdd.find({ category: webinar_type }).then((response) => {
        let result = [];

        for (let i in response) {
            if (response[i]?.status) {
                result?.push(response[i]);
            }
        }

        return apiResponse(res, true, 200, "Webinars list", {
            webinars: [...result],
        });
    });
};

exports.postAddWebinar = async (req, res, next) => {
    // const errors = "validations(req)";
    // if (!errors?.isEmpty()) {
    //     const error = new Error("Validations failed!!");
    //     error.statusCode = 422;
    //     throw error;
    // }

    const {
        title,
        slug,
        description,
        speakers,
        image,
        price,
        category,
        webinar_info,
    } = req?.body;
    // console.log(webinar_info);

    // Fetch all addons from the Addon collection
    const addons = await AddOns.find();
    // Map the addons to the required format
    const formattedAddons = addons.map((addon) => ({
        _id: addon?._id,
        label: addon?.label,
    }));

    const webinar = new WebinarAdd({
        title: title,
        slug: slug,
        description: description,
        image: image,
        date: new Date(),
        category: category,
        speakers: speakers,
        price: price,
        webinar_info: webinar_info,
        add_ons: formattedAddons,
    });
    webinar
        .save()
        .then((result) => {
            apiResponse(
                res,
                true,
                201,
                "Webinar added successfully!",
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

// exports.postUpdateWebinar = (req, res, next) => {
//     WebinarAdd?.updateMany(
//         { image: req?.file?.path },
//         // { $set: { image: req?.file?.path } },
//         (err, result) => {
//             if (err) {
//                 console.error("Error:", err);
//             } else {
//                 console.log("Documents updated successfully:", result);
//             }
//         }
//     );
// };

exports.postUpdateWebinar = async (req, res, next) => {
    try {
        const { _id, addons: updatedAddons, ...updateData } = req.body;

        let webinar = await WebinarAdd.findById(_id);
        if (!webinar) {
            return res.status(404).json({ error: "Webinar not found." });
        }
        // Update general webinar fields
        Object.assign(webinar, updateData);

        //also for updating multiple key:value pair
        // const webinar = await WebinarAdd.findByIdAndUpdate(_id, updateData, {
        //     new: true,
        // });
        if (updatedAddons) {
            // Fetch all addons from the Addon collection
            const allAddons = await AddOns.find();

            // Map the existing webinar addons to a dictionary for quick lookup
            const existingAddonsMap = new Map(
                webinar["add_ons"].map((addon) => [
                    addon.label.toString(),
                    addon,
                ])
            );

            // Map the updated addons to a dictionary for quick lookup
            const updatedAddonsMap = new Map(
                updatedAddons.map((addon) => [addon._id, addon])
            );

            // Create a new array of addons that includes all addons
            const combinedAddons = allAddons.map((addon) => {
                const existingAddon = existingAddonsMap.get(
                    addon._id.toString()
                );
                const updatedAddon = updatedAddonsMap.get(addon._id.toString());
                // Use the updated price if provided, otherwise use the existing one or no price
                return {
                    _id: addon._id,
                    label: addon.label,
                    price: updatedAddon
                        ? updatedAddon.price
                        : existingAddon
                        ? existingAddon.price
                        : undefined,
                };
            });

            webinar["add_ons"] = combinedAddons;
        }
        await webinar.save();

        res.status(200).json(webinar);
    } catch (error) {
        res.status(500).json({ error: "Failed to update webinar." });
    }
};

exports.postWebinarDetails = (req, res, next) => {
    let webinarId = req?.body?.webinar_id;

    if (webinarId) {
        return WebinarAdd.findById(webinarId)
            .then((result) => {
                apiResponse(res, true, 200, "Details of webinar", {
                    details: result,
                });
            })
            .catch((err) => {});
    }
    return apiResponse(res, false, 422, "Webinar id is required", [], {
        webinar_id: "webinar id is required",
    });
};
