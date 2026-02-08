export interface CreateEventInput {
  name: string;
  description?: string;
  location: string;
  startDate: Date;
  endDate: Date;
  tickets: {
    ticketType: string;
    price: number;
    quota: number;
  }[];
}
