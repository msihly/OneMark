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
        resave: false,
        saveUninitialized: true,
        secret: SESSION_SECRET
    };

    if (app.get("env") === "production") {
        app.set("trust proxy", 1);
        sessionSetup.cookie.secure = true;
    }

    app.use(cookieParser(SESSION_SECRET));
    app.use(session(sessionSetup));
    app.use(multer({ limits: { fieldSize: 25 * 1024 * 1024 } }).any());
    app.use(express.json());
    app.use(express.static(path.join(__dirname, "../build")));

    app.get("/", (req, res) => {
        return res.sendFile(path.join(__dirname, "../build", "index.html"));
    });

    const normalizedPath = path.join(__dirname, "routes");
    require("fs").readdirSync(normalizedPath).forEach(file => require("./routes/" + file));

    app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
} catch (e) { console.error(e.message); }