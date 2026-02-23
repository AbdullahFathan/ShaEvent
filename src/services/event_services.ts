import { EventRepository } from "../repositories/event_repositories";
import { CreateEventInput } from "../dto/event_dto";
import { Event } from "../../prisma/generated/prisma/client";
import { redisClient } from "../config/redis";

export class EventService {
  eventRepo = new EventRepository();

  async createEvent(event: CreateEventInput): Promise<Event> {
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);

    if (endDate < startDate) {
      throw new Error("End date must be after start date");
    }

    const newEvent = await this.eventRepo.createEvent(event);
    return newEvent;
  }

  async getAllEvent(): Promise<Event[]> {
    const cacheKey = "all_events";
    const cachedEvents = await redisClient.get(cacheKey);
    if (cachedEvents) {
      return JSON.parse(cachedEvents);
    }
    const events = await this.eventRepo.getAllEvent();
    await redisClient.set(cacheKey, JSON.stringify(events), {
      EX: 10,
    });
    return events;
  }
}
