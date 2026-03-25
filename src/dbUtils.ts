import type { Skill } from "wasp/entities"

import { Prisma, TaskStatus } from "@prisma/client"

export const TaskStatusValues = Object.values(TaskStatus)

const taskInclude = {
  include: {
    skills: true,
    developer: true
  }
} satisfies Prisma.TaskDefaultArgs
export type TaskInclude = Prisma.TaskGetPayload<typeof taskInclude>
export type TaskOutput = {developer?:string, skills?:Array<string>, title?:string, id?:string, createdAt?:Date, status?:TaskStatus }

const developerInclude = {
  include: {
    skills: true,
  }
} satisfies Prisma.DeveloperDefaultArgs
export type DeveloperInclude = Prisma.DeveloperGetPayload<typeof developerInclude>
export type DeveloperOutput = { name?: string, skills?: Array<string> }

export function stringToTaskStatus(value: string | undefined): TaskStatus | undefined {
  if (value) {
    const formattedTaskStatus = value.toLowerCase() as keyof typeof TaskStatus;
    return TaskStatus[formattedTaskStatus]
  }
  return undefined
}

export function skillObjectsToSkills(skill_objects: Array<Skill>): Array<string> {
  var skills: Array<string> = []
  for (const skill_object of skill_objects) {
    skills.push(skill_object.name)
  }
  return skills
}

export function developerObjectToOutput(developer_object: DeveloperInclude): DeveloperOutput {
  if (!developer_object) {
    return {}
  }
  const dev_name: string = developer_object.name
  const skills: Array<string> = skillObjectsToSkills(developer_object.skills)
  return { name: dev_name, skills: skills }
}


export function taskObjectToOutput(task_object: TaskInclude): TaskOutput {
  if (!task_object) {
    return {}
  }
  const dev_name: string|undefined = task_object.developer?.name
  const skills: Array<string> = skillObjectsToSkills(task_object.skills)
  const title = task_object.title
  const createdAt = task_object.createdAt
  const id = task_object.id
  const status = task_object.status
  return { developer: dev_name, skills: skills, title:title, id:id, status:status, createdAt:createdAt }
}



export async function getTaskGivenIDFromDB(id: string, context: any): Promise<TaskInclude> {
  const object = await context.entities.Task.findFirst({
    where: {
      id: id
    },
    include: {
      skills: true,
      developer: true
    }
  })
  return object
}
export async function getDeveloperGivenNameFromDB(name: string, context: any): Promise<DeveloperInclude> {
  name = name.trim()
  const object = await context.entities.Developer.findFirst({
    where: {
      name: {
        equals: name,
        mode: 'insensitive',
      },
    },
    include: {
      skills: true
    }

  })
  return object
}

export async function getSkillGivenNameFromDB(name: string, context: any): Promise<Skill> {
  name = name.trim()
  const object = await context.entities.Skill.findFirst({
    where: {
      name: {
        equals: name,
        mode: 'insensitive',
      },
    }
  })
  return object
}
// check if every element in subset array is in parent array
export function isSubset<T>(parentArray: T[], subsetArray: T[]): boolean {
  // Create a Set from the parent array for efficient O(1) lookups.
  const parentSet = new Set(parentArray);

  // Use the .every() method to check if all elements of the subset array
  // are present in the parent Set.
  return subsetArray.every(element => parentSet.has(element));
}
