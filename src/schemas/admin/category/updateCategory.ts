import { z } from "zod";

export const adminUpdateCategorySchema = z.object({
    name: z
        .string()
        .min(1, "카테고리명을 입력해주세요.")
        .max(50, "카테고리명은 최대 50자를 초과할 수 없습니다."),
});

export type AdminUpdateCategoryInputType = z.infer<typeof adminUpdateCategorySchema>;

// 카테고리 수정을 위해서 받아야 되는 값 : id, name
// 1. 아이디와 네임 둘 다 body로 받겠다
// 2. 아이디는 경로 받고, name은 body로 받겠다 -> body로 받을 땐 schema