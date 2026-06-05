import prisma from "../src/config/prisma.ts";

const mockReplyList = [
    "이건 무조건 1번",
    "2번은 ㄴㅁ 아닌데...",
    "진지하게 과학적으로 1번이야. 반박 시 내 말이 다 맞음",
    "아니 2번이 맞는데 왤케 표가 적어? 여기는 글렀다",
    "댓글창이 왜이래",
    "1빠",
    "2빠 그리고 2번임",
    "나는 그냥 커플이 싫어",
    "3번은 없냐",
    "1번 고른 사람~~",
    "2번 고르면 대머리",
    "안녕 힛",
    "됐고 그냥 배고파",
    "졸려 눕고 싶다...",
    "1번 고르면 퇴근 시켜주나?",
    "내가 짱이야",
    "난 피자가 조아",
];

async function seedReplies() {
    try {
        const posts = await prisma.post.findMany({
            where: {
                deletedAt: null,
            },
        });

        const users = await prisma.user.findMany({
            where: {
                deletedAt: null,
            },
        });

        if (posts.length === 0) {
            console.log("등록된 글이 존재하지 않습니다. 시딩을 종료합니다.");
            return;
        }
        if (users.length === 0) {
            console.log("등록된 회원이 존재하지 않습니다. 시딩을 종료합니다.");
            return;
        }

        for (const post of posts) {
            // 몇 개의 댓글을 등록할 것인가를 아래에 작성
            // Math.random() : 0 이상 1미만의 소숫점 포함 실수 (0 ~ 0.999999999)
            // targetReplyCount는 3부터 12까지의 숫자가 랜덤
            const targetReplyCount = Math.floor(Math.random() * 10) + 3;
            for (let i = 0; i < targetReplyCount; i++) {
                // 여기에 실제로 댓글이 등록되는 코드
                // 댓글을 등록하는 사용자도 랜덤으로 뽑을 것
                // 100개의 사용자가 있다면 그 중 한 명을 뽑아서 댓글 등록자로 지정
                const user = users[Math.floor(Math.random() * users.length)];
                const content = mockReplyList[Math.floor(Math.random() * mockReplyList.length)];
                if (!user) {
                    return null;
                }
                if (!content) {
                    return null;
                }

                try {
                    // 실제로 댓글을 등록하는 작업
                    // service를 이용해도 되고, prisma를 직접 이용해도 됨
                    await prisma.reply.create({
                        data: {
                            content,
                            post: { connect: { id: post.id } },
                            user: { connect: { id: user.id } },
                        },
                    });
                    console.log(
                        `[postId : ${post.id} (${i + 1}/${targetReplyCount})] 댓글 작성 완료`,
                    );
                } catch (error) {
                    console.log(
                        `[postId : ${post.id} (${i + 1}/${targetReplyCount})] 댓글 작성 실패`,
                    );
                }
            }
        }
    } catch (error) {
        console.log("댓글 등록 기능 중지됨");
    } finally {
        await prisma.$disconnect();
    }
}

seedReplies().then(() => {});
