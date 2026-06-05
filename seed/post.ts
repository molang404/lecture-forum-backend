import categoryService from "../src/services/categoryService.ts";
import prisma from "../src/config/prisma.ts";
import { PostCreateInput } from "../src/generated/prisma/models/Post.ts";
import postService from "../src/services/postService.ts";

const mockPostList = [
    {
        title: "탕수육 먹을 때 소스는?",
        option1Text: "무조건 부먹",
        option2Text: "바삭하게 찍먹",
    },
    {
        title: "강아지 vs 고양이",
        option1Text: "강아지가 귀여워",
        option2Text: "고양이가 세상을 지배한다",
    },
    {
        title: "치킨 vs 피자",
        option1Text: "치킨이 짱",
        option2Text: "피자가 더 맛있어",
    },
    {
        title: "치킨 먹을 때",
        option1Text: "다리가 조아",
        option2Text: "날개가 조아",
    },
    {
        title: "돼지고기 vs 소고기",
        option1Text: "무조건 소고기 아님?",
        option2Text: "비싸기만 하고 느끼해 돼지고기",
    },
    {
        title: "깻잎논쟁",
        option1Text: "헤어져",
        option2Text: "그게 머가 어때서",
    },
    {
        title: "새우논쟁",
        option1Text: "바람",
        option2Text: "상관 없는데 매너지",
    },
    {
        title: "출근시간",
        option1Text: "무조건 5~10분 전",
        option2Text: "아냐 정각이야 계약서대로 해야지",
    },
    {
        title: "민트초코 vs 레인보우샤베트",
        option1Text: "민트초코",
        option2Text: "레샤",
    },
    {
        title: "무쌍 vs 유쌍",
        option1Text: "남자든 여자든 쌍커풀이 더 예쁘지",
        option2Text: "무쌍이 유니크하고 더 좋아",
    },
];

async function seedPosts() {
    try {
        const categories = await categoryService.getActiveCategories();

        const users = await prisma.user.findMany({
            where: {
                deletedAt: null,
            },
        });

        if (categories.length === 0) {
            console.log("활성화된 카테고리가 없습니다. 시딩을 중단합니다.");
            return;
        }
        if (users.length === 0) {
            console.log("작성자로 지정할 유저가 없습니다. 시딩을 중단합니다.");
            return;
        }

        const postsPerCategory = 30;

        for (const category of categories) {
            // categories를 순회시키는 역할
            for (let i = 0; i < postsPerCategory; i++) {
                // 글 등록 역할 (0 ~ 30)
                const topic = mockPostList[Math.floor(Math.random() * mockPostList.length)]; // 쓸 글 내용을 랜덤 선택
                const user = users[Math.floor(Math.random() * users.length)]; // 작성자로 등록할 사용자를 랜덤 선택

                if (!topic) {
                    return null;
                }

                if (!user) {
                    return null;
                }

                const dummyData: PostCreateInput = {
                    title: topic.title,
                    option1Text: topic.option1Text,
                    option2Text: topic.option2Text,
                    content:
                        "이 게시물은 토론대난투 시스템을 검증하기 위해 생성된 자동화 텍스트 글입니다. \n\n" +
                        "과연 여러분의 선택은 어느쪽인가요? \n" +
                        `1번 ${topic.option1Text} 과 2번 ${topic.option2Text} 중에 마음에 드는 진영에 투표하고,` +
                        "아래 댓글 창에서 논리 제압을 시작해주세요!",
                    category: { connect: { id: category.id } },
                    user: { connect: { id: user.id } },
                };

                try {
                    await postService.createPost(dummyData);
                    console.log(
                        `[${i}/${postsPerCategory} : 카테고리ID(${category.id})] 게시물 등록 성공`,
                    );
                } catch (error) {
                    console.log(
                        `[${i}/${postsPerCategory} : 카테고리ID(${category.id})] 게시물 등록 실패`,
                    );
                }
            }
        }
    } catch (error) {
        console.log("시딩 작업 중 오류가 발생되었습니다.", error);
    } finally {
        await prisma.$disconnect(); // 데이터베이스 연결을 끊는 메서드
    }
}

seedPosts().then(() => {});
