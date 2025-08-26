import express from "express";
import cors from "cors";
import router from "./app/routes";
import http from "http";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { noRouteFound } from "./app/utils/serverTools/noRouteFound";
import cookieParser from "cookie-parser";
import path from "path";
import compression from "compression";
import { limiter } from "./app/utils/serverTools/rateLimite";
import helmet from "helmet";
import morgan from "morgan";
import { UserSubscriptionController } from "./app/modules/user_subscription/user_subscription.controller";
const app = express();

const corsOption = {
  origin: ["*", "http://localhost:3000"], // need to add real htp link like "https://yourdomain.com", "http://localhost:3000"
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  credentials: true,
};

app.use(helmet());
app.use(morgan("combined"));
app.use(compression());
app.use(cors(corsOption));
app.use(cookieParser());

app.use(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  UserSubscriptionController.stripeWebhook
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);

app.use("/api", router);

app.get("/", (req, res) => {
  res.send("Hello World! This app name is Sass based crm");
});

app.use(express.static(path.join(process.cwd(), "uploads")));

app.use(globalErrorHandler);
app.use(noRouteFound);
const server = http.createServer(app);

export default server;
