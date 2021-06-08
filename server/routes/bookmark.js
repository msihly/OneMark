const { app } = require("../index.js");
const db = require("../db");
const { getArrayDiff, getIsoDate, handleErrors, parseJSON, validateForm } = require("../utils");
const { authenticateUser } = require("../utils/auth.js");
const { uploadImage } = require("../utils/upload.js");

const reqs = {
    pageUrl: { name: "Page URL", isRequired: true, type: "url", maxLen: 2083 },
    title: { name: "Title", isRequired: true, maxLen: 2083 },
};

try {
    /* ----------------------------------- GET ---------------------------------- */
    app.get("/api/bookmarks", handleErrors(async (req, res) => {
        const refreshedAccessToken = await authenticateUser(req);

        const bookmarks = await db.getUserBookmarks(req.user.userId);
        return res.send({ success: true, bookmarks, refreshedAccessToken });
    }));

    /* ---------------------------------- POST ---------------------------------- */
    app.post("/api/bookmark", handleErrors(async (req, res) => {
        const refreshedAccessToken = await authenticateUser(req);

        const { title, pageUrl } = req.body;
        for (const key in req.body) if (!validateForm(reqs, key, req.body[key], res)) return;

        if (await db.checkBookmarkExists(req.user.userId, pageUrl) !== false) return res.send({ success: false, message: "Bookmark already exists" });

        const { imageId, imageUrl, imageSize } = await uploadImage(req.files[0]);

        const date = getIsoDate();
        const bookmarkId = await db.createBookmark(req.user.userId, imageId, title, pageUrl, date, date);

        const tags = parseJSON(req.body.tags);
        if (tags.length > 0) await db.addBookmarkTags([bookmarkId], tags);

        return res.send({
            success: true,
            bookmark: {
                bookmarkId,
                title,
                pageUrl,
                imageUrl,
                imageSize,
                dateCreated: date,
                dateModified: date,
                views: 0,
                tags
            },
            refreshedAccessToken
        });
    }));

    /* ----------------------------------- PUT ---------------------------------- */
    app.put("/api/bookmark/:id", handleErrors(async (req, res) => {
        const refreshedAccessToken = await authenticateUser(req);

        // req.params.id is unused; bookmarkId extracted from body; // DEBUG
        const { bookmarkId, title, pageUrl, isImageRemoved } = req.body;
        const tags = parseJSON(req.body.tags);

        for (const key in req.body) if (!validateForm(reqs, key, req.body[key], res)) return;

        const [bk, updatedTags] = await Promise.all([db.getBookmarks([bookmarkId]), db.compareBookmarkTags(bookmarkId, tags)]);
        if (!updatedTags) return res.send({ success: false, message: "Error in tag comparison" });
        const { addedTags, removedTags } = updatedTags;

        const hasTagDiffs = addedTags.length !== 0 || removedTags.length !== 0;
        const hasNoDiffs = (title == bk.title && pageUrl == bk.pageUrl && !hasTagDiffs);

        if (hasNoDiffs && req.files.length === 0 && isImageRemoved === "false") return res.send({ success: false, message: "No changes made" });

        const { imageId, imageUrl, imageSize } = isImageRemoved === "true" ? { imageId: null, imageUrl: null, imageSize: 0 } : await uploadImage(req.files[0]);
        const isImageModified = isImageRemoved === "true" || imageUrl !== bk.imageUrl;

        if (hasNoDiffs && !isImageModified) return res.send({ success: false, message: "No changes made" });

        const dateModified = await db.editBookmark(bookmarkId, req.user.userId, title, pageUrl, isImageModified ? imageId : undefined);
        if (hasTagDiffs) await db.editBookmarkTags([bookmarkId], addedTags, removedTags, false);

        const bookmark = { bookmarkId, title, pageUrl, dateModified };
        if (isImageModified) {
            bookmark.imageUrl = imageUrl;
            bookmark.imageSize = imageSize;
        };

        return res.send({ success: true, bookmark, refreshedAccessToken });
    }));

    app.put("/api/bookmark/:id/view", handleErrors(async (req, res) => {
        const refreshedAccessToken = await authenticateUser(req);

        await db.addView(req.params.id, req.user.userId);

        return res.send({ success: true, refreshedAccessToken });
    }));

    app.put("/api/bookmarks/tags", handleErrors(async (req, res) => {
        const refreshedAccessToken = await authenticateUser(req);

        const [bookmarkIds, addedTags, removedTags] =
            [req.body.bookmarkIds, req.body.addedTags, req.body.removedTags].map(e => parseJSON(e));

        const dateModified = await db.editBookmarkTags(bookmarkIds, addedTags, removedTags);

        return res.send({ success: true, bookmarkIds, addedTags, removedTags, dateModified, refreshedAccessToken });
    }));

    /* --------------------------------- DELETE --------------------------------- */
    app.delete("/api/bookmarks", handleErrors(async (req, res) => {
        const refreshedAccessToken = await authenticateUser(req);

        const bookmarkIds = parseJSON(req.body.bookmarkIds);
        await db.deleteBookmarks(bookmarkIds);

        return res.send({ success: true, bookmarkIds, refreshedAccessToken });
    }));
} catch (e) { console.error(e); }