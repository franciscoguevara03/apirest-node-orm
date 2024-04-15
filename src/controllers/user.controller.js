import { prisma } from '../db.js'
import bcrypt from 'bcryptjs'

export const getUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      lastname: true,   
      password: false,  
      username: true,      
      email: true,         
      roles: true,        
      status: true,     
      created_at: true,  
    }
  })
  
  return users
}

export const getUserById = async (id) => {
  const userFound = await prisma.user.findFirst({
    select: {
      name: true,
      lastname: true,   
      username: true,      
      email: true,         
      roles: true,        
      status: true,     
      created_at: true,  
    },
    where: {
      id: parseInt(id)
    }
  })
  
  return userFound
}

export const getUserByUsername = async (username) => {
  const userFound = await prisma.user.findFirst({
    where: {
      username: username
    },
  })
  
  return userFound
}

export const createUser = async (req) => {
  const saltRounds = bcrypt.genSaltSync(10)
    console.log(req.body)
  bcrypt.hash(req.body.password, saltRounds, async function(err, hash) {
    if (err) {
      console.log(saltRounds)
      console.log(err)
      return err
    } else {
      await prisma.user.create({
        data: {
          name: req.body.name,
          lastname: req.body.lastname,
          username: req.body.username,
          email: req.body.email,
          rolesId: req.body.rolesId,
          status: req.body.status,
          password: hash
        },
      })
      .then(newUser => {
        return newUser
      })
      .catch(prismaError => {
        console.log(prismaError)
        return prismaError
      })
    }
  })
}