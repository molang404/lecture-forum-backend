import prisma from "../../config/prisma.ts";
import { CategoryCreateInput } from "../../generated/prisma/models/Category.ts";
import { Prisma } from "../../generated/prisma/client.ts";

const getCategoryList = async () => {
    // findMany() : 데이터베이스에서 여러 개의 row를 SELECT 하는 메서드
    // SELECT * FROM category ORDER BY id DESC
    return prisma.category.findMany({
        orderBy: {
            id: "desc",
        },
    });
};

const createCategory = async (input: CategoryCreateInput) => {
    try {
        return prisma.category.create({
            data: input,
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                throw new Error("ALREADY_EXISTS_CATEGORY_NAME");
            }
        }

        throw error;
    }
};

export default {
    getCategoryList,
    createCategory,
};
