import jwt from 'jwt-simple'

let fecha = new Date() // Fecha actual
let diasParaSumar = 5 // Número de días que quieres sumar

fecha.setDate(fecha.getDate() + diasParaSumar)

console.log(fecha)

export const createToken = function (user) {
  var payload = {
    sub: user._id,
    iat: new Date(),
    exp: fecha,
  }
  return jwt.encode(payload, config.KEYTOKEN)
}