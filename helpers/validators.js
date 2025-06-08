exports.validateEmail = (v) => {
    const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(v).toLowerCase());
};
exports.validatePassword = (v) => {
    const re =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#\S]{8,}$/;
    return re.test(v);
};
exports.validateMobile = (v, regex) => {
    if (regex) {
        const re = new RegExp(regex);
        return re.test(v);
    }

    // $regex = "/^[5-9][0-9]{7,9}$/";
    const re = /(^\d{10}$)/;
    return re.test(v);
};
exports.validateName = (v) => {
    // const re = /^[a-zA-Z]*[']?[ ]?[a-zA-Z]*[']?[ ]?[a-zA-Z]*$/;

    // let test1 = re.test(v);
    let test2 = v?.length >= 2 && v?.length < 40;
    return test2;
};

exports.stringChecker = (str) => {
    let regex = /\s/g;
    // return !str ||regex.test(str);
    // return str.replace(regex, "") == "";
    return Boolean(str?.trim().length);
};
