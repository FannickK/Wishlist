import pkg from '@prisma/client'

const { PrismaClient } = pkg
const prisma = new PrismaClient()
const { list: List, gift: Gift } = prisma

class ListController {
    async getAll(req, res) {
        try {
            const data = await List.findMany()
            res.status(200).send(data)
        } catch (error) {
            res.status(500).send({
                message: error.message || 'Some error occurred while retrieving lists.',
            })
        }
    }

    async get(req, res) {
        const { id } = req.params
        try {
            const data = await List.findUnique({
                where: {
                    id: parseInt(id),
                },
            })
            data
                ? res.status(200).send(data)
                : res.status(404).send({
                      message: `Not found List with id=${id}.`,
                  })
        } catch (error) {
            res.status(500).send({
                message: error.message || `Some error occurred while retrieving list with id=${id}.`,
            })
        }
    }

    async create(req, res) {
        const { name, date_debut, date_fin, author } = req.body
        try {
            const currentDate = new Date()
            const isExpired = new Date(date_fin) < currentDate

            await List.create({
                data: {
                    name: name,
                    author: author,
                    date_debut: new Date(date_debut),
                    date_fin: new Date(date_fin),
                    isExpired: isExpired,
                },
            })
            res.status(200).send({
                message: 'List was created successfully.',
            })
        } catch (error) {
            res.status(500).send({
                message: error.message || 'Some error occurred while trying to create List.',
            })
        }
    }

    async update(req, res) {
        const { id } = req.params
        const { name } = req.body
        try {
            await List.update({
                where: {
                    id: parseInt(id),
                },
                data: {
                    name: name,
                },
            })
            res.status(200).send({
                message: `List with id=${id} was updated successfully.`,
            })
        } catch (error) {
            res.status(500).send({
                message: error.message || `Some error occurred while trying to update list with id=${id}.`,
            })
        }
    }

    async delete(req, res) {
        const { id } = req.params
        try {
            const deleteGifts = Gift.deleteMany({
                where: {
                    listId: parseInt(id),
                },
            })
            const deleteList = List.delete({
                where: {
                    id: parseInt(id),
                },
            })
            await prisma.$transaction([deleteGifts, deleteList])
            res.status(200).send({
                message: 'List was deleted successfully.',
            })
        } catch (error) {
            res.status(500).send({
                message: error.message || `Some error occurred while trying to delete list with id=${id}.`,
            })
        }
    }
}

export default new ListController()
