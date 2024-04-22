import express from 'express'

import userRoutes from './routes/user.routes.js'
import rolesRoutes from './routes/roles.routes.js'
import tokenRoutes from './routes/token.routes.js'
import change_typesRoutes from './routes/change_type.routes.js'
//import axiosBcv from './services/change_type_scrapping.sevices.js'
import 'dotenv/config'

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Bienvenidos API-BCV')
})

app.use("/api", tokenRoutes)
app.use("/api", userRoutes)
app.use("/api", rolesRoutes)
app.use("/api", change_typesRoutes)

app.listen(port, () => {
  console.log(`API-BCV listening on port ${port}!`)
})