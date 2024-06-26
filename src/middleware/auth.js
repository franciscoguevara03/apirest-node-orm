import jwt from 'jsonwebtoken'
import 'dotenv/config'

/**
 * Middleware function to verify token in the request headers.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next function in the middleware chain
 */
export default function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"]
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ")
    const bearerToken = bearer[1]
    jwt.verify(bearerToken, process.env.KEY_TOKEN, (err, authData) => {
      if(err) {
        console.error(err)
        res.sendStatus(403)
      } else {
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