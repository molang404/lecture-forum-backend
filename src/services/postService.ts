import prisma from "../config/prisma.ts";
import { PostCreateInput, PostUpdateInput } from "../generated/prisma/models/Post.ts";

const getPostsByCategory = async (categoryId: number, page: number, size: number) => {
    const skip = (page - 1) * size;

    // SELECT * FROM post WHERE categoryId = categoryId AND deletedAt = NULL ORDER BY id DESC
    const list = await prisma.post.findMany({
        where: {
            categoryId,
            deletedAt: null,
        },
        orderBy: {
            id: "desc",
        },
        skip,
        take: size,
        include: {
            // user: true,     => 연관된 user 테이블의 정보를 싹 긁어옴
            user: {
                select: {
                    id: true,
                    nickname: true,
                    email: true,
                },
            },
        },
    });

    // SELECT COUNT(*) FROM post WHERE categoryId = categoryId AND deletedAt = NULL
    const total = await prisma.post.count({
        where: {
            categoryId,
            deletedAt: null,
        },
    });

    return {
        page,
        size,
        total,
        list,
    };
};

const getPostById = async (postId: number, userId?: number) => {
    // SELECT를 했는데 자료가 검색이 안되면, 어차피 post라는 변수엔 null임
    const post = await prisma.post.findUnique({
        where: {
            id: postId,
            deletedAt: null,
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

    if (!post) {
        // 이 아래쪽으로 진행을 못하도록 막기 위해, return을 쳐줌
        return null;
    }

    // 이 글의 투표에 대한 내용을 불러와야 함
    // 왜? 그걸 post에서 검색해올 때 votes를 쓰면 되지 않나? 라고 할 수 있는데
    // 이렇게 votes에 vote 테이블에 있는 정보를 덧붙이면(JOIN) 하면
    // 누가, 몇 번에, 투표했는지 정보가 다 노출됨
    // 우리가 필요한 정보는 1번에 몇 명, 2번에 몇 명 투표했는지만 알면 됨
    // 누군지는 필요없음

    const option1Count = await prisma.vote.count({
        where: {
            postId: postId,
            option: 1,
        },
    });
    const option2Count = await prisma.vote.count({
        where: {
            postId: postId,
            option: 2,
        },
    });

    // 지금 요청을 한 이 사람이 이 글에 대해 투표를 했는지 안 했는지
    let hasVoted = false;
    if (userId) {
        // finedFirst는 조건에 맞는 첫번째 데이터를 찾음
        const myVote = await prisma.vote.findFirst({
            where: {
                userId: userId,
                postId: postId,
            },
        });

        if (myVote) {
            hasVoted = true;
        }
    }
    return {
        ...post,
        vote: {
            option1Count,
            option2Count,
            totalCount: option1Count + option2Count,
            hasVoted,
        },
    };
};

const createPost = async (postData: PostCreateInput) => {
    // INSERT 쿼리를 전송
    return prisma.post.create({
        data: postData,
    });
};

const updatePost = async (postId: number, postData: PostUpdateInput) => {
    return prisma.post.update({
        where: {
            id: postId,
        },
        data: postData,
    });
};

const deletePost = async (postId: number) => {
    return prisma.post.delete({
        where: {
            id: postId,
        },
    });
};

export default {
    getPostsByCategory,
    createPost,
    updatePost,
    getPostById,
    deletePost,
};
