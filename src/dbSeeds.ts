import type { DbSeedFn } from 'wasp/server'
import {Skill} from '@prisma/client' // import must be done on client 
export const devSeedSimple: DbSeedFn = async (prisma) => {
  if (!prisma) {
    throw new Error('Prisma client is not available');
  }

  // list all developers and their skills in a dictionary
  let developers: Record<string, Array<Skill>> = {
    'Alice': [Skill.FRONTEND],
    'Bob': [Skill.BACKEND],
    'Carol': [Skill.BACKEND, Skill.FRONTEND],
    'Dave': [Skill.BACKEND]
  }
  //loop and create the entries
  for (const [name, skills] of Object.entries(developers)) {
    await prisma.developer.create({
      data: {
        name: name,
        skills: skills
      }
    })
  }
}

