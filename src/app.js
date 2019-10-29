import express from "express";
const app = express();
import http from "http";
import https from "https";
import fs from "fs";
import path from "path";
import socketio from "socket.io";
import passport from "passport";
import session from "express-session";
import passportInit from "./config/passport";
import errorHandler from "./handlers/error";
import routes from "./routes/";

import mongoose from "mongoose";
import connectStore from "connect-mongo";

(async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            keepAlive: true,
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        });

        let server = createServerByEnvironment(app);

        app.enable("trust proxy");
        app.use(express.static(path.resolve("client/build")));

        app.use(express.json());

        const MongoStore = connectStore(session);
        app.use(
            session({
                name: "sid",
                secret: process.env.SESSION_SECRET,
                store: new MongoStore({
                    mongooseConnection: mongoose.connection,
                    collection: "session"
                }),
                resave: false,
                saveUninitialized: true,
                cookie: {
                    sameSite: true,
                    secure: true
                }
            })
        );

        app.use(passport.initialize());
        app.use(passport.session());
        passportInit();

        const io = socketio(server);
        app.set("io", io);

        app.use("/api/items", routes.items);
        app.use("/api/itemCategories", routes.itemCategories);
        app.use("/api/bundles", routes.bundles);
        app.use("/api/auth", routes.auth);
        app.use("/api/items/:item_id/reviews", routes.items);
        app.use("/api/orders/", routes.orders);

        app.get("/api", (req, res) => {
            res.send("Hello world");
        });

        app.get("/", (req, res) => {
            res.sendFile("client/build/index.html", { root: path.resolve("") });
        });

        app.use((req, res, next) => {
            let err = new Error("Resource not found");
            err.status = 404;
            next(err);
        });

        app.use(errorHandler);

        server.listen(process.env.PORT, () => {
            console.log(`Server is starting on port ${process.env.PORT}`);
        });
    } catch (err) {
        console.log(err);
    }
})();

function createServerByEnvironment(app) {
    let server;
    if (process.env.NODE_ENV === "production") {
        server = http.createServer(app);
    } else {
        server = https.createServer(
            {
                pfx: fs.readFileSync(path.resolve("cert.pfx")),
                passphrase: process.env.CERT_PASS
            },
            app
        );
    }
    return server;
}
