import { Router } from 'express'
import 'dotenv/config'
import { prisma } from '../db.js'
import { createRol } from '../controllers/roles.controller.js'

const router = Router()

router.get('/roles', async (req, res) => {
  const roles = await prisma.roles.findMany({
    include: {
      user: true
    }
  })
  res.json({CodigoResp: process.env.CREATED_ROL_MSG, roles})
})

router.post('/roles', async (req, res) => {
  const roles = await prisma.roles.findFirst({
    include: {
      user: true
    }
  })

  if(roles) return res.status(404).json({error: 'Ya existe el Rol'})

  try {
    const newRol = await createRol(req)
    console.log(newRol)
    if(!newRol) return res.status(400).send('No se pudo crear el nuevo rol')
    res.json({CodigoResp: 'Nuevo Rol Creado Correctamente: ', newRol})
  } catch (error) {
    console.log(error, 'Error al Crear el Rol' + arguments.callee.name)
    res.json({error: 'Error al Crear el Rol en RolCreate' })
  }

  res.json({CodigoResp: 'Rol Creado Correctamente Final ', roles})
})

export default router