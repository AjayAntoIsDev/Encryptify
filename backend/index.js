import express from "express";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import rateLimit from "express-rate-limit";
import cors from "cors"; 

const app = express();
const port = 8590;


app.use(cors()); 

app.use(express.json());

const adapter = new JSONFile("./db.json");
const db = new Low(adapter, { pastes: {} });

let dbInitialized = false;

(async () => {
    try {
        await db.read();
        db.data ||= { pastes: {} };
        await db.write();
        dbInitialized = true;
    } catch (error) {
        console.error("Failed to initialize the database:", error);
        process.exit(1);
    }
})();

app.use((req, res, next) => {
    if (!dbInitialized) {
        return res.status(503).json({
            error: "Database is initializing, please try again later.",
        });
    }
    next();
});

const postLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 10, 
    message: { error: "Too many POST requests, please try again later." },
});

const getLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, 
    max: 20, 
    message: { error: "Too many GET requests, please try again later." },
});

app.post("/paste", postLimiter, async (req, res) => {
    const { url, message, encrypted } = req.body;

    if (
        typeof url !== "string" ||
        typeof message !== "string" ||
        typeof encrypted !== "boolean"
    ) {
        return res.status(400).json({ error: "Invalid input" });
    }

    db.data.pastes[url] = { message, encrypted };
    await db.write();

    res.status(201).json({ message: "Paste created successfully", url });
});

app.get("/paste/:url", getLimiter, async (req, res) => {
    const { url } = req.params;

    const paste = db.data.pastes[url];
    if (!paste) {
        return res.status(404).json({ error: "Paste not found" });
    }

    res.status(200).json(paste);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
