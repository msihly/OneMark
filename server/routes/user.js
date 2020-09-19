try {
    const db = require("../db/functions.js");
    const app = require("../index.js").app;
    const bcrypt = require("bcrypt");
    const { $try, getFutureDate, handleErrors, validate, validateSession } = require("../utils");

    app.post("/api/user/login", handleErrors(async (req, res) => {
        if (req.session.uid) { return res.send({ success: true, message: "User already logged in" }); }
        if (req.cookies.authToken) {
            let userId = await db.validateToken(req.cookies.authToken);
            if (userId) {
                req.session.uid = userId;
                return res.send({ success: true, message: "Login via token successful" });
            }
            res.clearCookie("authToken", { path: "/" });
        }
        if (Object.keys(req.body).length === 0) { throw new Error("No valid AuthToken or login credentials provided"); }

        const { username, password, hasRememberMe } = req.body;
        if (!username || !password) { throw new Error("All fields are required"); }

        const { userId, passwordHash } = await db.getLoginInfo(username);
        if (!userId || !passwordHash) { throw new Error("Incorrect login credentials"); }

        let match = await bcrypt.compare(password, passwordHash.replace("$2y", "$2b"));
        if (!match) { throw new Error("Incorrect password"); }
        if (hasRememberMe) {
            const token = await db.createToken(userId, 30);
            res.cookie("authToken", token, { maxAge: getFutureDate({days: 30}).getTime() - Date.now(), httpOnly: true });
        }

        [req.session.uid, req.session.username] = [userId, username];
        return res.send({ success: true, message: "Login successful" });
    }));

    app.post("/api/ext/user/login", handleErrors(async (req, res) => {
        const { username, password } = req.body;
        if (!username || !password) { throw new Error("All fields are required"); }

        const { userId, passwordHash } = await db.getLoginInfo(username);
        if (!userId || !passwordHash) { throw new Error("Incorrect login credentials"); }

        let match = await bcrypt.compare(password, passwordHash.replace("$2y", "$2b"));
        if (!match) { throw new Error("Incorrect password"); }

        const token = await db.createToken(userId, 90);
        return res.send({ success: true, userId, token });
    }));

    app.post("/api/user/register", handleErrors(async (req, res) => {
        const { email, username, password, passwordConf, hasRememberMe } = req.body;
        if (!email || !username || !password || !passwordConf) { throw new Error("All fields are required"); }
        if (!validate(email, "email")) { throw new Error("Invalid email"); }
        if (username.length > 40) { throw new Error("Username cannot be more than 40 characters"); }
        if (password.length < 8) { throw new Error("Password must be a minimum of 8 characters"); }
        if (password !== passwordConf) { throw new Error("Password does not match confirmation"); }
        if (await db.getUserId(username)) { throw new Error("Username is already taken"); }

        const userId = await db.register(email, username, password);
        [req.session.uid, req.session.username] = [userId, username];
        if (hasRememberMe) {
            const token = await db.createToken(userId, 30);
            res.cookie("authToken", token, { maxAge: getFutureDate({days: 30}).getTime() - Date.now(), httpOnly: true });
        }

        return res.send({ success: true, message: "Registration successful" });
    }));

    app.delete("/api/user/logout", handleErrors(async (req, res) => {
        const { authToken } = req.cookies;
        if (authToken) {
            const selector = authToken.substring(0, authToken.indexOf(":"));
            db.deleteToken(selector);
            res.clearCookie("authToken");
        }
        req.session.destroy();
        return res.send({ success: true, message: "Logout successful" });
    }));

    app.get("/api/user/info", handleErrors(async (req, res) => {
        validateSession(req);
        const info = await db.getUserInfo(req.session.uid);
        return res.send({ success: true, info });
    }));

    app.put("/api/user/profile", handleErrors(async (req, res) => {
        validateSession(req);
        const { email, username } = req.body;
        if (!email || !username) { throw new Error("All fields are required"); }
        if (!validate(email, "email")) { throw new Error("Invalid email"); }
        if (username.length > 40) { throw new Error("Username cannot be more than 40 characters"); }
        if (username !== req.session.username && await db.getUserId(username)) { throw new Error("Username is already taken"); }

        await db.updateProfile(req.session.uid, email, username);
        req.session.username = username;
        return res.send({ success: true, username, email });
    }));

    app.put("/api/user/password", handleErrors(async (req, res) => {
        validateSession(req);
        const [{ uid: userId }, { currentPassword, newPassword, passwordConf }] = [req.session, req.body];

        if (!currentPassword || !newPassword || !passwordConf) { throw new Error("All fields are required"); }
        if (newPassword === currentPassword) { throw new Error("New password cannot match current password"); }
        if (currentPassword.length < 8 || newPassword.length < 8) { throw new Error("Password must be a minimum of 8 characters"); }
        if (newPassword !== passwordConf) { throw new Error("New password does not match confirmation"); }

        const currentPasswordHash = await db.getPass(userId);
        let match = await bcrypt.compare(currentPassword, currentPasswordHash.replace("$2y", "$2b"));
        if (!match) { throw new Error("Incorrect password"); }

        let passwordHash = await bcrypt.hash(newPassword, 10);
        await db.updatePass(userId, passwordHash);
        return res.send({ success: true, message: "Password updated" });
    }));
} catch (e) { console.error(e); }