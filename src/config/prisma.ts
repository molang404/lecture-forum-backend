import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client.ts";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

// 자바스크립트 엔진에게는 환경변수가 있을 수도 있고 없을 수도 있는 값임
const adapter = new PrismaMariaDb({
    host: process.env.DATABASE_HOST || "",
    user: process.env.DATABASE_USERNAME || "",
    password: process.env.DATABASE_PASSWORD || "",
    database: process.env.DATABASE_NAME || "",
    port: Number(process.env.DATABASE_PORT),
    connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

export default prisma;
