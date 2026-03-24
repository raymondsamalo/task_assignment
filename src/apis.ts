import type {GetSkill} from "wasp/server/api"
import type {ListSkill} from "wasp/server/api"
import type {Skill} from "wasp/entities"

import type {GetDeveloper} from "wasp/server/api"
import type {ListDeveloper} from "wasp/server/api"
import type {Developer} from "wasp/entities"

import type {GetTask} from "wasp/server/api"
import type {ListTask} from "wasp/server/api"
import type {Task} from "wasp/entities"

export const createTask = async (req, res, context: any) => {
  const id = req.params.id
  const object = await context.entities.Task.findFirst({
    where: {
        id: id
    }
  })
  if(!object)
  {
    res.sendStatus(404)
  }
  res.set("Access-Control-Allow-Origin", "*"); // Example of modifying headers to override Wasp default CORS middleware.
  res.json(object ?? {});
};

export const getTask: GetTask<{id: string}, Task, Task> = async (req, res, context: any) => {
  const id = req.params.id
  const object = await context.entities.Task.findFirst({
    where: {
        id: id
    }
  })
  if(!object)
  {
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

export const getDeveloper: GetDeveloper<{name: string}, Developer, Developer> = async (req, res, context: any) => {
  const object_name = req.params.name
  const object = await context.entities.Developer.findFirst({
    where: {
        name: object_name
    }
  })
  res.set("Access-Control-Allow-Origin", "*"); // Example of modifying headers to override Wasp default CORS middleware.
  if(!object)
  {
    res.sendStatus(404)
  }
  res.json(object ?? {});
};


export const listDeveloper: ListDeveloper = async (req, res, context: any) => {
  const objects = await context.entities.Developer.findMany()
  res.set("Access-Control-Allow-Origin", "*"); // Example of modifying headers to override Wasp default CORS middleware.
  res.json(objects ?? []);
};


export const getSkill: GetSkill<{name: string}, Skill, Skill> = async (req, res, context: any) => {
  const object_name = req.params.name
  const object = await context.entities.Skill.findFirst({
    where: {
        name: object_name
    }
  })
  res.set("Access-Control-Allow-Origin", "*"); // Example of modifying headers to override Wasp default CORS middleware.
  if(!object)
  {
    res.sendStatus(404)
  }  
  res.json(object ?? {});
};


export const listSkill: ListSkill = async (req, res, context: any) => {
  const objects = await context.entities.Skill.findMany()
  res.set("Access-Control-Allow-Origin", "*"); // Example of modifying headers to override Wasp default CORS middleware.
  res.json(objects ?? []);
};