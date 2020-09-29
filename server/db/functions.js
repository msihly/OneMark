const conn = require("./index.js").db;
const bcrypt = require("bcrypt");
const { getFutureDate, getIsoDate, hash, randomBase64 } = require("../utils");

/********************* USERS / ACCOUNTS *********************/
exports.getAccessLevel = async (userId) => {
    let sql = `SELECT      u.AccessLevel AS accountType
            FROM        User AS u
            WHERE       u.UserID = ?;`;
    let [rows, fields] = await conn.query(sql, [userId]);
    return rows.length > 0 ? rows[0].accountType : false;
}

exports.getLoginInfo = async (username) => {
    let sql = `SELECT      l.UserID AS userId, l.PasswordHash AS passwordHash
                FROM        Logins AS l
                WHERE       l.Username = ?;`;
    let [rows, fields] = await conn.query(sql, [username]);
    return rows.length > 0 ? rows[0] : false;
}

exports.getPass = async (userId) => {
    let sql = `SELECT      l.PasswordHash AS passwordHash
                FROM        Logins AS l
                WHERE       l.UserID = ?;`;
    let [rows, fields] = await conn.query(sql, [userId]);
    return rows.length > 0 ? rows[0].passwordHash : false;
}

exports.getUserId = async (username) => {
    let sql = `SELECT      l.UserID AS userId
                FROM        Logins AS l
                WHERE       l.Username = ?;`;
    let [rows, fields] = await conn.query(sql, [username]);
    return rows.length > 0 ? rows[0].userId : false;
}

exports.getUserInfo = async (userId) => {
    let sql = `SELECT      l.Username AS username, u.Email AS email, u.DateCreated AS dateCreated, u.Verified AS verified, u.AccessLevel AS accountType
                FROM        Logins AS l INNER JOIN User AS u
                                ON l.UserID = u.UserID
                WHERE       u.UserID = ?;`;
    let [rows, fields] = await conn.query(sql, [userId]);
    return rows.length > 0 ? rows[0] : false;
}

exports.register = async (email, username, password) => {
    const date = getIsoDate();
    let sql = `INSERT INTO User (Email, DateCreated) VALUES (?, ?);`;
    let [fields, rows] = await conn.query(sql, [email, date]);
    const userId = fields.insertId;

    let hash = await bcrypt.hash(password, 10);
    sql = `INSERT INTO Logins (Username, PasswordHash, UserID) VALUES (?, ?, ?);`;
    await conn.query(sql, [username, hash, userId]);
    return userId;
}

exports.updateProfile = async (userId, email, username) => {
    let sql = `UPDATE      User AS u, Logins AS l
                SET         u.Email = ?, l.Username = ?
                WHERE       u.UserID = l.UserID AND u.UserID = ?;`;
    await conn.query(sql, [email, username, userId]);
    return true;
}

exports.updatePass = async (userId, passwordHash) => {
    let sql = `UPDATE      Logins AS l
                SET         l.PasswordHash = ?
                WHERE       l.UserID = ?;`;
    await conn.query(sql, [passwordHash, userId]);
    return true;
}

/********************* AUTHENTICATION TOKENS *********************/
exports.createToken = async (userId, days) => {
    const selector = randomBase64(15);
    const validator = randomBase64(33);
    const validatorHash = hash("sha256", validator);
    const expiryDate = getFutureDate({days});

    let sql = `INSERT INTO Token (Selector, ValidatorHash, ExpiryDate, UserID) VALUES (?, ?, ?, ?);`
    await conn.query(sql, [selector, validatorHash, expiryDate, userId]);
    return `${selector}:${validator}`;
}

exports.deleteToken = async (selector) => {
    if (selector.length !== 20) { throw `Invalid selector ${selector}`; }
    let sql = `DELETE
                FROM        Token
                WHERE       Selector = ?;`;
    await conn.query(sql, [selector]);
    return true;
}

exports.validateToken = async (token) => {
    if (!/:/.test(token)) { throw `Failed to find ":" in token ${token}`; }
    const [selector, validator] = token.split(":");
    if (selector.length !== 20) { throw `Invalid length (${selector.length}) of selector ${selector}`; }
    if (validator.length !== 44) { throw `Invalid length (${validator.length}) of validator ${validator}`; }

    let sql = `SELECT      t.ValidatorHash AS validatorHash, t.ExpiryDate AS expiryDate, t.UserID AS userId
                FROM        Token AS t
                WHERE       t.Selector = ?;`;
    let [rows, fields] = await conn.query(sql, [selector]);
    if (rows.length === 0) { throw new Error("Selector lookup failed"); }

    const validatorHash = hash("sha256", validator);
    if (validatorHash !== rows[0].validatorHash) { throw `Validator ${validator} does not match stored hash ${rows[0].validatorHash}`; }
    if (Date.now() - new Date(rows[0].expiryDate) > 0) { await this.deleteToken(selector).catch(e => { throw `Failed to delete token ${token}. Error: ${e}`}); }

    return rows[0].userId;
}

/********************* BOOKMARKS *********************/
exports.addView = async (bookmarkId, userId) => {
    let sql = `UPDATE      Bookmark AS b
                SET         b.Views = b.Views + 1
                WHERE       b.UserID = ? AND b.BookmarkID = ?;`;
    await conn.query(sql, [userId, bookmarkId]);
    return true;
}

exports.checkBookmarkExists = async (userId, pageUrl) => {
    let sql = `SELECT      b.BookmarkID AS bookmarkId
                FROM        Bookmark AS b
                WHERE       b.UserID = ? AND b.PageURL = ?;`;
    let [rows, fields] = await conn.query(sql, [userId, pageUrl]);
    return rows.length > 0 ? rows[0].bookmarkId : false;
}

exports.deleteBookmark = async (bookmarkId) => {
    await this.removeAllBookmarkTags(bookmarkId);
    let sql = `DELETE
                FROM        Bookmark
                WHERE       BookmarkID = ?;`;
    await conn.query(sql, [bookmarkId]);
    return true;
}

exports.deleteBookmarks = async (bookmarkIds = []) => {
    if (bookmarkIds.length === 0) { throw new Error("Bookmarks argument of length 0"); }
    let sql = `DELETE
                FROM        Bookmark
                WHERE       BookmarkID IN (?${", ?".repeat(bookmarkIds.length - 1)});`;
    await conn.query(sql, [...bookmarkIds]);
    return true;
}

exports.editBookmark = async (bookmarkId, userId, title, pageUrl, imageId, tags) => {
    const dateModified = getIsoDate();
    let sql = `UPDATE      Bookmark AS b
                SET         b.Title = ?, b.PageURL = ?, b.ImageID = ?, b.DateModified = ?
                WHERE       b.UserID = ? AND b.BookmarkID = ?;`;
    await conn.query(sql, [title, pageUrl, imageId, dateModified, userId, bookmarkId]);
    await this.editBookmarkTags(bookmarkId, tags);
    return dateModified;
}

exports.getAllBookmarks = async (userId) => {
    let sql = `SELECT      b.BookmarkID AS bookmarkId, b.Title AS title, b.PageURL AS pageUrl, i.ImagePath AS imagePath, i.ImageSize AS imageSize, b.DateCreated AS dateCreated, b.DateModified AS dateModified, b.Views AS views
                FROM        Bookmark AS b INNER JOIN Images AS i
                                ON b.ImageID = i.ImageID
                WHERE       b.UserID = ?
                ORDER BY    b.DateModified DESC;`;
    let [bookmarks, fields] = await conn.query(sql, [userId]);
    if (bookmarks.length > 0) {
        sql = `SELECT      b_t.BookmarkID AS bookmarkId, t.TagText AS tagText
                FROM        Tag AS t INNER JOIN BookmarkTag AS b_t
                            ON t.TagID = b_t.TagID
                WHERE       b_t.BookmarkID IN (
                    SELECT    b.BookmarkID
                    FROM      Bookmark AS b
                    WHERE     b.UserID = ?
                );`;
        let [tags, fields] = await conn.query(sql, [userId]);
        bookmarks.forEach(bookmark => {
            bookmark.tags = tags.filter(tag => bookmark.bookmarkId === tag.bookmarkId).map(tag => tag.tagText);
            bookmark.dateCreated = getIsoDate(bookmark.dateCreated);
            bookmark.dateModified = getIsoDate(bookmark.dateModified);
        });
    }
    return bookmarks;
}

exports.getBookmark = async (bookmarkId) => {
    let sql = `SELECT      b.Title AS title, b.PageURL AS pageUrl, b.ImageID AS imageId, i.ImagePath AS imagePath, i.ImageSize AS imageSize, b.DateCreated AS dateCreated, b.DateModified AS dateModified, b.Views AS views
                FROM        Bookmark AS b INNER JOIN Images AS i
                                ON b.ImageID = i.ImageID
                WHERE       b.BookmarkID = ?;`;
    let [rows, fields] = await conn.query(sql, [bookmarkId]);
    return rows.length > 0 ? rows[0] : false;
}

exports.uploadBookmark = async (userId, imageId, title, pageUrl, dateCreated = getIsoDate(), dateModified = getIsoDate()) => {
    let sql = `INSERT INTO Bookmark (Title, PageURL, DateCreated, DateModified, ImageID, UserID) VALUES (?, ?, ?, ?, ?, ?);`;
    let [fields, rows] = await conn.query(sql, [title, pageUrl, dateCreated, dateModified, imageId, userId]);
    return fields.insertId;
}

/********************* IMAGES *********************/
exports.getImagePath = async (imageId) => {
    let sql = `SELECT      i.ImagePath AS imagePath
                FROM        Images AS i
                WHERE       i.ImageID = ?;`;
    let [rows, fields] = await conn.query(sql, [imageId]);
    return rows.length > 0 ? rows[0].imagePath : false;
}

exports.lookupImageHash = async (imageHash) => {
    let sql = `SELECT      i.ImageID AS imageId, i.ImagePath AS imagePath
                FROM        Images AS i
                WHERE       i.ImageHash = ?;`;
    let [rows, fields] = await conn.query(sql, [imageHash]);
    return rows.length > 0 ? rows[0] : false;
}

exports.uploadImage = async (imagePath, imageHash, imageSize) => {
    let sql = `INSERT INTO Images (ImagePath, ImageHash, ImageSize, DateCreated) VALUES (?, ?, ?, ?);`;
    let [fields, rows] = await conn.query(sql, [imagePath, imageHash, imageSize, getIsoDate()]);
    return fields.insertId;
}

/********************* TAGS *********************/
exports.addBookmarkTag = async (bookmarkId, tagText) => {
    const tagId = await this.getTag(tagText) || await this.createTag(tagText);
    if (await this.getBookmarkTag(bookmarkId, tagId)) { throw new Error("Tag already exists"); }

    let sql = `INSERT INTO BookmarkTag (BookmarkID, TagID) VALUES (?, ?);`;
    await conn.query(sql, [bookmarkId, tagId]);
}

exports.addBookmarkTags = async (bookmarkId, tags) => {
    if (tags.length === 0) { throw new Error("Tags argument of length 0"); }
    await this.createTags(tags);
    const tagIds = await this.getTags(tags);
    if (tagIds.length === 0 || !tagIds) { throw new Error("Failed to retrieve tag ids"); }

    let sql = `INSERT INTO BookmarkTag (BookmarkID, TagID) VALUES ${"(?, ?), ".repeat(tagIds.length - 1)}(?, ?);`;
    await conn.query(sql, tagIds.flatMap(tagId => [bookmarkId, tagId]));
}

exports.createTag = async (tagText) => {
    let sql = `INSERT INTO Tag (TagText) VALUES (?);`;
    let [fields, rows] = await conn.query(sql, [tagText]);
    return fields.insertId;
}

exports.createTags = async (tags = []) => {
    if (tags.length === 0) { throw new Error("No tags provided"); }
    let sql = `INSERT IGNORE INTO Tag (TagText) VALUES ${"(?), ".repeat(tags.length - 1)}(?);`;
    await conn.query(sql, tags);
}

exports.editBookmarkTags = async (bookmarkId, tags) => {
    const currentTags = await this.getAllBookmarkTags(bookmarkId);
    const addedTags = tags.filter(tag => !currentTags.includes(tag));
    const removedTags = currentTags.filter(tag => !tags.includes(tag));

    if (addedTags.length > 0) { await this.addBookmarkTags(bookmarkId, addedTags); }
    if (removedTags.length > 0) { await this.removeBookmarkTags(bookmarkId, removedTags); }
    return true;
}

exports.editMultiBookmarkTags = async (bookmarkIds = [], addedTags = [], removedTags = []) => {
    if (bookmarkIds.length === 0) { throw new Error("No bookmarks provided"); }
    if (addedTags.length === 0 && removedTags === 0) { throw new Error("No tags added or removed"); }

    if (addedTags.length > 0) {
        await this.createTags(addedTags);
        let tagIds = await this.getTags(addedTags);
        if (tagIds.length === 0 || !tagIds) { throw new Error("Failed to retrieve 'added' tag ids"); }

        let map = bookmarkIds.flatMap(bookmarkId => tagIds.flatMap(tagId => [bookmarkId, tagId]));
        let sql = `INSERT IGNORE INTO BookmarkTag (BookmarkID, TagID) VALUES ${"(?, ?), ".repeat(map.length / 2 - 1)}(?, ?);`;
        await conn.query(sql, map);
    }
    if (removedTags.length > 0) {
        let sql = `DELETE
                    FROM        BookmarkTag
                    WHERE       BookmarkID IN (?${", ?".repeat(bookmarkIds.length - 1)}) AND TagID IN (
                        SELECT       t.TagID
                        FROM         Tag AS t
                        WHERE        t.TagText IN (?${", ?".repeat(removedTags.length - 1)})
                    );`;
        await conn.query(sql, [...bookmarkIds, ...removedTags]);
    }

    let dateModified = getIsoDate();
    let sql = `UPDATE       Bookmark AS b
                SET         b.DateModified = ?
                WHERE       BookmarkID IN (?${", ?".repeat(bookmarkIds.length - 1)});`
    await conn.query(sql, [dateModified, ...bookmarkIds]);
    return dateModified;
}

exports.getAllBookmarkTags = async (bookmarkId) => {
    let sql = `SELECT      t.TagText AS tagText
                FROM        Tag AS t INNER JOIN BookmarkTag AS b_t
                            ON t.TagID = b_t.TagID
                WHERE       b_t.BookmarkID = ?;`;
    let [rows, fields] = await conn.query(sql, [bookmarkId]);
    return rows.length > 0 ? rows.map(tag => tag.tagText) : [];
}

exports.getAllTagBookmarks = async (tagId) => {
    let sql = `SELECT      b.BookmarkID AS bookmarkId
                FROM        Bookmark AS b INNER JOIN BookmarkTag AS b_t
                                ON b.BookmarkID = b_t.BookmarkID
                WHERE       b_t.TagID = ?;`;
    let [rows, fields] = await conn.query(sql, [tagId]);
    return rows.length > 0 ? rows.map(bookmark => bookmark.bookmarkId) : [];
}

exports.getAllUserTags = async (userId) => {
    let sql = `SELECT      t.TagText AS tagText
                FROM        Tag AS t INNER JOIN BookmarkTag AS b_t
                                ON t.TagID = b_t.TagID
                            INNER JOIN Bookmark AS b
                                ON b.BookmarkID = b_t.BookmarkID
                WHERE       b.UserID = ?;`;
    let [rows, fields] = await conn.query(sql, [userId]);
    return rows.length > 0 ? rows.map(tag => tag.tagText) : [];
}

exports.getBookmarkTag = async (bookmarkId, tagId) => {
    let sql = `SELECT      b_t.BookmarkID AS bookmarkId, b_t.TagID AS tagId
                FROM        BookmarkTag AS b_t
                WHERE       b_t.BookmarkID = ? AND b_t.TagID = ?;`;
    let [rows, fields] = await conn.query(sql, [bookmarkId, tagId]);
    return rows.length > 0 ? rows[0] : [];
}

exports.getTag = async (tagText) => {
    let sql = `SELECT      t.TagID AS tagId
                FROM        Tag AS t
                WHERE       t.TagText = ?;`;
    let [rows, fields] = await conn.query(sql, [tagText]);
    return rows.length > 0 ? rows[0].tagId : [];
}

exports.getTags = async (tags) => {
    if (tags.length === 0) { throw new Error("Tags argument of length 0"); }
    let sql = `SELECT      t.TagID AS tagId
                FROM        Tag AS t
                WHERE       t.TagText IN (?${", ?".repeat(tags.length - 1)});`;
    let [rows, fields] = await conn.query(sql, tags);
    return rows.length > 0 ? rows.map(tag => tag.tagId) : [];
}

exports.removeAllBookmarkTags = async (bookmarkId) => {
    let sql = `DELETE
                FROM        BookmarkTag
                WHERE       BookmarkID = ?;`;
    await conn.query(sql, [bookmarkId]);
    return true;
}

exports.removeBookmarkTag = async (bookmarkId, tagText) => {
    const tagId = await this.getTag(tagText);
    let sql = `DELETE
                FROM        BookmarkTag
                WHERE       BookmarkID = ? AND TagID = ?;`;
    await conn.query(sql, [bookmarkId, tagId]);
    return tagId;
}

exports.removeBookmarkTags = async (bookmarkId, tags) => {
    if (tags.length === 0) { throw new Error("Tags argument of length 0"); }
    let sql = `DELETE
                FROM        BookmarkTag
                WHERE       BookmarkID = ? AND TagID IN (
                    SELECT       t.TagID
                    FROM         Tag AS t
                    WHERE        t.TagText IN (?${", ?".repeat(tags.length - 1)})
                );`;
    await conn.query(sql, [bookmarkId, ...tags]);
    return true;
}