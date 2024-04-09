import jwt from 'jsonwebtoken'
import 'dotenv/config'

export default function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"]
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ")
    const bearerToken = bearer[1]
    jwt.verify(bearerToken, process.env.KEY_TOKEN, (err, authData) => {
      if(err) {
        console.log(err)// Si hay un error (como la expiración del token), envía un estado 403
        res.sendStatus(403)
      } else {
        // Si no hay errores, añade el token y los datos de autenticación al objeto req
        console.log(authData)
        req.token = bearerToken
        req.authData = authData
        next()
      }
    })
  } else {
    res.sendStatus(403)
  }
}