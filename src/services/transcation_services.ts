import { TransactionRepository } from "../repositories/transcation_repositories";
import { prismaApp } from "../config/prisma";

export const TransactionService = {
  async bookTicket(userId: number, ticketId: number, quantity: number) {
    const ticket = await prismaApp.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      throw new Error("Ticket not found");
    }
    const totalPrice = Number(ticket.price) * quantity;

    const expiredAt = new Date();
    expiredAt.setMinutes(expiredAt.getMinutes() + 15);

    const transaction = await TransactionRepository.createBookTransaction({
      userId,
      ticketId,
      quantity,
      basePrice: Number(ticket.price),
      totalPrice,
      expiredAt,
    });

    return transaction;
  },
};
