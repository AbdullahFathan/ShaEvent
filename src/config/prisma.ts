import { configApp } from "./config_app";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../prisma/generated/prisma/client";

const connectionString = `${configApp.db.url}`;

const adapter = new PrismaPg({ connectionString });
const prismaApp = new PrismaClient({ adapter });

export { prismaApp };
