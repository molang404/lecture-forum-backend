import { z } from "zod";

export const updatePostSchema = z.object({
    title: z.string().min(1, "제목을 입력해주세요.").max(255, "제목은 255자를 넘을 수 없습니다."),
    content: z.string().min(1, "내용을 입력해주세요."),
    option1Text: z.string().max(50, "투표 선택지 내용은 50자 이하로 입력해주세요.").optional(),
    option2Text: z.string().max(50, "투표 선택지 내용은 50자 이하로 입력해주세요.").optional(),
});

export type UpdatePostInputType = z.infer<typeof updatePostSchema>;
