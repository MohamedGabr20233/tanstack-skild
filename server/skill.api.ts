import { createServerFn } from "@tanstack/react-start";
import { submitSkillSchema } from "../schema/skill.schema";


export const submitSkill = createServerFn({ method: "POST" })
    .validator(submitSkillSchema)
    .handler(async (data) => {

    })