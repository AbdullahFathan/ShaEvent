import { Router } from "express";
import { EventController } from "../controllers/event_controller";
import { authenticateToken } from "../middlewares/auth_middleware";
import { uploadToMemory } from "../middlewares/upload_middleware";

const router = Router();
const eventController = new EventController();

router.post(
  "/",
  authenticateToken,
  uploadToMemory.single("poster"),
  (req, res) => eventController.createEvent(req, res),
);
router.get("/", (req, res) => eventController.getAllEvent(req, res));

export default router;
