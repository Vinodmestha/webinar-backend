exports.apiResponse = (res, status, code, msg, data, error) => {
    return res.status(code).json({
        status: status,
        message: msg,
        data: data ? { ...data } : [],
        error: error ?? [],
    });
};
