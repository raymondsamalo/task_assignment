import { type GetTasks, type GetDevelopers, type GetSkills } from 'wasp/server/operations'
import { type GetTask, type GetDeveloper, type GetSkill } from 'wasp/server/operations'
import type { Developer } from "wasp/entities"
import type { Skill } from "wasp/entities"
import type { Task } from "wasp/entities"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { Prisma, TaskStatus } from "@prisma/client"
import { taskObjectToOutput,skillObjectsToSkills,stringToTaskStatus,developerObjectToOutput, isSubset } from "./dbUtils"
import { TaskStatusValues, TaskOutput,DeveloperOutput,} from "./dbUtils"
import { getTaskGivenIDFromDB, getDeveloperGivenNameFromDB,getSkillGivenNameFromDB } from "./dbUtils"

export const getTasks: GetTasks<void, Task[]> = async (args:any, context: any) => {
    return context.entities.Task.findMany({
        include: {
            skills: true,
            developer: true
        }
    })
}
export const getDevelopers: GetDevelopers<void, Developer[]> = async (args:any, context: any) => {
    return context.entities.Developer.findMany({
        include: {
            skills: true,
        }
    })
}
export const getSkills: GetSkills<void, Skill[]> = async (args:any, context: any) => {
    return context.entities.Skill.findMany()
}


export const getTask: GetTask<{ id: string }, TaskOutput> = async (args:any, context: any) => {
    return taskObjectToOutput(await getTaskGivenIDFromDB(args.id, context))
}
export const getDeveloper: GetDeveloper<{ name: string }, DeveloperOutput> = async (args:any, context: any) => {
       return developerObjectToOutput(await getDeveloperGivenNameFromDB(args.name, context))
}
export const getSkill: GetSkill<{ name: string }, Skill> = async (args:any, context: any) => {
    return getSkillGivenNameFromDB(args.name, context)
}