import express from 'express'
import { ListController } from '../controllers/index.js'

/**
 * @swagger
 * tags:
 *   name: Liste
 *   description: Opérations liées à la gestion des listes
 */

/**
 * @swagger
 * /list:
 *   get:
 *     summary: Récupérer toutes les listes
 *     description: Récupère toutes les listes disponibles
 *     tags: [Liste]
 *     responses:
 *       200:
 *         description: La liste des listes a été récupérée avec succès
 *         content:
 *           application/json:
 *             example:
 *               listes: [ { id: 1, name: 'Liste 1', author: 'Jean', date_debut: "10/12/2020", date_fin: "30/12/2020", isExpired: false, createdAt : "10/12/2020", updatedAt: "15/12/2020" }, { id: 2, name: 'Liste 2', author: 'Jean', date_debut: "10/12/2020", date_fin: "30/12/2020", isExpired: false, createdAt : "10/12/2020", updatedAt: "15/12/2020" } ]
 */

/**
 * @swagger
 * /list/{id}:
 *   get:
 *     summary: Récupérer une liste par ID
 *     description: Récupère une liste spécifique en fonction de son ID
 *     tags: [Liste]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la liste à récupérer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: La liste a été récupérée avec succès
 *         content:
 *           application/json:
 *             example:
 *               id: 4
 *               name: 'Liste 1'
 *               author: 'Jean'
 *               date_debut: "10/12/2020"
 *               date_fin: "30/12/2020"
 *               isExpired: true
 *               createdAt : "10/12/2020"
 *               updatedAt: "15/12/2020"
 *       404:
 *         description: Aucune liste trouvée avec l'ID fourni
 */

/**
 * @swagger
 * /list:
 *   post:
 *     summary: Créer une nouvelle liste
 *     description: Crée une nouvelle liste avec les détails fournis
 *     tags: [Liste]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: 'Nouvelle Liste'
 *             author: 'Jean'
 *             date_debut: "10/12/2020"
 *             date_fin: "30/12/2020"
 *     responses:
 *       200:
 *         description: La liste a été créée avec succès
 *         content:
 *           application/json:
 *             example:
 *               id: 3
 *               name: 'Nouvelle Liste'
 *               author: 'Jean'
 *               date_debut: "10/12/2020"
 *               date_fin: "30/12/2020"
 *               isExpired: false
 *
 */

/**
 * @swagger
 * /list/{id}:
 *   put:
 *     summary: Mettre à jour une liste par ID
 *     description: Met à jour une liste existante en fonction de son ID
 *     tags: [Liste]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la liste à mettre à jour
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: 'Liste Mise à Jour'
 *     responses:
 *       200:
 *         description: La liste a été mise à jour avec succès
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               name: 'Liste Mise à Jour'
 *       404:
 *         description: Aucune liste trouvée avec l'ID fourni

/**
 * @swagger
 * /list/{id}:
 *   delete:
 *     summary: Supprimer une liste par ID
 *     description: Supprime une liste existante en fonction de son ID
 *     tags: [Liste]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la liste à supprimer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: La liste a été supprimée avec succès
 *       404:
 *         description: Aucune liste trouvée avec l'ID fourni
 */

class ListRoutes {
    constructor() {
        this.router = express.Router()
        this.configureRoutes()
    }

    configureRoutes() {
        this.router.get('/', ListController.getAll)
        this.router.get('/:id', ListController.get)
        this.router.post('/', ListController.create)
        this.router.put('/:id', ListController.update)
        this.router.delete('/:id', ListController.delete)
    }

    getRouter() {
        return this.router
    }
}

export default new ListRoutes().getRouter()
