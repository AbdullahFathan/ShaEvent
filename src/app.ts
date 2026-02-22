import "dotenv/config";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import userRoutes from "./routes/user_routes";
import eventRoutes from "./routes/event_routes";
import transactionRoutes from "./routes/transaction_route";

const app: Express = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.get("/check", (req: Request, res: Response) => {
  res.status(200).json({ message: "Server is running" });
});

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/transactions", transactionRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
