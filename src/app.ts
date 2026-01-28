import express, { Express, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

const app: Express = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.get("/check", (req: Request, res: Response) => {
  res.status(200).json({ message: "Server is running" });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
