import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './swagger.js'

// configurations de bases du serveur
const server = express()

server.use(express.json())
server.use(express.urlencoded({ extended: true }))
server.use(cors({ origin: '*' }))

server.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
    )
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    next()
})

const __dirname = 'C:/Users/KINZO/OneDrive/Bureau/Master_2/Projet_Architecture_Web/uploads'
server.use('/uploads', express.static(path.join(__dirname)))

// configuration de route pour les images statiques
server.get('/uploads/:filename', (req, res) => {
    const filename = req.params.filename
    const filePath = path.join(__dirname, filename)
    res.sendFile(filePath)
})

// configuration de route pour la documentation de l'API
server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

import { ListRoutes, GiftRoutes, ImageRoutes } from './routes/index.js'

server.use('/list', ListRoutes)
server.use('/gift', GiftRoutes)
server.use('/image', ImageRoutes)

server.listen(process.env.SERVER_PORT, () => {
    console.log(`Server is running on port ${process.env.SERVER_PORT}.`)
})

export default server
