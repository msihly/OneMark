const conn = require("./index.js").db;
const { getIsoDate } = require("../utils/index.js");

/* -------------------------------- BOOKMARKS ------------------------------- */
exports.addView = async (bookmarkId, userId) => {
    const sql = `UPDATE      bookmark AS b
                SET         b.views = b.views + 1
                WHERE       b.userId = ? AND b.bookmarkId = ?;`;
    await conn.query(sql, [userId , bookmarkId]);
    return true;
};

exports.checkBookmarkExists = async (userId, pageUrl) => {
    const sql = `SELECT      b.bookmarkId
                FROM        bookmark AS b
                WHERE       b.userId = ? AND b.pageUrl = ?;`;
    const [rows,] = await conn.query(sql, [userId, pageUrl]);
    return rows[0]?.bookmarkId ?? false;
};

exports.createBookmark = async (userId, imageId, title, pageUrl, dateCreated = getIsoDate(), dateModified = getIsoDate()) => {
    const sql = `INSERT INTO bookmark (userId, imageId, title, pageUrl, dateCreated, dateModified) VALUES (?, ?, ?, ?, ?, ?);`;
    const [{ insertId: bookmarkId },] = await conn.query(sql, [userId, imageId, title, pageUrl, dateCreated, dateModified]);
    return bookmarkId;
};

exports.deleteBookmarks = async (bookmarkIds = []) => {
    if (!bookmarkIds?.length) throw new Error("Bookmarks argument of length 0");
    const sql = `DELETE
                FROM        bookmark
                WHERE       bookmarkId IN (?${", ?".repeat(bookmarkIds.length - 1)});`;
    await conn.query(sql, bookmarkIds);
    return true;
};

exports.editBookmark = async (bookmarkId, userId, title, pageUrl, imageId) => {
    const dateModified = getIsoDate();

    const props = [title, pageUrl, dateModified, imageId, userId, bookmarkId].filter(e => e !== undefined);
    const sql = `UPDATE      bookmark AS b
                SET         b.title = ?, b.pageUrl = ?, b.dateModified = ?
                            ${imageId === undefined ? "" : ", b.imageId = ?"}
                WHERE       b.userId = ? AND b.bookmarkId = ?;`;
    await conn.query(sql, props);

    return dateModified;
};

exports.getBookmarks = async (bookmarkIds = []) => {
    if (!bookmarkIds?.length) return false;

    const sql = `SELECT      b.*, i.imageUrl, i.imageSize
                FROM        bookmark AS b LEFT JOIN images AS i
                                ON b.imageId = i.imageId
                WHERE       b.bookmarkId IN (?${", ?".repeat(bookmarkIds.length - 1)});`;
    const [bookmarks,] = await conn.query(sql, bookmarkIds);
    return (bookmarks.length > 1 ? bookmarks : bookmarks[0]) ?? false;
};

exports.getUserBookmarks = async (userId) => {
    const sql = `SELECT      b.*, i.imageUrl, i.imageSize
                FROM        bookmark AS b LEFT JOIN images AS i
                                ON b.imageId = i.imageId
                WHERE       b.userId = ?
                ORDER BY    b.dateModified DESC;`;
    const [bookmarks,] = await conn.query(sql, [userId]);

    if (bookmarks.length > 0) {
        const tags = await this.getBookmarkTags(bookmarks.map(b => b.bookmarkId));
        bookmarks.forEach(b => {
            b.tags = tags.filter(t => b.bookmarkId === t.bookmarkId).map(t => t.tagText);
            b.dateCreated = getIsoDate(b.dateCreated);
            b.dateModified = getIsoDate(b.dateModified);
        });
    }

    return bookmarks;
};

exports.updateDateModified = async (bookmarkIds = []) => {
    if (!bookmarkIds?.length) return false;

    const dateModified = getIsoDate();
    const sql = `UPDATE       bookmark AS b
                SET         b.dateModified = ?
                WHERE       bookmarkId IN (?${", ?".repeat(bookmarkIds.length - 1)});`
    await conn.query(sql, [dateModified, ...bookmarkIds]);

    return dateModified;
};

/* ---------------------------------- TAGS ---------------------------------- */
exports.createTags = async (tags = [], hasLookup = false) => {
    if (!tags?.length) return false;

    const sql = `INSERT IGNORE INTO tag (tagText) VALUES (?)${", (?)".repeat(tags.length - 1)};`;
    await conn.query(sql, tags);

    if (hasLookup) return await this.getTagIds(tags);
    return true;
};

exports.getTagIds = async (tags = []) => {
    if (!tags?.length) return false;

    const sql = `SELECT      t.tagId
                FROM        tag AS t
                WHERE       t.tagText IN (?${", ?".repeat(tags.length - 1)});`;
    const [tagIds,] = await conn.query(sql, tags);

    return tagIds.map(t => t.tagId);
};

/* ------------------------------ BOOKMARK-TAGS ----------------------------- */
exports.addBookmarkTags = async (bookmarkIds = [], tags = []) => {
    if (!bookmarkIds?.length || !tags?.length) return false;

    try {
        await conn.query("START TRANSACTION");

        const tagIds = await this.createTags(tags, true);
        if (!tagIds?.length) throw new Error("Failed to create tags");

        const bookmarkTags = bookmarkIds.flatMap(bookmarkId => tagIds.flatMap(tagId => [bookmarkId, tagId]));
        const sql = `INSERT INTO bookmarkTag (bookmarkId, tagId) VALUES (?, ?)${", (?, ?)".repeat(bookmarkTags.length / 2 - 1)};`;
        await conn.query(sql, bookmarkTags);

        await conn.query("COMMIT");
        return tagIds;
    } catch (e) {
        await conn.query("ROLLBACK");
        throw new Error(e);
    }
};

exports.compareBookmarkTags = async (bookmarkId, tags = []) => {
    if (!bookmarkId || tags?.length === undefined) return false;

    const bookmarkTags = await this.getBookmarkTags([bookmarkId]);
    const currentTags = bookmarkTags.map(t => t.tagText);
    const addedTags = tags.filter(t => !currentTags.includes(t));
    const removedTags = currentTags.filter(t => !tags.includes(t));

    return { addedTags, removedTags };
};

exports.editBookmarkTags = async (bookmarkIds = [], addedTags = [], removedTags = [], hasDate = true) => {
    if (!bookmarkIds?.length || (!addedTags?.length && !removedTags?.length)) return false;

    try {
        await conn.query("START TRANSACTION");

        if (addedTags.length > 0) await this.addBookmarkTags(bookmarkIds, addedTags);
        if (removedTags.length > 0) await this.removeBookmarkTags(bookmarkIds, removedTags);

        if (hasDate) {
            const dateModified = await this.updateDateModified(bookmarkIds);
            await conn.query("COMMIT");
            return dateModified;
        } else {
            await conn.query("COMMIT");
            return true;
        }
    } catch (e) {
        await conn.query("ROLLBACK");
        throw new Error(e);
    }
};

exports.getBookmarkTags = async (bookmarkIds = []) => {
    if (!bookmarkIds?.length) return false;

    const sql = `SELECT      bT.bookmarkId, t.tagText
                FROM        tag AS t INNER JOIN bookmarkTag AS bT
                                ON t.tagId = bT.tagId
                WHERE       bT.bookmarkId IN (?${", ?".repeat(bookmarkIds.length - 1)});`;
    const [tags,] = await conn.query(sql, bookmarkIds);
    return tags;
};

exports.removeBookmarkTags = async (bookmarkIds = [], tags = []) => {
    if (!bookmarkIds?.length || !tags?.length) return false;

    const sql = `DELETE
                FROM        bookmarkTag
                WHERE       bookmarkId IN (?${", ?".repeat(bookmarkIds.length - 1)}) AND tagId IN (
                    SELECT       t.tagId
                    FROM         tag AS t
                    WHERE        t.tagText IN (?${", ?".repeat(tags.length - 1)})
                );`;
    await conn.query(sql, [...bookmarkIds, ...tags]);
    return true;
};