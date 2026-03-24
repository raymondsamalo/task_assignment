import type { GetSkill } from "wasp/server/api"
import type { ListSkill } from "wasp/server/api"
import type { Skill } from "wasp/entities"

import type { GetDeveloper } from "wasp/server/api"
import type { ListDeveloper } from "wasp/server/api"
import type { Developer } from "wasp/entities"

import type { GetTask } from "wasp/server/api"
import type { ListTask } from "wasp/server/api"
import type { Task } from "wasp/entities"
import type { CreateTask } from "wasp/server/api"
import * as Prisma from "@prisma/client"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"

export const createTask: CreateTask<{ title: string }> = async (req, res, context: any) => {
  const {title} = req.body
  console.log("CREATE TASK CALLED '%s' title", title)
  try {
    const object = await context.entities.Task.create({
      data:{
        title: title

      }
    })
    console.log("CREATE TASK CREATED '%s' title", title)

    res.set("Access-Control-Allow-Origin", "*"); // Example of modifying headers to override Wasp default CORS middleware.
    res.json(object ?? {});

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
      }else{
        throw e
      }
     } else {
      throw e
    }
  }
};

export const getTask: GetTask<{ id: string }, Task, Task> = async (req, res, context: any) => {
  const id = req.params.id
  const object = await context.entities.Task.findFirst({
    where: {
      id: id
    }
  })
  if (!object) {
    res.sendStatus(404)
  }
  res.set("Access-Control-Allow-Origin", "*"); // Example of modifying headers to override Wasp default CORS middleware.
  res.json(object ?? {});
};


export const listTask: ListTask = async (req, res, context: any) => {
  const objects = await context.entities.Task.findMany()
  res.set("Access-Control-Allow-Origin", "*"); // Example of modifying headers to override Wasp default CORS middleware.
  res.json(objects ?? []);
};

export const getDeveloper: GetDeveloper<{ name: string }, Developer, Developer> = async (req, res, context: any) => {
  const object_name = req.params.name
  const object = await context.entities.Developer.findFirst({
    where: {
      name: object_name
    }
  })
  res.set("Access-Control-Allow-Origin", "*"); // Example of modifying headers to override Wasp default CORS middleware.
  if (!object) {
    res.sendStatus(404)
  }
  res.json(object ?? {});
};


export const listDeveloper: ListDeveloper = async (req, res, context: any) => {
  const objects = await context.entities.Developer.findMany()
  res.set("Access-Control-Allow-Origin", "*"); // Example of modifying headers to override Wasp default CORS middleware.
  res.json(objects ?? []);
};


export const getSkill: GetSkill<{ name: string }, Skill, Skill> = async (req, res, context: any) => {
  const object_name = req.params.name
  const object = await context.entities.Skill.findFirst({
    where: {
      name: object_name
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