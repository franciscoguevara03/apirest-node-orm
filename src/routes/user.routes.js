import { Router } from 'express'
import { prisma } from '../db.js'
import bcrypt from 'bcryptjs'
import 'dotenv/config'
import verifyToken from '../middleware/auth.js'

const router = Router()

//  Rutas para Obtener a todos los Usuarios
router.get('/user',verifyToken ,async (req, res) => {
  const users = await prisma.user.findMany()
  res.json({CodigoResp: process.env.USERS_LIST_MSG, users})
})

//  Rutas para Obtener un usuario segun su ID
router.get('/user/:id',verifyToken, async (req, res) => {
  const userFound = await prisma.user.findFirst({
    where: {
      id: parseInt(req.params.id)
    },
    include: {
      roles: true
    }
  })

  if(!userFound) return res.status(404).json({error: process.env.ERROR_USER_MSG})

  return res.json({CodigoResp: process.env.USER_FOUND_MSG, userFound})
})


//  Rutas para Crear un usuario
router.post('/user',verifyToken, async (req, res) => {
  const userFound = await prisma.user.findFirst({
    where: {
      username: req.params.username
    },
  })

  if(userFound) return res.status(404).json({error: process.env.ERROR_USER_DUPLICATED_MSG})

  const saltRounds = bcrypt.genSaltSync(10)
  
  bcrypt.hash(req.body.password, saltRounds, async function(err, hash) {
    if (err) {
      console.log(err)
      res.status(500).send(process.env.ERROR_PASSWORD_ENCRYPT_MSG)
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
        res.json({CodigoResp: process.env.CREATED_USER_MESG, newUser})
      })
      .catch(prismaError => {
        console.log(prismaError)
        res.status(500).send(process.env.ERROR_USER_NOT_CREATED_MSG)
      })
    }
  })
})

//  Rutas para Actualizar un usuario por ID
router.put('/user/:id',verifyToken, async (req, res) => {
  const saltRounds = bcrypt.genSaltSync(10)

  const userFound = await prisma.user.findFirst({
    where: {
      id: parseInt(req.params.id)
    },
  })

  if(!userFound) return res.status(404).json({error: process.env.ERROR_USER_NOT_FOUND_MSG})
  if(!req.body.password){
    const userUpdate = await prisma.user.update({
      where: {
        id: parseInt(req.params.id)
      },
      data: req.body
    })
    return res.json({CodigoResp: process.env.UPDATED_USER_MESG, userUpdate})
  } else { 

    bcrypt.hash(req.body.password, saltRounds, async  function(err, hash) {
      if (err) {
        console.log(err)
        res.status(500).send(process.env.ERROR_PASSWORD_ENCRYPT_MSG)
      } else {
        const userUpdate = await prisma.user.update({
          where: {
            id: parseInt(req.params.id)
          },
          data: {
            name: req.body.name,
            lastname: req.body.lastname,
            username: req.body.username,
            email: req.body.email,
            rolesId: req.body.rolesId,
            status: req.body.status,
            password: hash
          }
        })
        .then(newUser => {
          res.json(newUser)
        })
        .catch(prismaError => {
          console.log(prismaError)
          res.status(500).send(process.env.ERROR_USER_NOT_CREATED_MSG)
        })
        return res.json({CodigoResp: process.env.UPDATED_USER_MESG, userUpdate})
      }
    })
  }
})

//  Rutas para Borrar un usuario segun el ID
router.delete('/user/:id',verifyToken, async (req, res) => {
  const userFound = await prisma.user.findFirst({
    where: {
      id: parseInt(req.params.id)
    },
  })

  if(!userFound) return res.status(404).json({error: process.env.ERROR_USER_NOT_FOUND_MSG})

  const userDeleted = await prisma.user.delete({
    where: {
      id: parseInt(req.params.id)
    },
  })

  return res.json({CodigoResp: process.env.DELETED_USER_MSG, userDeleted})
})

export default router