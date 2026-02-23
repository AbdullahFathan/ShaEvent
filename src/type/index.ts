export interface CreateTransactionInput {
  userId: number;
  ticketId: number;
  quantity: number;
  totalPrice: number;
  basePrice: number;
  expiredAt: Date;
}
