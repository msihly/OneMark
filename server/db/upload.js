try {
    const AWS = require("aws-sdk");
    const db = require("../db/functions.js");
    const { hash } = require("../utils");
    const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_BUCKET, S3_REGION } = process.env;

    AWS.config.update({
        region: S3_REGION,
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
    });
    const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

    const extensions = ["jpg", "jpeg", "png"],
          maxImageSize = 2097152;

    exports.uploadFile = async (files) => {
        if (files.length === 0) { return { success: true, imageId: 2, imagePath: "../images/no-image.svg", imageSize: 0 }; }

        let errors = [];
        const name = files[0].originalname;
        const ext = name.split(".").pop();
        const type = files[0].mimetype;
        const size = files[0].size;

        if (!extensions.includes(ext)) { errors.push(`Image extension not allowed: ${name} | ${type}`); }
        if (size > maxImageSize) { errors.push(`Image size exceeds limit: ${name} | ${size} bytes`); }
        if (errors.length > 0) { return { success: false, errors }; }

        const imageHash = hash("md5", files[0].buffer);
        const dupeResult = await db.lookupImageHash(imageHash);
        if (dupeResult) { return { success: true, imageId: dupeResult.imageId, imagePath: dupeResult.imagePath }; }

        const path = `uploads/${imageHash.substr(0, 2)}/${imageHash.substr(2, 2)}/${imageHash}.${ext}`;
        const url = `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${path}`;

        await s3.putObject({ Bucket: S3_BUCKET, Key: path, Body: files[0].buffer, ACL: "public-read" }).promise();
        const imageId = await db.uploadImage(url, imageHash, size);

        return { success: true, imageId, imagePath: url, imageSize: size };
    }
} catch (e) { console.error(e); return false; }