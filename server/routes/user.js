try {
    const db = require("../db/functions.js");
    const app = require("../index.js").app;
    const bcrypt = require("bcrypt");
    const { $try, getFutureDate, validate, validateSession } = require("../utils");

    app.post("/api/user/login", async (req, res) => {
        try {
            if (req.session.uid) { return res.send({ success: true, message: "User already logged in" }); }
            if (req.cookies.authToken) {
                let userId = await $try(db.validateToken)(req.cookies.authToken);
                if (userId) {
                    req.session.uid = userId;
                    return res.send({ success: true, message: "Login via token successful" });
                }
                res.clearCookie("authToken", { path: "/" });
            }
            if (Object.keys(req.body).length === 0) { throw new Error("No valid AuthToken or login credentials provided"); }

            const { username, password, hasRememberMe } = req.body;
            if (!username || !password) { throw new Error("All fields are required"); }

            const { userId, passwordHash } = await $try(db.getLoginInfo)(username);
            if (!userId || !passwordHash) { throw new Error("Incorrect login credentials"); }

            let match = await bcrypt.compare(password, passwordHash.replace("$2y", "$2b"));
            if (!match) { throw new Error("Incorrect password"); }
            if (hasRememberMe) {
                const token = await $try(db.createToken)(userId, 30);
                res.cookie("authToken", token, { maxAge: getFutureDate({days: 30}).getTime() - Date.now(), httpOnly: true });
            }

            [req.session.uid, req.session.username] = [userId, username];
            return res.send({ success: true, message: "Login successful" });
        } catch (e) { console.error(e.message); return res.send({ success: false, message: e.message }); }
    });

    app.post("/api/ext/user/login", async (req, res) => {
        try {
            const { username, password } = req.body;
            if (!username || !password) { throw new Error("All fields are required"); }

            const { userId, passwordHash } = await $try(db.getLoginInfo)(username);
            if (!userId || !passwordHash) { throw new Error("Incorrect login credentials"); }

            let match = await bcrypt.compare(password, passwordHash.replace("$2y", "$2b"));
            if (!match) { throw new Error("Incorrect password"); }

            const token = await $try(db.createToken)(userId, 90);
            return res.send({ success: true, userId, token });
        } catch (e) { console.error(e.message); return res.send({ success: false, message: e.message }); }
    });

    app.post("/api/user/register", async (req, res) => {
        try {
            const { email, username, password, passwordConf, hasRememberMe } = req.body;
            if (!email || !username || !password || !passwordConf) { throw new Error("All fields are required"); }
            if (!validate(email, "email")) { throw new Error("Invalid email"); }
            if (username.length > 40) { throw new Error("Username cannot be more than 40 characters"); }
            if (password.length < 8) { throw new Error("Password must be a minimum of 8 characters"); }
            if (password !== passwordConf) { throw new Error("Password does not match confirmation"); }
            if (await $try(db.getUserId)(username)) { throw new Error("Username is already taken"); }

            const userId = await $try(db.register)(email, username, password);
            [req.session.uid, req.session.username] = [userId, username];
            if (hasRememberMe) {
                const token = await $try(db.createToken)(userId, 30);
                res.cookie("authToken", token, { maxAge: getFutureDate({days: 30}).getTime() - Date.now(), httpOnly: true });
            }

            return res.send({ success: true, message: "Registration successful" });
        } catch (e) { console.error(e.message); return res.send({ success: false, message: e.message }); }
    });

    app.delete("/api/user/logout", async (req, res) => {
        try {
            const { authToken } = req.cookies;
            if (authToken) {
                const selector = authToken.substring(0, authToken.indexOf(":"));
                $try(db.deleteToken)(selector);
                res.clearCookie("authToken");
            }
            req.session.destroy();
            return res.send({ success: true, message: "Logout successful" });
        } catch (e) { console.error(e.message); return res.send({ success: false, message: e.message }); }
    });

    app.get("/api/user/info", async (req, res) => {
        try {
            validateSession(req);
            const info = await $try(db.getUserInfo)(req.session.uid);
            return res.send({ success: true, info });
        } catch (e) { console.error(e.message); return res.send({ success: false, message: e.message }); }
    });

    app.put("/api/user/profile", async (req, res) => {
        try {
            validateSession(req);
            const { email, username } = req.body;
            if (!email || !username) { throw new Error("All fields are required"); }
            if (!validate(email, "email")) { throw new Error("Invalid email"); }
            if (username.length > 40) { throw new Error("Username cannot be more than 40 characters"); }
            if (username !== req.session.username && await $try(db.getUserId)(username)) { throw new Error("Username is already taken"); }

            await $try(db.updateProfile)(req.session.uid, email, username);
            req.session.username = username;
            return res.send({ success: true, username, email });
        } catch (e) { console.error(e.message); return res.send({ success: false, message: e.message }); }
    });

    app.put("/api/user/password", async (req, res) => {
        try {
            validateSession(req);
            const {currentPassword, newPassword, passwordConf} = req.body;
            if (!currentPassword || !newPassword || !passwordConf) { throw new Error("All fields are required"); }
            if (newPassword === currentPassword) { throw new Error("New password cannot match current password"); }
            if (newPassword.length < 8) { throw new Error("Password must be a minimum of 8 characters"); }
            if (newPassword !== passwordConf) { throw new Error("New password does not match confirmation"); }
            if (await bcrypt.compare(currentPassword, await $try(db.getPass)(userId))) { throw new Error("Incorrect password"); }

            let [err, passwordHash] = await bcrypt.hash(password, 10);
            await db.updatePass(userId, passwordHash);
            return res.send({ success: true, message: "Password updated" });
        } catch (e) { console.error(e.message); return res.send({ success: false, message: e.message }); }
    });
} catch (e) { console.error(e.message); }