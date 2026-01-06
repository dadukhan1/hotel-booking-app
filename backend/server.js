import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from "@clerk/express";
import clerkWebHooks from "./controllers/clerkWebhooks.js";
import userRouter from "./routes/user.route.js";

connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());
// api to listen clerk webhooks
app.use("/api/clerk", clerkWebHooks);

app.get("/", (req, res) => {
  res.send("Hello world!");
});
app.get("/test", (req, res) => {
  res.send("Hello test!");
});
app.use("/api/user", userRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
