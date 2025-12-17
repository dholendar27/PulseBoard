import {PrismaClient} from "..//generated/prisma/client.js"
import {PrismaPg} from "@prisma/adapter-pg";
import "dotenv/config"

const connectionString: string = process.env.DATABASE_URL || "sqlite:///pulseboard.db"
console.log(connectionString)

const adapter = new PrismaPg({connectionString})
const prisma = new PrismaClient({adapter})

export default prisma
