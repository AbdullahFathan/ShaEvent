import cron from "node-cron";
import { prismaApp } from "../config/prisma";

export const PaymentExpiryJob = {
  start() {
    cron.schedule("* * * * *", async () => {
      console.log("[CRON] Checking for expired transactions...");

      try {
        const now = new Date();
        const expiredTransactions = await prismaApp.transaction.findMany({
          where: {
            status: "WAITING_PAYMENT",
            expiredAt: {
              lt: now,
            },
          },
        });

        if (expiredTransactions.length === 0) {
          console.log(`[CRON] No expired transactions found.`);
          return;
        }

        console.log(
          `[CRON] Found ${expiredTransactions.length} expired transactions. Reverting quotas...`,
        );
        for (const trx of expiredTransactions) {
          await prismaApp.$transaction([
            prismaApp.transaction.update({
              where: { id: trx.id },
              data: { status: "EXPIRED" },
            }),
            prismaApp.ticket.updateMany({
              where: { id: trx.ticketId },
              data: {
                remainingQuota: {
                  increment: trx.quantity,
                },
              },
            }),
          ]);
        }

        console.log("[CRON] Successfully reverted expired transactions.");
      } catch (error) {
        console.error("[CRON] Failed to process expired transactions:", error);
      }
    });
  },
};
