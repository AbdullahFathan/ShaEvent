import { Router } from "express";
import { UserController } from "../controllers/user_controller";

const router = Router();
const userController = new UserController();

router.post("/register", (req, res) => userController.register(req, res));

export default router;
