import { Router } from 'express'
import { prisma } from '../db.js'
import bcrypt from 'bcryptjs'
import 'dotenv/config'
import verifyToken from '../middleware/auth.js'
import { getUsers, getUserById, getUserByUsername, createUser } from '../controllers/user.controller.js'
import log_details from '../utils/log_details.js'
import logger from '../log/log_conf.js'

const router = Router()


//  Rutas para Obtener a todos los Usuarios
router.get('/user',async (req, res) => {
  if(!req.authData) return res.status(404).json({error: process.env.ERROR_USER_MSG})

  const { method, path, url } = req

  try {
    const users = await getUsers()

    logger.info(`Método: ${method}|Ruta: ${path}|Fecha y hora: ${new Date().toISOString()}|URL: ${url}|Nombre de usuario: ${req.authData ? req.authData.user : 'No autenticado'}`)
    
    res.json({CodigoResp: process.env.USERS_LIST_MSG, users})
  } catch (error) {
    console.log(error, process.env.ERROR_FUNCT_NOT_FOUND_MSG )
    res.json({error: process.env.ERROR_FUNCT_NOT_FOUND_MSG})
  }

})

//  Rutas para Obtener un usuario segun su ID
router.get('/user/:id',verifyToken, async (req, res) => {
  if(!req.authData) return res.status(404).json({error: process.env.ERROR_USER_MSG})

  try {
    const userFound = await getUserById(req.params.id)
    
    if(!userFound) return res.status(404).json({error: process.env.ERROR_USER_MSG})
    
    res.json({CodigoResp: process.env.USERS_LIST_MSG, userFound})
  } catch (error) {

    console.log(error, process.env.ERROR_FUNCT_NOT_FOUND_MSG + ' getUserById')
    res.json({error: process.env.ERROR_FUNCT_NOT_FOUND_MSG + ' getUserById' })
  }

  console.log(log_details(req, router.name))

})


//  Rutas para Crear un usuario
router.post('/user', async (req, res) => {

  const userFound = await getUserByUsername(req.body.username)

  if(userFound) return res.status(404).json({error: process.env.ERROR_USER_DUPLICATED_MSG})

  try {
    const newUser = await createUser(req)
    console.log(newUser)
    if(!newUser) return res.status(400).send(process.env.ERROR_USER_NOT_CREATED_MSG)
    res.json({CodigoResp: process.env.CREATED_USER_MESG, newUser})
  } catch (error) {
    console.log(error, process.env.ERROR_USER_NOT_CREATED_MSG + arguments.callee.name)
    res.json({error: process.env.ERROR_USER_NOT_CREATED_MSG + ' createUser' })
  }

  console.log(log_details(req, router.name))

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

  console.log(log_details(req, router.name))

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
  
  console.log(log_details(req, router.name))

  return res.json({CodigoResp: process.env.DELETED_USER_MSG, userDeleted})
})

export default router