import { prismaApp } from "../config/prisma";
import { CreateTransactionInput } from "../type";

export const TransactionRepository = {
  async createBookTransaction(data: CreateTransactionInput) {
    return await prismaApp.$transaction(async (tx) => {
      const updateTicket = await tx.ticket.updateMany({
        where: {
          id: data.ticketId,
          remainingQuota: {
            gte: data.quantity,
          },
        },
        data: {
          remainingQuota: {
            decrement: data.quantity,
          },
        },
      });

      if (updateTicket.count === 0) {
        throw new Error("Ticket sold out or unavailable");
      }

      const newTransaction = await tx.transaction.create({
        data: {
          userId: data.userId,
          ticketId: data.ticketId,
          quantity: data.quantity,
          totalPrice: data.totalPrice,
          basePrice: data.basePrice,
          status: "WAITING_PAYMENT",
          expiredAt: data.expiredAt,
          discount: 0,
        },
      });

      return newTransaction;
    });
  },
};
