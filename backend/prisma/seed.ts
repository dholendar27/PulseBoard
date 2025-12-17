import {PrismaClient} from "../src/generated/prisma/client.js"
import {PrismaPg} from "@prisma/adapter-pg";
import {hashPassword} from "../src/utils/passwordhash.js";
import "dotenv/config"

const connectionString: string = process.env.DATABASE_URL || "sqlite:///pulseboard.db"
const password: string = process.env["ADMIN_PASSWORD"] || "Admin@123"
console.log(connectionString, password)

const adapter = new PrismaPg({connectionString})
const prisma = new PrismaClient({adapter})

async function seed() {
    const admin = await prisma.user.create({
        data: {
            first_name:"admin",
            last_name: "user",
            email: "admin@pulseboard.com",
            password: await hashPassword(password)
        }
    })
}

seed().then(
    async () => {
        await prisma.$disconnect()
    }
)