import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'

// En Vercel la base llega como CXC_STORAGE_DATABASE_URL (almacenamiento enlazado).
const connectionString = `${process.env.DATABASE_URL ?? process.env.CXC_STORAGE_DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

export { prisma }