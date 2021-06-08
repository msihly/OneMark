const conn = require("./index.js").db;
const { getIsoDate } = require("../utils/index.js");

exports.getUserInfo = async ({ username, userId }) => {
    const sql = `SELECT      u.userId, u.username, u.email, u.passwordHash, u.accessLevel, u.verified, u.dateCreated
                FROM        user AS u
                WHERE       u.${userId ? "userId" : "username"} = ?;`;
    const [rows,] = await conn.query(sql, [userId ?? username]);

    return rows[0] ?? false;
};

exports.register = async (username, passwordHash, email) => {
    const sql = `INSERT INTO user (username, passwordHash, email, dateCreated) VALUES (?, ?, ?, ?);`;
    const [{ insertId: userId },] = await conn.query(sql, [username, passwordHash, email, getIsoDate()]);

    return userId;
};

exports.updatePassword = async (userId, passwordHash) => {
    const sql = `UPDATE     user AS u
                SET         u.passwordHash = ?
                WHERE       u.userId = ?;`;
    await conn.query(sql, [passwordHash, userId]);

    return true;
};

exports.updateProfile = async ({ userId, username, email }) => {
    if (!username && !email) return false;

    const userInfo = await db.getUserInfo({ userId });
    if (username !== userInfo.username) {
        const usernameExists = await db.getUserInfo({ username });
        if (usernameExists) throw new Error("Username already taken");
    }

    const sql = `UPDATE     user AS u
                SET         u.username = ?, u.email = ?
                            ${email !== userInfo.email ? ", u.verified = DEFAULT" : ""}
                WHERE       u.userId = ?;`;
    await conn.query(sql, [username, email, userId]);

    return true;
};