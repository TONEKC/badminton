import { CompetitionCategory, SkillLevel } from "@/lib/generated/prisma/enums";
import { z } from "zod";

export const registrationFieldsSchema = z.object({
  fullName: z.string().trim().min(2, "กรุณากรอกชื่อ-นามสกุล"),
  phone: z
    .string()
    .trim()
    .min(8, "เบอร์โทรสั้นเกินไป")
    .max(30, "เบอร์โทรยาวเกินไป"),
  email: z.string().trim().email("รูปแบบอีเมลไม่ถูกต้อง"),
  category: z.enum(CompetitionCategory),
  skillLevel: z.enum(SkillLevel),
  clubName: z.string().trim().min(1, "กรุณากรอกชื่อสังกัด/ชมรม"),
});

export const createRegistrationSchema = registrationFieldsSchema.extend({
  password: z.string().min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"),
});

export const applicantLoginSchema = z.object({
  referenceCode: z.string().trim().min(6),
  password: z.string().min(1),
});

export const adminLoginSchema = z.object({
  username: z.string().trim().min(1),
  password: z.string().min(1),
});
