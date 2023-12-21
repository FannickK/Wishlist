import pkg from '@prisma/client'

const { PrismaClient } = pkg
const prisma = new PrismaClient()
const { image: Image, gift: Gift } = prisma

class GiftController {
    async getAll(req, res) {
        try {
            const data = await Gift.findMany()
            res.status(200).send(data)
        } catch (error) {
            res.status(500).send({
                message: error.message || 'Some error occurred while retrieving gifts.',
            })
        }
    }

    async get(req, res) {
        const { id } = req.params
        try {
            const data = await Gift.findUnique({
                where: {
                    id: parseInt(id),
                },
            })
            data
                ? res.status(200).send(data)
                : res.status(404).send({
                      message: `Not found gift with id=${id}.`,
                  })
        } catch (error) {
            res.status(500).send({
                message: error.message || `Some error occurred while retrieving gift with id=${id}.`,
            })
        }
    }

    async create(req, res) {
        const { listId, name, description, price } = req.body
        try {
            await Gift.create({
                data: {
                    listId: parseInt(listId),
                    name: name,
                    description: description,
                    price: Number(price),
                },
            })
            res.status(200).send({
                message: 'Gift was created successfully.',
            })
        } catch (error) {
            res.status(500).send({
                message: error.message || 'Some error occurred while trying to create gift.',
            })
        }
    }

    async update(req, res) {
        const { id } = req.params
        const { nameReserver, isReserved } = req.body

        console.log('Updating with nameReserver:', nameReserver, 'isReserved:', isReserved)

        try {
            // Utilisez la méthode .update pour mettre à jour le cadeau
            await Gift.update({
                where: {
                    id: parseInt(id),
                },
                data: {
                    nameReserver: nameReserver,
                    dateReservation: new Date(),
                    isReserved: Boolean(isReserved),
                },
            })

            // Données mises à jour du cadeau
            const updatedGiftData = await Gift.findUnique({
                where: {
                    id: parseInt(id),
                },
            })

            console.log('Updated Gift:', updatedGiftData)

            res.status(200).send({
                message: `Gift ${id} was updated successfully.`,
                gift: updatedGiftData, // Utilise les données réellement mises à jour ici
            })
        } catch (error) {
            res.status(500).send({
                message: error.message || `Some error occurred while trying to update gift with id=${id}.`,
            })
        }
    }

    async delete(req, res) {
        const { id } = req.params
        try {
            const deleteImages = Image.deleteMany({
                where: {
                    giftId: parseInt(id),
                },
            })
            const deleteGift = Gift.delete({
                where: {
                    id: parseInt(id),
                },
            })
            await prisma.$transaction([deleteImages, deleteGift])
            res.status(200).send({
                message: 'Gift was deleted successfully.',
            })
        } catch (error) {
            res.status(500).send({
                message: error.message || `Some error occurred while trying to delete gift with id=${id}.`,
            })
        }
    }
}

export default new GiftController()
