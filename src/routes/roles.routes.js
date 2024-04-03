import { Router } from 'express'

import { prisma } from '../db.js'

const router = Router()

router.get('/roles', async (req, res) => {
  const roles = await prisma.roles.findMany({
    include: {
      user: true
    }
  })
  res.json(roles)
})

export default router