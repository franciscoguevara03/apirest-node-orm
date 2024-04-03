import express from 'express'

import userRoutes from './routes/user.routes.js'
import rolesRoutes from './routes/roles.routes.js'

const app = express()

app.use(express.json())

app.use("/api", userRoutes)
app.use("/api", rolesRoutes)

app.listen(3000)
console.log('Server on Port', 3000)