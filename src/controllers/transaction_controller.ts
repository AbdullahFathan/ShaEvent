import { Response } from "express";
import { z } from "zod";
import { TransactionService } from "../services/transcation_services";
import { AuthRequest } from "../middlewares/auth_middleware";
import { sendError, sendSuccess } from "../utils/response";

const bookingSchema = z.object({
  ticketId: z.number().int().positive(),
  quantity: z.number().int().min(1).max(5),
});

export const TransactionController = {
  async create(req: AuthRequest, res: Response) {
    try {
      const { ticketId, quantity } = bookingSchema.parse(req.body);

      const userId = req.user!.id;

      const transaction = await TransactionService.bookTicket(
        userId,
        ticketId,
        quantity,
      );

      return sendSuccess(
        res,
        transaction,
        "Booking successful. Please pay before expiration.",
        201,
      );
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return sendError(res, "Validation Error", 400, error.flatten());
      }
      if (error.message === "Ticket sold out or unavailable") {
        return sendError(res, error.message, 409);
      }
      if (error.message === "Ticket not found") {
        return sendError(res, error.message, 404);
      }
      return sendError(res, error.message);
    }
  },
};
