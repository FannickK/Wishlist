import swaggerJSDoc from 'swagger-jsdoc'

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Projet Architecture Web',
            version: '1.0.0',
            description: 'Cette API permet de gérer les listes de cadeaux ainsi que les cadeaux de chaque liste.',
        },
    },
    apis: ['./routes/list.js', './routes/gift.js', './routes/image.js'],
}

const swaggerSpec = swaggerJSDoc(options)

export default swaggerSpec
