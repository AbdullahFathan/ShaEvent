import { Router } from "express";
import { UserController } from "../controllers/user_controller";
import { authenticateToken } from "../middlewares/auth_middleware";

const router = Router();
const userController = new UserController();

router.post("/register", (req, res) => userController.register(req, res));
router.post("/login", (req, res) => userController.login(req, res));

router.get("/me", authenticateToken, (req, res) => userController.me(req, res));

export default router;
