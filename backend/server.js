// backend/server.js
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import connectDB from "./configs/db.js";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";

// routes
import userRouter from "./routes/userRoute.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import incomeRoutes from "./routes/incomeRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import walletRoutes from "./routes/walletRoutes.js";
import extraIncomeRoutes from "./routes/extraIncomeRoutes.js";
import customerRoutesLra from "./routes/customerRoutesLra.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 4000;

/* --- middleware --- */
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  // add your Render domain so dev tools don’t block cookies/CORS:
  "https://loan-management-1-0f58.onrender.com"
];
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
  })
);

/* --- connect DB, then start server --- */
(async () => {
  await connectDB();

  /* --- API routes (keep BEFORE static/fallback) --- */
  app.get("/api", (_req, res) => res.send("Loan Management System API"));
  app.use("/api/user", userRouter);
  app.use("/api/employees", employeeRoutes);
  app.use("/api/income", incomeRoutes);
  app.use("/api/expense", expenseRoutes);
  app.use("/api/customers-stl", customerRoutes);
  app.use("/api/payments", paymentRoutes);
  app.use("/api/wallet", walletRoutes);
  app.use("/api/extra-income", extraIncomeRoutes);
  app.use("/api/customers-lra", customerRoutesLra);

  /* --- serve Vite build --- */
  const buildDir = path.join(__dirname, "../frontend/dist"); // ✅ correct path
  app.use(express.static(buildDir));

  // SPA fallback (after API + static)
  app.get("*", (req, res) => {
    res.sendFile(path.join(buildDir, "index.html"));
  });

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
})();
