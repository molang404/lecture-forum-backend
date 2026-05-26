import prisma from "../../config/prisma.ts";
import {
    CategoryCreateInput,
    CategoryUpdateInput,
} from "../../generated/prisma/models/Category.ts";
import { CategoryStatus, Prisma } from "../../generated/prisma/client.ts";

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

const toggleCategoryStatus = async (id: number) => {
        const exist = await prisma.category.findUnique({
            where: {
                id,
            },
        });

        if (!exist) {
            throw new Error("CATEGORY_NOT_FOUND");
        }

        const newStatus = exist.status === CategoryStatus.ACTIVE ? CategoryStatus.INACTIVE : CategoryStatus.ACTIVE;

        return prisma.category.update({
            where: {
                id,
            },
            data: {
                status: newStatus,
            }
        });
}

const updateCategory = async (id: number, name: CategoryUpdateInput) => {
    try {
        return prisma.category.update({
            where: {
                id,
            },
            data: name,
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                throw new Error("ALREADY_EXISTS_CATEGORY_NAME");
            }
            if (error.code === "P2025") {
                throw new Error("CATEGORY_NOT_FOUND");
            }
        }

        throw error;
    }
};

export default {
    getCategoryList,
    createCategory,
    toggleCategoryStatus,
    updateCategory,
};
