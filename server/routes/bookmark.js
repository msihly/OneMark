try {
    const db = require("../db/functions.js");
    const app = require("../index.js").app;
    const { uploadFile } = require("../db/upload.js");
    const { $try, getArrayDiff, getIsoDate, handleErrors, validateBookmark, validateSession } = require("../utils");

    app.get("/api/bookmarks", handleErrors(async (req, res) => {
        validateSession(req);
        const bookmarks = await db.getAllBookmarks(req.session.uid);
        return res.send({ success: true, bookmarks });
    }));

    app.post("/api/bookmark", handleErrors(async (req, res) => {
        validateSession(req);
        let { title, pageUrl, tags } = req.body;
        tags = JSON.parse(tags);
        if (!validateBookmark(res, title, pageUrl)) { throw new Error("Invalid bookmark"); }

        const uploadResult = await uploadFile(req.files);
        if (!uploadResult.success) { throw new Error(uploadResult.errors); }
        const { imageId, imagePath, imageSize } = uploadResult;

        const date = getIsoDate();
        const bookmarkId = await db.uploadBookmark(req.session.uid, imageId, title, pageUrl, date, date);
        if (tags.length > 0) { await db.addBookmarkTags(bookmarkId, tags); }

        return res.send({ success: true, bookmark: { bookmarkId, title, pageUrl, imagePath, imageSize, dateCreated: date, dateModified: date, views: 0, tags } });
    }));

    app.post("/api/ext/bookmark", handleErrors(async (req, res) => {
        if (!req.headers.authorization) { throw new Error("No authorization header set"); }
        const token = req.headers.authorization.split(" ")[1];
        const userId = await db.validateToken(token);
        if (!userId) { throw new Error("Invalid AuthToken provided"); }

        let { title, pageUrl, tags } = req.body;
        tags = JSON.parse(tags);
        if (!validateBookmark(res, title, pageUrl)) { throw new Error("Invalid bookmark"); }
        if (await db.checkBookmarkExists(userId, pageUrl) !== false) { throw new Error("Bookmark already exists"); }

        const uploadResult = await uploadFile(req.files);
        if (!uploadResult.success) { throw new Error(uploadResult.errors); }
        const { imageId, imagePath, imageSize } = uploadResult;

        const date = getIsoDate();
        const bookmarkId = await db.uploadBookmark(userId, imageId, title, pageUrl, date, date);
        if (!bookmarkId) { throw new Error("Failed to upload bookmark"); }
        if (tags.length > 0) { await db.addBookmarkTags(bookmarkId, tags); }

        return res.send({ success: true, bookmark: { bookmarkId, title, pageUrl, imagePath, imageSize, dateCreated: date, dateModified: date, views: 0, tags } });
    }));

    app.put("/api/bookmark/:id", handleErrors(async (req, res) => {
        validateSession(req);
        let { bookmarkId, title, pageUrl, tags, isImageRemoved } = req.body;
        bookmarkId = +bookmarkId;
        tags = JSON.parse(tags);
        if (!validateBookmark(res, title, pageUrl)) { throw new Error("Invalid bookmark"); }

        const bookmark = await db.getBookmark(bookmarkId);
        const curTags = await db.getAllBookmarkTags(bookmarkId);
        let { imageId, imagePath: curImagePath, imageSize, title: curTitle, pageUrl: curPageUrl, dateCreated } = bookmark;

        const hasDiffs = (title == curTitle && pageUrl == curPageUrl && getArrayDiff(tags, curTags).length === 0);
        if (hasDiffs && req.files.length === 0 && isImageRemoved == "false") { throw new Error("No changes made"); }

        let imagePath;
        if (req.files.length > 0) {
            let uploadResult = await uploadFile(req.files);
            if (!uploadResult.success) { throw new Error(uploadResult.errors); }
            ({ imageId, imagePath, imageSize } = uploadResult);
        } else if (isImageRemoved == "true") {
            [imageId, imagePath, imageSize] = [2, "../media/no-image.svg", 0];
        } else {
            imagePath = curImagePath;
        }

        if (hasDiffs && imagePath === curImagePath) { throw new Error("No changes made"); }

        let dateModified = await db.editBookmark(bookmarkId, req.session.uid, title, pageUrl, imageId, tags);
        return res.send({ success: true, bookmark: { bookmarkId, title, pageUrl, imagePath, imageSize, dateCreated, dateModified, tags } });
    }));

    app.put("/api/bookmark/:id/view", handleErrors(async (req, res) => {
        validateSession(req);
        await db.addView(req.params.id, req.session.uid);
        return res.send({ success: true, message: `Bookmark #${req.params.id} view count incremented` });
    }));

    app.put("/api/bookmarks/tags", handleErrors(async (req, res) => {
        validateSession(req);
        let { bookmarkIds, addedTags, removedTags } = req.body;
        [bookmarkIds, addedTags, removedTags] = [JSON.parse(bookmarkIds), JSON.parse(addedTags), JSON.parse(removedTags)];
        let dateModified = await db.editMultiBookmarkTags(bookmarkIds, addedTags, removedTags);
        return res.send({ success: true, bookmarkIds, addedTags, removedTags, dateModified });
    }));

    app.delete("/api/bookmarks", handleErrors(async (req, res) => {
        validateSession(req);
        let { bookmarkIds } = req.body;
        bookmarkIds = JSON.parse(bookmarkIds);
        await db.deleteBookmarks(bookmarkIds);
        return res.send({ success: true, bookmarkIds });
    }));

    app.delete("/api/bookmark/:id", handleErrors(async (req, res) => {
        validateSession(req);
        await db.deleteBookmark(req.params.id);
        return res.send({ success: true, message: `Bookmark #${req.params.id} deleted`});
    }));
} catch (e) { console.error(e); }