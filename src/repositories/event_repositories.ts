import { CreateEventInput } from "../dto/event_dto";
import { Event } from "../../prisma/generated/prisma/client";
import { prismaApp } from "../config/prisma";

interface IEventRepository {
  createEvent(event: CreateEventInput, imageUrl: string | null): Promise<Event>;
  getAllEvent(): Promise<Event[]>;
}

export class EventRepository implements IEventRepository {
  async createEvent(
    event: CreateEventInput,
    imageUrl: string | null,
  ): Promise<Event> {
    return await prismaApp.event.create({
      data: {
        name: event.name,
        description: event.description,
        location: event.location,
        startDate: event.startDate,
        endDate: event.endDate,
        imageUrl: imageUrl,
        tickets: {
          create: event.tickets.map((ticket) => ({
            ticketType: ticket.ticketType,
            price: ticket.price,
            quota: ticket.quota,
            remainingQuota: ticket.quota,
          })),
        },
      },
      include: {
        tickets: true,
      },
    });
  }

  async getAllEvent(): Promise<Event[]> {
    return await prismaApp.event.findMany({
      include: {
        tickets: {
          select: {
            price: true,
            remainingQuota: true,
            ticketType: true,
            id: true,
          },
        },
      },
      orderBy: {
        startDate: "asc",
      },
    });
  }
}
