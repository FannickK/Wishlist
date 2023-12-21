import express from 'express'
import { GiftController } from '../controllers/index.js'

/**
 * @swagger
 * tags:
 *   name: Cadeaux
 *   description: Opérations liées à la gestion des cadeaux
 */

/**
 * @swagger
 * /gift:
 *   get:
 *     summary: Récupérer tous les cadeaux
 *     description: Récupère tous les cadeaux disponibles
 *     tags: [Cadeaux]
 *     responses:
 *       200:
 *         description: La liste des cadeaux a été récupérée avec succès
 *         content:
 *           application/json:
 *             example:
 *               cadeaux: [ { id: 1, name: 'Cadeau 1', description: 'Description1', price: 100, images: ['image1.jpg','image2.jpg'], isReserved: true, nameReserver: 'Jean', dateReservation: '10/12/2023', listId: 1, createdAt: '08/12/2023', updatedAt: '09/12/2023' }, { id: 2, name: 'Cadeau 2', description: 'Description2', price: 200, images: 'image5.jpg', isReserved: true, nameReserver: 'Jean Marcq', dateReservation: '10/12/2023', listId: 2, createdAt: '08/12/2023', updatedAt: '09/12/2023'} ]
 */

/**
 * @swagger
 * /gift/{id}:
 *   get:
 *     summary: Récupérer un cadeau par ID
 *     description: Récupère un cadeau spécifique en fonction de son ID
 *     tags: [Cadeaux]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du cadeau à récupérer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Le cadeau a été récupéré avec succès
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               name: 'Cadeau 1'
 *               description: 'Description1'
 *               price: 100
 *               images: ['image1.jpg','image2.jpg']
 *               isReserved: true
 *               nameReserver: 'Jean'
 *               dateReservation: '10/12/2023'
 *               listId: 1
 *       404:
 *         description: Aucun cadeau trouvé avec l'ID fourni
 */

/**
 * @swagger
 * /gift:
 *   post:
 *     summary: Créer un nouveau cadeau
 *     description: Crée un nouveau cadeau avec les détails fournis
 *     tags: [Cadeaux]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: 'Nouveau Cadeau'
 *             description: 'Description'
 *             price: 100
 *     responses:
 *       200:
 *         description: Le cadeau a été créé avec succès
 *         content:
 *           application/json:
 *             example:
 *               id: 3
 *               nom: 'Nouveau Cadeau'
 *               description: 'Description'
 *               price: 100
 */

/**
 * @swagger
 * /gift/{id}:
 *   put:
 *     summary: Mettre à jour un cadeau par ID
 *     description: Met à jour un cadeau existant en fonction de son ID
 *     tags: [Cadeaux]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du cadeau à mettre à jour
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             nameReserver: 'Luc'
 *     responses:
 *       200:
 *         description: Le cadeau a été mis à jour avec succès
 *         content:
 *           application/json:
 *             example:
 *               id: 5
 *               name: 'Cadeau 5'
 *               description: 'Description5'
 *               price: 500
 *               images: ['image5.jpg']
 *               isReserved: true
 *               nameReserver: 'Luc'
 *               dateReservation: '10/12/2023'
 *       404:
 *         description: Aucun cadeau trouvé avec l'ID fourni

/**
 * @swagger
 * /gift/{id}:
 *   delete:
 *     summary: Supprimer un cadeau par ID
 *     description: Supprime un cadeau existant en fonction de son ID
 *     tags: [Cadeaux]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du cadeau à supprimer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Le cadeau a été supprimé avec succès
 *       404:
 *         description: Aucun cadeau trouvé avec l'ID fourni
 */

class GiftRoutes {
    constructor() {
        this.router = express.Router()
        this.configureRoutes()
    }

    configureRoutes() {
        this.router.get('/', GiftController.getAll)
        this.router.get('/:id', GiftController.get)
        this.router.post('/', GiftController.create)
        this.router.put('/:id', GiftController.update)
        this.router.delete('/:id', GiftController.delete)
    }

    getRouter() {
        return this.router
    }
}

export default new GiftRoutes().getRouter()
