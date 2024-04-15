export default function logDetails(req, f_name) {
  console.log(`*********Inicio del Log del Método********`)
  console.log(`Método: ${req.method}`)
  console.log(`Ruta: ${req.path}`)
  console.log(`Nombre de la función: ${f_name}`)
  console.log(`*********Final del Log del Método********`)
}