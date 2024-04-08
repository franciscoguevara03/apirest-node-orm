import jwt from 'jsonwebtoken'
import { prisma } from '../db.js'
import bcrypt from 'bcryptjs'
import 'dotenv/config'
const router = Router()

router.post("/api/login", async(req, res) => {


  const { user, password } = req.body

  const userFound = await prisma.user.findFirst({
    where: {
      user: user
    },
  })

  if(!userFound) return res.status(404).json({error: "Usuario no encontrado"})
   
  if (bcrypt.compareSync(password, userFound.password)) {
      const token = jwt.sign({ user, password }, process.env.KEY_TOKEN, {
        expiresIn: "120h"
      })
      console.log("Acceso", true)
      const response = result[0]
      const { name, id } = response
      return res.status(200).send({ token, role, name, id })
  } else {
    console.log("Usuario o Contraseña incorrectos", false)
    return res.status(401).send({ error: "Usuario o Contraseña incorrectos" })
  }
 
})
  
export default router

