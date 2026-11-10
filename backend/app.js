import express from "express";
import { config } from "dotenv";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.js";
import adminRouter from "./routes/admin.js";
import userRouter from "./routes/user.js";
import evaluationRouter from "./routes/evaluation.js";
import chatRouter from "./routes/chat.js";
import floodRouter from "./routes/flood.js";
import cookieParser from "cookie-parser";
import axios from "axios";
import { tryCatch } from "./utils/utils.js";

const app = express();
config();

app.use(cors({
    origin: [process.env.FRONTEND_URL, "http://localhost:5173"],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);
app.use("/api/evaluate", evaluationRouter);
app.use("/api/chat", chatRouter);
app.use("/api/flood", floodRouter);
app.post("/api/classify", tryCatch(async (req, res) => {
    const query = req.body.query || "";
    console.log("Received classify request for:", query);

    // Rule-based classification matching GeoScout multi-task routing specification
    const classifyLocally = (q) => {
        // Strip emojis and leading icons from query
        const cleanQ = q.replace(/^[\s\p{Emoji}\p{Symbol}]+/u, '').trim();
        const lower = cleanQ.toLowerCase();
        if (/locate|find|detect|segment|coordinate|box|boundary|track field|parcel/i.test(lower)) {
            const transformed = lower.replace(/^(locate|find|detect|segment|return|give me|the|a|an)\s+/gi, '').trim();
            return { category: "grounding", transformed_query: transformed || cleanQ };
        }
        if (/how many|count|number of|area|dimension|perimeter|density/i.test(lower)) {
            const transformed = lower.replace(/^(how many|count|what is the area of|what is the number of|calculate|the)\s+/gi, '').trim();
            return { category: "vqa_numeric", transformed_query: transformed || cleanQ };
        }
        if (/^(is|are|was|were|do|does|can|has|have)\b/i.test(lower)) {
            return { category: "vqa_binary", transformed_query: cleanQ };
        }
        if (/what color|what type|which|what kind|what is the shape/i.test(lower)) {
            return { category: "vqa_semantic", transformed_query: cleanQ };
        }
        return { category: "captioning", transformed_query: cleanQ };
    };

    try {
        const remoteRes = await axios.post(
            process.env.INFERENCE_URL_QWEN + '/inference',
            { image_url: "dummy", query: query, category: "classify" },
            { proxy: false, timeout: 15000, headers: { 'Connection': 'keep-alive' } }
        );
        if (remoteRes.data && remoteRes.data.category) {
            return res.status(200).json({
                category: remoteRes.data.category,
                transformed_query: remoteRes.data.transformed_query || query
            });
        }
    } catch (err) {
        console.warn("Remote classify fallback triggered:", err.message);
    }

    // Fallback to local rule-based classifier
    const localResult = classifyLocally(query);
    console.log("Classified as:", localResult);
    res.status(200).json(localResult);
}));

app.get("/", (_, res) => {
    res.send("Server is working");
});

app.use(errorMiddleware);

export default app;
