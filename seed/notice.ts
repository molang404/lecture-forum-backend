import prisma from "../src/config/prisma.ts";

const mockNoticeList = [
    {
        title: "서비스 점검 안내",
        content:
            "보다 안정적인 서비스 제공을 위해 6월 15일 오전 2시부터 오전 4시까지 시스템 점검이 진행됩니다. 점검 시간 동안 일부 기능 이용이 제한될 수 있습니다.",
    },
    {
        title: "신규 기능 업데이트 안내",
        content:
            "회원 여러분의 의견을 반영하여 게시글 검색 기능이 추가되었습니다. 제목과 내용을 기준으로 원하는 게시글을 더욱 빠르게 찾을 수 있습니다.",
    },
    {
        title: "개인정보 처리방침 개정 안내",
        content:
            "개인정보 보호 강화를 위해 개인정보 처리방침이 일부 개정되었습니다. 변경된 내용은 공지사항 및 이용약관 페이지에서 확인하실 수 있습니다.",
    },
    {
        title: "커뮤니티 이용 수칙 안내",
        content:
            "건전한 커뮤니티 문화 조성을 위해 욕설, 비방, 허위사실 유포 등의 행위는 제재 대상이 될 수 있습니다. 이용 수칙을 준수해 주시기 바랍니다.",
    },
    {
        title: "서버 안정화 작업 완료",
        content:
            "최근 발생한 접속 지연 현상 개선을 위한 서버 안정화 작업이 완료되었습니다. 현재 모든 서비스가 정상적으로 운영되고 있습니다.",
    },
    {
        title: "이벤트 당첨자 발표",
        content:
            "5월 신규 회원 가입 이벤트 당첨자가 선정되었습니다. 당첨자에게는 개별 안내가 진행될 예정이며, 경품은 순차적으로 발송됩니다.",
    },
    {
        title: "게시글 신고 기능 추가 안내",
        content:
            "부적절한 게시글을 보다 쉽게 신고할 수 있도록 신고 기능이 추가되었습니다. 신고된 게시글은 운영진 검토 후 조치됩니다.",
    },
    {
        title: "모바일 환경 최적화 업데이트",
        content:
            "모바일 기기에서 더욱 편리하게 이용할 수 있도록 UI 및 성능 개선 작업이 적용되었습니다.",
    },
    {
        title: "서비스 이용약관 개정 안내",
        content:
            "서비스 운영 정책 변경에 따라 이용약관 일부 조항이 개정되었습니다. 변경 사항은 7일 후부터 적용될 예정입니다.",
    },
    {
        title: "공지사항 게시판 오픈",
        content:
            "서비스 관련 소식과 안내 사항을 전달하기 위해 공지사항 게시판이 새롭게 오픈되었습니다. 앞으로 다양한 정보를 제공해 드리겠습니다.",
    },
];

async function seedNotice() {
    try {
        const Notices = await prisma.notice.findMany({
            orderBy: {
                id: "desc",
            },
        });

        if (Notices.length === 0) {
            console.log("등록된 글이 존재하지 않습니다. 시딩을 종료합니다.");
            return;
        }

        const noticePerCount = 30;

        for (const notice of Notices) {
            for (let i = 0; i < noticePerCount; i++) {
                const topic = mockNoticeList[Math.floor(Math.random() * mockNoticeList.length)];

                if (!topic) {
                    return null;
                }

                try {
                    await prisma.notice.create({
                        data: {
                            title: topic.title,
                            content: topic.content,
                        },
                    });
                    console.log(
                        `[${i}/${noticePerCount} : 공지사항ID(${notice.id})] 공지사항 등록 성공`,
                    );
                } catch (error) {
                    console.log(
                        `[${i}/${noticePerCount} : 공지사항ID(${notice.id})] 공지사항 등록 실패`,
                    );
                }
            }
        }
    } catch (error) {
        console.log("시딩 작업 중 오류가 발생되었습니다.", error);
    } finally {
        await prisma.$disconnect();
    }
}

seedNotice().then(() => {});
