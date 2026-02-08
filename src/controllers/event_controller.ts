import { z } from "zod";
import { EventService } from "../services/event_services";
import { Request, Response } from "express";

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

      res.status(200).json({
        success: true,
        data: event,
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.message });
      }

      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error,
      });
    }
  }

  async getAllEvent(req: Request, res: Response) {
    try {
      const events = await this.eventService.getAllEvent();

      res.status(200).json({
        success: true,
        data: events,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error,
      });
    }
  }
}
