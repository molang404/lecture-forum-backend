import prisma from "../config/prisma.ts";

const getMyDashboardSummary = async (userId: number, postPage: number, replyPage: number, size: number) => {
    const postSkip = (postPage - 1) * size;
    const replySkip = (replyPage - 1) * size;

    const [postTotal, replyTotal] = await Promise.all([
        await prisma.post.count({
            where: {
                userId,
                deletedAt: null,
            },
        }),
        await prisma.reply.count({
            where: {
                userId,
            },
        }),
    ]);

    const [posts, replies] = await Promise.all([
        await prisma.post.findMany({
            where: {
                userId,
                deletedAt: null,
            },
            orderBy: {
                createdAt: "desc",
            },
            skip: postSkip,
            take: size,
        }),
        await prisma.reply.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: "desc",
            },
            skip: replySkip,
            take: size,
        }),
    ]);

    return {
        postTotal,
        replyTotal,
        posts,
        replies,
        postPage,
        replyPage,
        size,
    };
};

export default {
    getMyDashboardSummary,
};
