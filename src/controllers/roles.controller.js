import { prisma } from '../db.js'

export const createRol = async (req) => {
  await prisma.roles.create({
    data: {
      rol_name: req.body.rol_name
    },
  })
  .then(newRol => {
    return newRol
  })
  .catch(prismaError => {
    console.log(prismaError)
    return prismaError
  })
    
}