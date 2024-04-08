import { Router } from 'express'

import { prisma } from '../db.js'

const router = Router()

//  Rutas para Obtener a todos los Usuarios
router.get('/api/user', async (req, res) => {
  const users = await prisma.user.findMany()
  res.json(users)
})

//  Rutas para Obtener un usuario segun su ID
router.get('/api/user/:id', async (req, res) => {
  const userFound = await prisma.user.findFirst({
    where: {
      id: parseInt(req.params.id)
    },
    include: {
      roles: true
    }
  })

  if(!userFound) return res.status(404).json({error: "Usuario no encontrado"})

  return res.json(userFound)
})


//  Rutas para Crear un usuario
router.post('/api/user', async (req, res) => {
  const newUser = await prisma.user.create({
    data: req.body,
  })
  res.json(newUser)
})

//  Rutas para Actualizar un usuario por ID
router.put('/api/user/:id', async (req, res) => {
  const userFound = await prisma.user.findFirst({
    where: {
      id: parseInt(req.params.id)
    },
  })

  if(!userFound) return res.status(404).json({error: "Usuario no encontrado"})

  const userUpdate = await prisma.user.update({
    where: {
      id: parseInt(req.params.id)
    },
    data: req.body
  })
  return res.json(userUpdate)
})

//  Rutas para Borrar un usuario segun el ID
router.delete('/api/user/:id', async (req, res) => {
  const userFound = await prisma.user.findFirst({
    where: {
      id: parseInt(req.params.id)
    },
  })

  if(!userFound) return res.status(404).json({error: "Usuario no encontrado"})

  const userDeleted = await prisma.user.delete({
    where: {
      id: parseInt(req.params.id)
    },
  })

  return res.json({CodigoResp: "Ok",userDeleted})
})

export default router