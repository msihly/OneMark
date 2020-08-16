try {
    const db = require("../db/functions.js");
    const app = require("../index.js").app;
    const { uploadFile } = require("../db/upload.js");
    const { $try, getArrayDiff, getIsoDate, validateBookmark, validateSession } = require("../utils");

    app.get("/api/bookmarks", async (req, res) => {
        try {
            validateSession(req);
            const bookmarks = await $try(db.getAllBookmarks)(req.session.uid);
            return res.send({ success: true, bookmarks });
        } catch (e) { console.error(e); return res.send({ success: false, message: e.message }); }
    });

    app.post("/api/bookmark", async (req, res) => {
        try {
            validateSession(req);
            let { title, pageUrl, tags } = req.body;
            tags = JSON.parse(tags);
            if (!validateBookmark(res, title, pageUrl)) { throw new Error("Invalid bookmark"); }

            const uploadResult = await $try(uploadFile)(req.files);
            if (!uploadResult.success) { throw new Error(uploadResult.errors); }
            const { imageId, imagePath, imageSize } = uploadResult;

            const date = getIsoDate();
            const bookmarkId = await $try(db.uploadBookmark)(req.session.uid, imageId, title, pageUrl, date, date);
            if (tags.length > 0) { await $try(db.addBookmarkTags)(bookmarkId, tags); }

            return res.send({ success: true, bookmark: { bookmarkId, title, pageUrl, imagePath, imageSize, dateCreated: date, dateModified: date, views: 0, tags } });
        } catch (e) { console.error(e); return res.send({ success: false, message: e.message }); }
    });

    app.post("/api/ext/bookmark", async (req, res) => {
        try {
            if (!req.headers.authorization) { throw new Error("No authorization header set"); }
            const token = req.headers.authorization.split(" ")[1];
            const userId = await $try(db.validateToken)(token);
            if (!userId) { throw new Error("Invalid AuthToken provided"); }

            let { title, pageUrl, tags } = req.body;
            console.log(tags);
            tags = JSON.parse(tags);
            if (!validateBookmark(res, title, pageUrl)) { throw new Error("Invalid bookmark"); }
            if (await $try(db.checkBookmarkExists)(userId, pageUrl) !== false) { throw new Error("Bookmark already exists"); }

            const uploadResult = await $try(uploadFile)(req.files);
            if (!uploadResult.success) { throw new Error(uploadResult.errors); }
            const { imageId, imagePath, imageSize } = uploadResult;

            const date = getIsoDate();
            const bookmarkId = await $try(db.uploadBookmark)(userId, imageId, title, pageUrl, date, date);
            if (!bookmarkId) { throw new Error("Failed to upload bookmark"); }
            if (tags.length > 0) { await $try(db.addBookmarkTags)(bookmarkId, tags); }

            return res.send({ success: true, bookmark: { bookmarkId, title, pageUrl, imagePath, imageSize, dateCreated: date, dateModified: date, views: 0, tags } });
        } catch (e) { console.error(e); return res.send({ success: false, message: e.message }); }
    });

    app.put("/api/bookmark/:id", async (req, res) => {
        try {
            if (!validateSession(req, res)) { throw new Error("User not signed in"); }
            let { bookmarkId, title, pageUrl, tags, isImageRemoved } = req.body;
            bookmarkId = +bookmarkId;
            tags = JSON.parse(tags);
            if (!validateBookmark(res, title, pageUrl)) { throw new Error("Invalid bookmark"); }

            const bookmark = await $try(db.getBookmark)(bookmarkId);
            const curTags = await $try(db.getAllBookmarkTags)(bookmarkId);
            let { imageId, imagePath: curImagePath, title: curTitle, pageUrl: curPageUrl, dateCreated } = bookmark;

            const hasDiffs = (title == curTitle && pageUrl == curPageUrl && getArrayDiff(tags, curTags).length === 0);
            if (hasDiffs && req.files.length === 0 && isImageRemoved == "false") { throw new Error("No changes made"); }

            let imagePath, imageSize;
            if (req.files.length > 0) {
                let uploadResult = await $try(uploadFile)(req.files);
                if (!uploadResult.success) { throw new Error(uploadResult.errors); }
                ({ imageId, imagePath, imageSize } = uploadResult);
            } else if (isImageRemoved == "true") {
                [imageId, imagePath, imageSize] = [2, "../images/No-Image.jpg", 0];
            } else {
                imagePath = curImagePath;
            }

            if (hasDiffs && imagePath === curImagePath) { throw new Error("No changes made"); }

            let dateModified = await $try(db.editBookmark)(bookmarkId, req.session.uid, title, pageUrl, imageId, tags);
            return res.send({ success: true, bookmark: { bookmarkId, title, pageUrl, imagePath, imageSize, dateCreated, dateModified, tags } });
        } catch (e) { console.error(e); return res.send({ success: false, message: e.message }); }
    });

    app.put("/api/bookmark/:id/view", async (req, res) => {
        try {
            validateSession(req);
            await $try(db.addView)(req.params.id, req.session.uid);
            return res.send({ success: true, message: `Bookmark #${req.params.id} view count incremented` });
        } catch (e) { console.error(e); return res.send({ success: false, message: e.message }); }
    });

    app.delete("/api/bookmark/:id", async (req, res) => {
        try {
            validateSession(req);
            await $try(db.deleteBookmark)(req.params.id);
            return res.send({ success: true, message: `Bookmark #${req.params.id} deleted`});
        } catch (e) { console.error(e); return res.send({ success: false, message: e.message }); }
    });
} catch (e) { console.error(e); }