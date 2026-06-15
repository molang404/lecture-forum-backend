import prisma from "../config/prisma.ts";

const getMyPost = async (userId: number, page: number, size: number) => {
    const skip = (page - 1) * size;

    const total = await prisma.post.count({
        where: {
            userId,
            deletedAt: null,
        },
    });

    const list = await prisma.post.findMany({
        orderBy: { id: "desc" },
        where: {
            userId,
        },
        skip,
        take: size,
    });

    return {
        page,
        size,
        total,
        list,
    };
};

const getMyReply = async (userId: number, page: number, size: number) => {
    const skip = (page - 1) * size;
    const total = await prisma.reply.count({
        where: {
            userId,
        },
    });

    const list = await prisma.reply.findMany({
        orderBy: { id: "desc" },
        where: {
            userId,
        },
        skip,
        take: size,
    });

    return {
        page,
        size,
        total,
        list,
    };
};

export default {
    getMyPost,
    getMyReply,
};
