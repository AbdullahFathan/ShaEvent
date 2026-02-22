import { Router } from "express";
import { TransactionController } from "../controllers/transaction_controller";
import { authenticateToken } from "../middlewares/auth_middleware";

const router = Router();

router.post("/", authenticateToken, (req, res) => {
  TransactionController.create(req, res);
});

export default router;
