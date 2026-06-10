import prisma from "../config/prisma.ts";

const getInquiryList = async (page: number, size: number) => {
    const skip = (page - 1) * size;
    const total = await prisma.inquiry.count();

    const list = await prisma.inquiry.findMany({
        orderBy: { id: "desc" },
        include: {
            user: {
                select: {
                    id: true,
                    nickname: true,
                    email: true,
                },
            },
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

const getInquiryById = async (inquiryId: number) => {
    const inquiry = await prisma.inquiry.findUnique({
        where: {
            id: inquiryId,
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
    if(!inquiry) {
        throw new Error("NOT_FOUND_INQUIRY");
    }
    return inquiry;
};

const answerInquiry = async (inquiryId : number, answer?: string) => {
    // 답변 글을 달려면, 그 대상인 글이 존재하는지 여부를 따져줘야 함
    await getInquiryById(inquiryId);

    return prisma.inquiry.update({
        where: {
            id: inquiryId,
        },
        data: {
            answer: answer ? answer : null,
            answeredAt: answer ? new Date() : null,
        }
    });
};

// javascript / typescript / java / C : null "값이 없음" > 메모리가 진짜 텅 빔
// Database                           : "데이터가 없는 상태를 나타내는 값"

export default {
    getInquiryList,
    getInquiryById,
    answerInquiry,
};
