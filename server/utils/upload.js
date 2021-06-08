const AWS = require("aws-sdk");
const db = require("../db");
const { formatBytes, hash } = require("../utils");
const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_BUCKET, S3_REGION } = process.env;

AWS.config.update({
    region: S3_REGION,
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
});

const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

const extensions = ["jpg", "jpeg", "png"];
const maxImageSize = 2097152;

exports.uploadImage = async (image) => {
    if (image === undefined) return { imageId: null, imageUrl: null, imageSize: 0 };

    const { buffer, mimetype, originalname: originalName, size: imageSize } = image;
    const ext = originalName.split(".").pop();

    if (!extensions.includes(ext)) throw new Error(`Image extension not allowed: ${mimetype}`);
    if (imageSize > maxImageSize) throw new Error(`Image size [${formatBytes(imageSize)}] cannot exceed ${formatBytes(maxImageSize)}`);

    const imageHash = hash("md5", buffer);

    const existingEntries = await db.getImages({ imageHash });
    if (existingEntries.length > 0) {
        const { imageId, imageUrl, imageSize } = existingEntries[0];
        return { imageId, imageUrl, imageSize };
    }

    const path = `uploads/${imageHash.substr(0, 2)}/${imageHash.substr(2, 2)}/${imageHash}.${ext}`;
    const imageUrl = `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${path}`;

    await s3.putObject({ Bucket: S3_BUCKET, Key: path, Body: buffer, ACL: "public-read" }).promise();
    const imageId = await db.uploadImage({ originalName, imageUrl, imageHash, imageSize });

    return { imageId, imageUrl, imageSize };
};