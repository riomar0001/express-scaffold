import express, { Response, Request } from "express";
import cookieParser from "cookie-parser";

import cors from "cors";
import path from "path";
import fs from "fs";
import helmet from "helmet";

import authRouter from "./v1/routes/authentication.route";
import { errorHandler, notFound } from "./v1/middlewares/error.middleware";
import { cacheControl } from "./v1/middlewares/cacheControl.middleware";

//load environment variables
import "@/configs/dotenv.config";

const app = express();

// ---------- SECURITY & PERFORMANCE MIDDLEWARE ----------
app.use(helmet());
app.use(cacheControl);
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ---------- CORS CONFIGURATION ----------
const allowedOrigins = ["http://localhost:5173", "http://localhost:3000"];
app.use(
  cors({
    origin: (origin: string | undefined, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error(`Blocked by CORS: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

// ---------- ROUTES ----------
app.use("/api/v1/auth", authRouter);

// ---------- SERVE FRONTEND ----------
app.get("/", (req: Request, res: Response) => {
  const distPath = path.join(__dirname, "../frontend/dist", "index.html");

  if (fs.existsSync(distPath)) {
    return res.sendFile(distPath);
  } else {
    return res.json({ message: "Hello World" });
  }
});

// ---------- 404 HANDLER ----------
app.use(notFound);

// ---------- ERROR HANDLER ----------
app.use(errorHandler);

export default app;
