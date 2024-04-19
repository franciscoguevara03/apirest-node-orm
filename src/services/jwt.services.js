import jwt from 'jwt-simple'

let fecha = new Date() // Fecha actual
let diasParaSumar = 5 // Número de días que quieres sumar

fecha.setDate(fecha.getDate() + diasParaSumar)

console.log(fecha)

/**
 * Creates a token for the given user.
 *
 * @param {Object} user - The user object for whom the token is created
 * @return {string} The encoded token for the user
 */
export const createToken = function (user) {
  var payload = {
    sub: user._id,
    iat: new Date(),
    exp: fecha,
  }
  return jwt.encode(payload, config.KEYTOKEN)
}