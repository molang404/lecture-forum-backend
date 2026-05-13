import { z } from "zod";
import { GenderType } from "../../generated/prisma/enums.ts";

export const createUserSchema = z.object({
    username: z.string().min(4),
    password: z.string().min(8),
    name: z.string().min(2),
    nickname: z.string().min(2).max(10),
    email: z.email(),
    phoneNumber: z.string().optional(),
    birthdate: z.string().optional(),
    gender: z.enum(GenderType),
});

// 위에서 만든 createUserSchema는 조건을 건 객체를 만드는 일이라, 앞으로 다른 곳에서 사용할 타입을 지정해줘야 함
export type CreateUserInputType = z.infer<typeof createUserSchema>;
