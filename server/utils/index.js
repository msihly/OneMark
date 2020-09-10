const crypto = require("crypto");

exports.$try = fn => (...args) => {
	return fn(...args).then(r => { return r; }).catch(e => { console.error(e.message); return false; });
};

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

exports.getUniqueArray = (...arrays) => {
    const all = [].concat(...arrays);
    const nonUnique = all.filter((set => value => set.has(value) || !set.add(value))(new Set));
    return all.filter(e => !nonUnique.includes(e));
}

exports.hash = (method, input, outputType = "hex") => {
    try { return crypto.createHash(method).update(input).digest(outputType); }
    catch (e) { return console.log(e); }
}

exports.randomBase64 = (length) => {
    try { return crypto.randomBytes(length).toString("base64"); }
    catch (e) { return console.log(e); }
}

exports.validate = (input, type) => {
    switch (type) {
        case "email": return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(input);
        case "url": return /^[A-Za-z][A-Za-z\d.+-]*:\/*(?:\w+(?::\w+)?@)?[^\s/]+(?::\d+)?(?:\/[\w#!:.?+=&%@\-/]*)?$/.test(input);
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