import { z } from "zod";
import { EventService } from "../services/event_services";
import { Request, Response } from "express";
import { sendError, sendSuccess } from "../utils/response";

const createEventSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  location: z.string().min(3),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  tickets: z
    .array(
      z.object({
        ticketType: z.string().min(1),
        price: z.number().min(0),
        quota: z.number().min(1),
      }),
    )
    .min(1),
});

export class EventController {
  eventService = new EventService();

  async createEvent(req: Request, res: Response) {
    try {
      const validatedData = createEventSchema.parse(req.body);

      const event = await this.eventService.createEvent(validatedData);

      return sendSuccess(res, event, "Event created successfully", 201);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return sendError(res, "Validation Error", 400, error.flatten());
      }

      return sendError(res, "Internal Server Error", 500, error);
    }
  }

  async getAllEvent(req: Request, res: Response) {
    try {
      const events = await this.eventService.getAllEvent();

      return sendSuccess(res, events, "Events retrieved successfully");
    } catch (error: any) {
      return sendError(res, "Internal Server Error", 500, error);
    }
  }
}
