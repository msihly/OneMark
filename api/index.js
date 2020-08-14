try {
    const express = require("express");
    const path = require("path");
    const cookieParser = require("cookie-parser");
    const session = require("express-session");
    const MemoryStore = require("memorystore")(session);
    const multer = require("multer");
    const { PORT, SESSION_SECRET } = process.env;
    const DAY_IN_MS = 86400000;
    const app = express();
    exports.app = app;

    const sessionSetup = {
        cookie: { maxAge: DAY_IN_MS },
        store: new MemoryStore({ checkPeriod: DAY_IN_MS }),
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: true
    };

    if (process.env.NODE_ENV === "production") {
        app.enable("trust proxy");
        sessionSetup.cookie.secure = true;
    }

    app.use(cookieParser(SESSION_SECRET));
    app.use(session(sessionSetup));
    app.use(multer({ limits: { fieldSize: 25 * 1024 * 1024 } }).any());
    app.use(express.json());
    app.use(express.static(path.join(__dirname, "../build")));

    // const normalizedPath = path.join(__dirname, "routes");
    // require("fs").readdirSync(normalizedPath).forEach(file => require("./routes/" + file));

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

    app.get("*", (req, res) => {
        return res.sendFile(path.join(__dirname, "../build", "index.html"));
    });

    app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
} catch (e) { console.error(e.message); }