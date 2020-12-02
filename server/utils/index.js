const crypto = require("crypto");

exports.$try = fn => (...args) => {
	return fn(...args).then(r => { return r; }).catch(e => { console.error(e); return false; });
}

exports.getArrayDiff = (a, b) => {
    return a.filter(e => !b.includes(e)).concat(b.filter(e => !a.includes(e)));
}

exports.getFutureDate = ({seconds = 0, minutes = 0, hours = 0, days = 0, months = 0} = {}) => {
    let date = new Date();
    date.setSeconds(date.getSeconds() + seconds);
    date.setMinutes(date.getMinutes() + minutes);
    date.setHours(date.getHours() + hours);
    date.setDate(date.getDate() + days);
    date.setMonth(date.getMonth() + months);
    return date;
}

exports.getIsoDate = (date) => {
    const isoDate = new Date(`${date ? date : new Date()}${date ? " UTC" : ""}`).toISOString();
    return `${isoDate.substring(0, 10)} ${isoDate.substring(11, 19)}`;
}

exports.handleErrors = fn => (req, res) => {
    fn(req, res).catch(e => {
        console.error(e);
        return res.send({ success: false, message: e.message });
    });
}

exports.hash = (method, input, outputType = "hex") => {
    return crypto.createHash(method).update(input).digest(outputType);
}

exports.randomBase64 = (length) => {
    return crypto.randomBytes(length).toString("base64");
}

exports.uniqueArrayFilter = (...arrays) => {
    const all = [].concat(...arrays);
    const nonUnique = all.filter((set => value => set.has(value) || !set.add(value))(new Set));
    return all.filter(e => !nonUnique.includes(e));
}

exports.uniqueArrayMerge = (oldArray, newArrays) => {
    return [...new Set([...new Set(oldArray), ...[].concat(...newArrays)])];
}

exports.validate = (input, type) => {
    switch (type) {
        case "email":
            return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(input);
        case "url":
            return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(input);
        default:
    }
}

exports.validateBookmark = (res, title, pageUrl) => {
    if (!title || !pageUrl) { res.send({ success: false, message: "Title and URL fields are required" }); return false; }
    if (title.length > 255) { res.send({ success: false, message: "Title cannot be more than 255 characters" }); return false; }
    if (pageUrl.length > 255) { res.send({ success: false, message: "Page URL cannot be more than 2083 characters" }); return false; }
    if (!this.validate(pageUrl, "url")) { res.send({ success: false, message: "Invalid page URL" }); return false; }
    return true;
}

exports.validateSession = (req) => {
    if (!req.session.uid) { throw new Error("Unauthorized access"); }
    return true;
}