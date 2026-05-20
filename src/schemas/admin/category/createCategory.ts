import { z } from "zod";

export const adminCreateCategorySchema = z.object({
    name: z
        .string()
        .min(1, "카테고리 명을 입력해주세요.")
        .max(50, "카테고리 명은 최대 50자를 초과할 수 없습니다."),
});

export type AdminCreateCategoryInputType = z.infer<typeof adminCreateCategorySchema>;
