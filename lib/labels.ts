import { CompetitionCategory, SkillLevel } from "@/lib/generated/prisma/enums";

export const categoryLabels: Record<CompetitionCategory, string> = {
  MENS_SINGLE: "ชายเดี่ยว",
  WOMENS_SINGLE: "หญิงเดี่ยว",
  MENS_DOUBLE: "ชายคู่",
  WOMENS_DOUBLE: "หญิงคู่",
  MIXED_DOUBLE: "คู่ผสม",
};

export const skillLevelLabels: Record<SkillLevel, string> = {
  N: "มือ N",
  S: "มือ S",
  C: "มือ C",
};

export const categoryOptions = Object.entries(categoryLabels).map(
  ([value, label]) => ({
    value: value as CompetitionCategory,
    label,
  }),
);

export const skillLevelOptions = Object.entries(skillLevelLabels).map(
  ([value, label]) => ({
    value: value as SkillLevel,
    label,
  }),
);
