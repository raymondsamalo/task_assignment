import type { GetSkill } from "wasp/server/api"
import type { ListSkill } from "wasp/server/api"
import type { Skill } from "wasp/entities"

import type { GetDeveloper } from "wasp/server/api"
import type { ListDeveloper } from "wasp/server/api"
import type { Developer } from "wasp/entities"

import type { GetTask } from "wasp/server/api"
import type { ListTask } from "wasp/server/api"
import type { Task } from "wasp/entities"
import type { CreateTask, UpdateTask } from "wasp/server/api"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { Prisma, TaskStatus } from "@prisma/client"
import { object, z } from 'zod';

const TaskStatusValues = Object.values(TaskStatus)

const taskInclude = {
  include: {
    skills: true,
    developer: true
  }
} satisfies Prisma.TaskDefaultArgs
type TaskInclude = Prisma.TaskGetPayload<typeof taskInclude>
type TaskOutput = {developer?:string, skills?:Array<string>, title?:string, id?:string, createdAt?:Date, status?:TaskStatus }

const developerInclude = {
  include: {
    skills: true,
  }
} satisfies Prisma.DeveloperDefaultArgs
type DeveloperInclude = Prisma.DeveloperGetPayload<typeof developerInclude>
type DeveloperOutput = { name?: string, skills?: Array<string> }

function stringToTaskStatus(value: string | undefined): TaskStatus | undefined {
  if (value) {
    const formattedTaskStatus = value.toLowerCase() as keyof typeof TaskStatus;
    return TaskStatus[formattedTaskStatus]
  }
  return undefined
}

function skillObjectsToSkills(skill_objects: Array<Skill>): Array<string> {
  var skills: Array<string> = []
  for (const skill_object of skill_objects) {
    skills.push(skill_object.name)
  }
  return skills
}

function developerObjectToOutput(developer_object: DeveloperInclude): DeveloperOutput {
  if (!developer_object) {
    return {}
  }
  const dev_name: string = developer_object.name
  const skills: Array<string> = skillObjectsToSkills(developer_object.skills)
  return { name: dev_name, skills: skills }
}


function taskObjectToOutput(task_object: TaskInclude): TaskOutput {
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

export const createTask: CreateTask<{ title: string }> = async (req, res, context: any) => {
  const CreateTaskBody = z.object({
    title: z.string(),
    skills: z.array(z.string()),
  })
  const result = CreateTaskBody.safeParse(req.body);
  if (!result.success) {
    // If validation fails, send a 400 error with details
    return res.status(400).json({
      error: "Validation failed",
      details: result.error.format()
    });
  }

  const { title, skills } = result.data
  console.log("CREATE TASK CALLED '%s' title", title)
  try {
    const object = await context.entities.Task.create({
      data: {
        title: title
      }
    })
    console.log("CREATE TASK CREATED '%s' title", title)

    res.set("Access-Control-Allow-Origin", "*"); // Example of modifying headers to override Wasp default CORS middleware.
    res.json(taskObjectToOutput(object));

  } catch (e) {
    console.log("CREATE TASK CREATED '%s' title", title)
    if (e instanceof PrismaClientKnownRequestError) {
      const err: PrismaClientKnownRequestError = e
      // The .code property can be accessed in a type-safe manner
      if (err.code === "P2002") {
        console.log(
          "There is a unique constraint violation, a new task cannot be created with this title",
        );
        res.json({ "err": "There is existing task with the same title", "code": 409 })
        res.sendStatus(409)
      } else {
        throw e
      }
    } else {
      throw e
    }
  }
};

async function getTaskGivenIDFromDB(id: string, context: any): Promise<TaskInclude> {
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
async function getDeveloperGivenNameFromDB(name: string, context: any): Promise<DeveloperInclude> {
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
// check if every element in subset array is in parent array
function isSubset<T>(parentArray: T[], subsetArray: T[]): boolean {
  // Create a Set from the parent array for efficient O(1) lookups.
  const parentSet = new Set(parentArray);

  // Use the .every() method to check if all elements of the subset array
  // are present in the parent Set.
  return subsetArray.every(element => parentSet.has(element));
}

export const updateTask: UpdateTask<{ id: string }> = async (req, res, context: any) => {
  var id = ""
  try {
    id = req.params.id
  } catch (error) {
    res.status(400).json({
      error: "Validation failed",
      details: "Missing ID"
    });
  }
  const task_object = await getTaskGivenIDFromDB(id, context)
  if (!task_object) {
    return res.status(404).json({
      error: "Task not found",
      details: "Task id " + id + " Not Found"
    });
  }
  const task_skills = skillObjectsToSkills(task_object.skills)
  console.log("Task Skills "+task_skills)
  // handle developer and status from body
  const UpdateTaskBody = z.object({
    developer: z.string().optional(),
    status: z.string().optional(),
  }).superRefine((values, ctx) => {
    if (!values.developer && !values.status) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Either developer or status must be provided",
        path: ['developer', 'status'], // You can add the issue to a specific path or the object root
      });
    }
  });
  const result = UpdateTaskBody.safeParse(req.body);
  if (!result.success) {
    // If validation fails, send a 400 error with details
    return res.status(400).json({
      error: "Validation failed",
      details: result.error.format()
    });
  }
  // If we reach here, 'data' is typed and validated!
  const { developer, status } = result.data;
  var data: {
    developerId?: string,
    status?: string
  } = {}
  // if update include status
  const task_status = stringToTaskStatus(status)
  if (task_status) {
    if (!TaskStatusValues.includes(task_status)) {
      return res.status(400).json({
        error: "unknown status",
        details: "status " + task_status + " is not known"
      })
    }
    data.status = status
    console.log("Valid status "+status)
  }
  // if the update is to assign developer
  if (developer) {
    // check whether task has defined skill set
    if (task_skills.length == 0) {
      return res.status(400).json({
        error: "Validation failed",
        details: "We can only assign task that has defined skill set"
      });
    }
    // validate whether developer existed
    const developer_object = await getDeveloperGivenNameFromDB(developer, context)
    if (!developer_object) {
      return res.status(404).json({
        error: "Developer not found",
        details: "Developer " + developer + " Not Found"
      });
    }
    // validate whether developer has sufficient skills
    const developer_skills = skillObjectsToSkills(developer_object.skills)
    if (!isSubset(developer_skills, task_skills)) {
      return res.status(400).json({
        error: "Developer skills mismatch",
        details: "Developer " + developer + " does not have matching skill set"
      });
    }
    data.developerId = developer_object.id
  }


  const updatedTask=await context.entities.Task.update({
    where: {
      id: task_object.id
    }, data: data, includes:{
      developer: true,
      skills:true
    }
  })
  console.log("UPDATE TASK  {id:'%s',status:'%s',developer:'%s'", id, status, developer)
  res.set("Access-Control-Allow-Origin", "*"); // Example of modifying headers to override Wasp default CORS middleware.
  res.json(taskObjectToOutput(updatedTask));
};

export const getTask: GetTask<{ id: string }, TaskOutput> = async (req, res, context: any) => {
  const id = req.params.id
  const object = await context.entities.Task.findFirst({
    where: {
      id: id
    },includes:{
      developer: true,
      skills:true
    }
  })
  if (!object) {
    res.sendStatus(404)
  }
  res.set("Access-Control-Allow-Origin", "*"); // Example of modifying headers to override Wasp default CORS middleware.
  res.json(taskObjectToOutput(object));
};


export const listTask: ListTask = async (req, res, context: any) => {
  const objects = await context.entities.Task.findMany({
    include: {
      skills: true,
      developer: true
    }
  })
  res.set("Access-Control-Allow-Origin", "*"); // Example of modifying headers to override Wasp default CORS middleware.
  res.json(objects ?? []);
};


export const getDeveloper: GetDeveloper<{ name: string }, DeveloperOutput> = async (req, res, context: any) => {
  const object_name = req.params.name
  const object = await getDeveloperGivenNameFromDB(object_name, context)
  res.set("Access-Control-Allow-Origin", "*"); // Example of modifying headers to override Wasp default CORS middleware.
  if (!object) {
    res.sendStatus(404)
  }
  res.json(developerObjectToOutput(object) ?? {});
};

export const listDeveloper: ListDeveloper = async (req, res, context: any) => {
  const objects = await context.entities.Developer.findMany({
    include: {
      skills: true,
    }
  })

  var developers: Array<DeveloperOutput> = []
  if (objects) {
    for (const object of objects) {
      developers.push(developerObjectToOutput(object))
    }
  }
  res.set("Access-Control-Allow-Origin", "*"); // Example of modifying headers to override Wasp default CORS middleware.
  res.json(developers);
};


export const getSkill: GetSkill<{ name: string }, Skill> = async (req, res, context: any) => {
  const object_name = req.params.name
  const object = await context.entities.Skill.findFirst({
    where: {
      name: {
        equals: object_name,
        mode: 'insensitive',
      }
    }
  })
  res.set("Access-Control-Allow-Origin", "*"); // Example of modifying headers to override Wasp default CORS middleware.
  if (!object) {
    res.sendStatus(404)
  }
  res.json(object ?? {});
};


export const listSkill: ListSkill = async (req, res, context: any) => {
  const objects = await context.entities.Skill.findMany()
  res.set("Access-Control-Allow-Origin", "*"); // Example of modifying headers to override Wasp default CORS middleware.
  res.json(objects ?? []);
};