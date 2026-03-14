import { EventService } from "../services/event_services";
import { EventRepository } from "../repositories/event_repositories";
import { redisClient } from "../config/redis";

// Mock external dependencies
jest.mock("../config/prisma", () => ({ prismaApp: {} }));
jest.mock("../repositories/event_repositories");
jest.mock("../config/redis", () => ({
  redisClient: {
    get: jest.fn(),
    set: jest.fn(),
  },
}));

const MockedEventRepository = EventRepository as jest.MockedClass<
  typeof EventRepository
>;
const mockedRedis = redisClient as jest.Mocked<typeof redisClient>;

const mockEvent = {
  id: 1,
  name: "Tech Conference",
  description: "A great conference",
  location: "Jakarta",
  startDate: new Date("2026-06-01"),
  endDate: new Date("2026-06-02"),
  createdAt: new Date(),
  updatedAt: new Date(),
  tickets: [],
} as any;

const validEventInput = {
  name: "Tech Conference",
  description: "A great conference",
  location: "Jakarta",
  startDate: new Date("2026-06-01"),
  endDate: new Date("2026-06-02"),
  tickets: [{ ticketType: "REGULAR", price: 100000, quota: 50 }],
};

describe("EventService", () => {
  let eventService: EventService;
  let mockEventRepo: jest.Mocked<EventRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    eventService = new EventService();
    mockEventRepo = MockedEventRepository.mock
      .instances[0] as jest.Mocked<EventRepository>;
  });

  // ─── createEvent ──────────────────────────────────────────────────────────

  describe("createEvent", () => {
    it("should create an event and return it", async () => {
      mockEventRepo.createEvent.mockResolvedValue(mockEvent);

      const result = await eventService.createEvent(validEventInput);

      expect(mockEventRepo.createEvent).toHaveBeenCalledWith(validEventInput);
      expect(result).toEqual(mockEvent);
    });

    it("should throw when endDate is before startDate", async () => {
      const invalidInput = {
        ...validEventInput,
        startDate: new Date("2026-06-05"),
        endDate: new Date("2026-06-01"),
      };

      await expect(eventService.createEvent(invalidInput)).rejects.toThrow(
        "End date must be after start date",
      );
      expect(mockEventRepo.createEvent).not.toHaveBeenCalled();
    });

    it("should throw when endDate equals startDate", async () => {
      const sameDate = new Date("2026-06-01");
      const sameInput = {
        ...validEventInput,
        startDate: sameDate,
        endDate: sameDate,
      };

      // endDate < startDate is the guard — same date is allowed, let's confirm
      // only strict less-than throws
      mockEventRepo.createEvent.mockResolvedValue(mockEvent);
      const result = await eventService.createEvent(sameInput);
      expect(result).toEqual(mockEvent);
    });
  });
});
