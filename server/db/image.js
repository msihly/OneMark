const conn = require("./index.js").db;
const { getIsoDate } = require("../utils");

exports.getImages = async ({ imageHash, imageIds = [] }) => {
    const sql = `SELECT     *
                FROM        images AS i
                ${imageIds.length > 0
                    ? `WHERE i.imageId IN (?${", ?".repeat(imageIds.length - 1)})`
                    : (imageHash ? `WHERE i.imageHash = ?` : "")
                };`;
    const [images,] = await conn.query(sql, imageIds.length > 0 ? imageIds : [imageHash]);
    return images;
};

exports.uploadImage = async ({ imageSize, imageUrl, imageHash }) => {
    const sql = `INSERT INTO images (dateCreated, imageSize, imageUrl, imageHash) VALUES (?, ?, ?, ?);`;
    const [{ insertId: imageId },] = await conn.query(sql, [getIsoDate(), imageSize, imageUrl, imageHash]);
    return imageId;
};