import { TransactionService } from "../services/transcation_services";
import { TransactionRepository } from "../repositories/transcation_repositories";
import { prismaApp } from "../config/prisma";

// Mock external dependencies
jest.mock("../repositories/transcation_repositories", () => ({
  TransactionRepository: {
    createBookTransaction: jest.fn(),
  },
}));
jest.mock("../config/prisma", () => ({
  prismaApp: {
    ticket: {
      findUnique: jest.fn(),
    },
  },
}));

const mockedTicketFindUnique = prismaApp.ticket.findUnique as jest.Mock;
const mockedCreateBookTransaction =
  TransactionRepository.createBookTransaction as jest.Mock;

const mockTicket = {
  id: 1,
  eventId: 10,
  ticketType: "REGULAR",
  price: 100000,
  quota: 50,
  remainingQuota: 50,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockTransaction = {
  id: 1,
  userId: 1,
  ticketId: 1,
  quantity: 2,
  basePrice: 100000,
  totalPrice: 200000,
  status: "WAITING_PAYMENT",
  expiredAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("TransactionService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─── bookTicket ───────────────────────────────────────────────────────────

  describe("bookTicket", () => {
    it("should book a ticket and return the transaction", async () => {
      mockedTicketFindUnique.mockResolvedValue(mockTicket);
      mockedCreateBookTransaction.mockResolvedValue(mockTransaction);

      const result = await TransactionService.bookTicket(1, 1, 2);

      expect(mockedTicketFindUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockedCreateBookTransaction).toHaveBeenCalledWith({
        userId: 1,
        ticketId: 1,
        quantity: 2,
        basePrice: Number(mockTicket.price),
        totalPrice: Number(mockTicket.price) * 2,
        expiredAt: expect.any(Date),
      });
      expect(result).toEqual(mockTransaction);
    });

    it("should throw 'Ticket not found' when ticket does not exist", async () => {
      mockedTicketFindUnique.mockResolvedValue(null);

      await expect(TransactionService.bookTicket(1, 999, 1)).rejects.toThrow(
        "Ticket not found",
      );
      expect(mockedCreateBookTransaction).not.toHaveBeenCalled();
    });

    it("should correctly calculate total price based on quantity", async () => {
      const quantity = 3;
      mockedTicketFindUnique.mockResolvedValue(mockTicket);
      mockedCreateBookTransaction.mockResolvedValue(mockTransaction);

      await TransactionService.bookTicket(1, 1, quantity);

      expect(mockedCreateBookTransaction).toHaveBeenCalledWith(
        expect.objectContaining({
          totalPrice: Number(mockTicket.price) * quantity,
        }),
      );
    });

    it("should set expiredAt 15 minutes in the future", async () => {
      mockedTicketFindUnique.mockResolvedValue(mockTicket);
      mockedCreateBookTransaction.mockResolvedValue(mockTransaction);

      const before = new Date();
      await TransactionService.bookTicket(1, 1, 1);
      const after = new Date();

      const call = mockedCreateBookTransaction.mock.calls[0][0];
      const expiredAt: Date = call.expiredAt;

      // expiredAt should be roughly 15 minutes from now
      expect(expiredAt.getTime()).toBeGreaterThanOrEqual(
        before.getTime() + 14 * 60 * 1000,
      );
      expect(expiredAt.getTime()).toBeLessThanOrEqual(
        after.getTime() + 16 * 60 * 1000,
      );
    });
  });
});
