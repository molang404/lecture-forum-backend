import prisma from "../config/prisma.ts";

const getRepliesByPostId = async (postId: number, page: number, size: number) => {
    // 목록을 불러오는 목적의 service니까
    // pagination도 해야 되는구나 => skip, take를 써야함
    const skip = (page - 1) * size;

    const total = await prisma.reply.count({
        where: { postId },
    });

    const list = await prisma.reply.findMany({
        where: {
            postId,
        },
        take: size,
        skip,
        orderBy: { id: "asc" },
        include: {
            user: {
                select: {
                    id: true,
                    nickname: true,
                },
            },
        },
    });

    return {
        page,
        size,
        total,
        list,
    };
};

const createReply = async (userId: number, postId: number, content: string) => {
    // 이 댓글이 달릴 글이 살아있는 글인가 체크를 먼저 함
    // 그러면 왜 userId 살아있는 사용자는 체크 안 함?
    // 왜냐하면, 이미 authenticate 미들웨어가 사용자는 살아있디고 해줌
    const post = await prisma.post.findFirst({
        where: {
            id: postId,
            deletedAt: null,
        },
    });

    if (!post) {
        throw new Error("NOT_FOUND");
    }

    return prisma.reply.create({
        data: {
            userId,
            postId,
            content,
        },
        include: {
            user: {
                select: {
                    id: true,
                    nickname: true,
                    email: true,
                },
            },
        },
    });
    // 이렇게 prisma.reply.create()를 실행하면, 생성"된" Reply 객체가 리턴
};

const deleteReply = async (id: number, userId: number) => {
    const reply = await prisma.reply.findUnique({
        where: {
            id,
        },
    });
    if (!reply) {
        throw new Error("NOT_FOUND_REPLY");
    }
    if (reply.userId !== userId) {
        throw new Error("FORBIDDEN");
    }
    prisma.reply.delete({
        where: {
            id,
        },
    });
};

export default {
    createReply,
    getRepliesByPostId,
    deleteReply,
};
