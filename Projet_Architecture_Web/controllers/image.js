import pkg from '@prisma/client'

const { PrismaClient } = pkg
const prisma = new PrismaClient()
const { image: Image } = prisma

class ImageController {
    async getAll(req, res) {
        try {
            const data = await Image.findMany()
            res.status(200).send(data)
        } catch (error) {
            console.error('Error retrieving images:', error)
            res.status(500).send({
                message: 'Some error occurred while retrieving images.',
            })
        }
    }

    async get(req, res) {
        const { id } = req.params
        try {
            const data = await Image.findUnique({
                where: {
                    id: parseInt(id),
                },
            })
            if (data) {
                res.status(200).send(data)
            } else {
                res.status(404).send({
                    message: `Not found image with id=${id}.`,
                })
            }
        } catch (error) {
            console.error(`Error retrieving image with id=${id}:`, error)
            res.status(500).send({
                message: `Some error occurred while retrieving image with id=${id}.`,
            })
        }
    }

    async create(req, res) {
        try {
            const createImagePromises = req.files.map(async (file) => {
                const createdImage = await Image.create({
                    data: {
                        gift: { connect: { id: parseInt(req.body.giftId) } },
                        filename: file.originalname,
                    },
                })
                return createdImage
            })

            const createdImages = await Promise.all(createImagePromises)

            res.status(200).send({
                message: 'Images créées avec succès.',
                images: createdImages,
            })
        } catch (error) {
            console.error('Erreur lors de la création des images :', error)
            res.status(500).send({
                message: "Une erreur s'est produite lors de la création des images.",
            })
        }
    }

    async update(req, res) {
        const { id } = req.params
        const { filename } = req.body
        try {
            const updatedImage = await Image.update({
                where: {
                    id: parseInt(id),
                },
                data: {
                    filename: filename,
                },
            })
            res.status(200).send(updatedImage)
        } catch (error) {
            console.error(`Error updating image with id=${id}:`, error)
            res.status(500).send({
                message: `Some error occurred while trying to update image with id=${id}.`,
            })
        }
    }

    async delete(req, res) {
        const { id } = req.params
        try {
            await Image.delete({
                where: {
                    id: parseInt(id),
                },
            })
            res.status(200).send({
                message: 'Image was deleted successfully.',
            })
        } catch (error) {
            console.error(`Error deleting image with id=${id}:`, error)
            res.status(500).send({
                message: `Some error occurred while trying to delete image with id=${id}.`,
            })
        }
    }
}

export default new ImageController()
