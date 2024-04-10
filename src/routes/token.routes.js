import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { prisma } from '../db.js'
import bcrypt from 'bcryptjs'
import 'dotenv/config'
const router = Router()

router.post("/login", async(req, res) => {

  const { user, password } = req.body

  const userFound = await prisma.user.findFirst({
    where: {
      username: user
    },
  })

  if(!userFound) return res.status(404).json({error: process.env.ERROR_USER_MSG})

  if (bcrypt.compareSync(password, userFound.password)) {
    const token = jwt.sign({ id: userFound.id, user: userFound.username }, process.env.KEY_TOKEN , {
      expiresIn: process.env.TOKEN_EXPIRE
    })
    console.log(process.env.ACCESS_MSG, true);
    return res.status(200).send({ token, name: userFound.username, id: userFound.id });
  } else {
    console.log(process.env.ERROR_USER_PASSWORD_MSG, false)
    return res.status(401).send({ error: process.env.ERROR_USER_PASSWORD_MSG })}
  
})
  
export default router

