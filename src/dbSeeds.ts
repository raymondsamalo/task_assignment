import type { DbSeedFn } from 'wasp/server'
export const devSeedSimple: DbSeedFn = async (prisma) => {
  if (!prisma) {
    throw new Error('Prisma client is not available');
  }
  let skills = ["Frontend", "Backend"]
  // list all developers and their skills in a dictionary
  let developers: Record<string, Array<string>> = {
    'Alice': ["Frontend"],
    'Bob': ["Backend"],
    'Carol': ["Backend", "Frontend"],
    'Dave': ["Backend"]
  }
  var skillMap:Record<string, string>={}
  //loop and create the entries
  for (const skill of skills) {

    const skillRow=await prisma.skill.upsert({
      where:{
        name: skill
      },
      update:{},
      create: {
        name: skill
      }
    })
    const skillRowId = skillRow.id;
    skillMap[skill] = skillRowId
  }
  for (const [name, skillNames] of Object.entries(developers)) {
    await prisma.developer.upsert({
      where:{
        name: name
      },
      update:{
        skills:{
          connect: skillNames.map(skill_name=>({id: skillMap[skill_name]}))
        }
      },
      create:{
        name: name,
        skills:{
          connect: skillNames.map(skill_name=>({id: skillMap[skill_name]}))
        }
      }
      
    })
  }
}

