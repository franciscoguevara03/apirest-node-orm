import { Router } from 'express'
import 'dotenv/config'
import { prisma } from '../db.js'

const router = Router()

router.get('/roles', async (req, res) => {
  const roles = await prisma.roles.findMany({
    include: {
      user: true
    }
  })
  res.json({CodigoResp: process.env.CREATED_ROL_MSG, roles})
})

export default router