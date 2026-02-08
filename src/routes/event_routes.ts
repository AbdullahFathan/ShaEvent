import { Router } from "express";
import { EventController } from "../controllers/event_controller";
import { authenticateToken } from "../middlewares/auth_middleware";

const router = Router();
const eventController = new EventController();

router.post("/", authenticateToken, (req, res) =>
  eventController.createEvent(req, res),
);
router.get("/", (req, res) => eventController.getAllEvent(req, res));

export default router;
