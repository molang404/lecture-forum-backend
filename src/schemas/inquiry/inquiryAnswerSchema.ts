import { z } from "zod";

export const inquiryAnswerSchema = z.object({
    answer: z.string().min(1, "답변은 1글자 이상이여야 합니다."),
});

export type InquiryAnswerInputType = z.infer<typeof inquiryAnswerSchema>;
