import prisma from "../../config/prisma.ts";

const getUserList = async () => {
    return prisma.user.findMany({
        orderBy: {
            id: "desc",
        },
    });
};

const createUser = async () => {

}

export default {
    getUserList,
};