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

  if(!userFound) return res.status(404).json({error: "Usuario no encontrado"})

  if (bcrypt.compareSync(password, userFound.password)) {
    const token = jwt.sign({ id: userFound.id, user: userFound.username }, process.env.KEY_TOKEN , {
      expiresIn: "1m"
    })
    console.log("Acceso", true);
    return res.status(200).send({ token, name: userFound.username, id: userFound.id });
  } else {
    console.log("Usuario o Contraseña incorrectos", false)
    return res.status(401).send({ error: "Usuario o Contraseña incorrectos" })}
  
})
  
export default router

