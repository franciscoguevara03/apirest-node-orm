import express from 'express'

import userRoutes from './routes/user.routes.js'
import rolesRoutes from './routes/roles.routes.js'
import tokenRoutes from './routes/token.routes.js'
import 'dotenv/config'

const app = express()
const puerto = process.env.PORT

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Bien venidos API-BCV')
})

app.use("/api", tokenRoutes)
app.use("/api", userRoutes)
app.use("/api", rolesRoutes)

puerto ? app.listen(puerto) : app.listen(3000)
console.log('Server on Port', process.env.PORT)