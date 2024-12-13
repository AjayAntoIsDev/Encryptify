import express from "express";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import rateLimit from "express-rate-limit";
import cors from "cors"; // Import CORS

const app = express();
const port = 3000;

// Middleware to handle CORS
app.use(cors()); // This will allow all domains by default

// Middleware to parse JSON
app.use(express.json());

// Setup LowDB
const adapter = new JSONFile("./db.json");
const db = new Low(adapter, { pastes: {} });

// Wait for the database to be initialized
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

// Middleware to ensure database is ready
app.use((req, res, next) => {
    if (!dbInitialized) {
        return res.status(503).json({
            error: "Database is initializing, please try again later.",
        });
    }
    next();
});

// Rate limiting middleware for POST requests
const postLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5, // Limit each IP to 5 POST requests per minute
    message: { error: "Too many POST requests, please try again later." },
});

// Rate limiting middleware for GET requests
const getLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10, // Limit each IP to 10 GET requests per minute
    message: { error: "Too many GET requests, please try again later." },
});

// POST /paste
app.post("/paste", postLimiter, async (req, res) => {
    const { url, message, encrypted } = req.body;

    // Validate input
    if (
        typeof url !== "string" ||
        typeof message !== "string" ||
        typeof encrypted !== "boolean"
    ) {
        return res.status(400).json({ error: "Invalid input" });
    }

    // Store the paste in the database
    db.data.pastes[url] = { message, encrypted };
    await db.write();

    res.status(201).json({ message: "Paste created successfully", url });
});

// GET /paste/:url
app.get("/paste/:url", getLimiter, async (req, res) => {
    const { url } = req.params;

    // Retrieve the paste from the database
    const paste = db.data.pastes[url];
    if (!paste) {
        return res.status(404).json({ error: "Paste not found" });
    }

    res.status(200).json(paste);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
