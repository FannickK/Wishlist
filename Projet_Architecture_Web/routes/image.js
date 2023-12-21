import express from 'express'
import { ImageController } from '../controllers/index.js'
import multer from 'multer'

/**
 * @swagger
 * tags:
 *   name: Images
 *   description: Opérations liées à la gestion des images
 */

/**
 * @swagger
 * /image:
 *   get:
 *     summary: Récupérer toutes les images
 *     description: Récupère toutes les images disponibles
 *     tags: [Images]
 *     responses:
 *       200:
 *         description: La liste des images a été récupérée avec succès
 *         content:
 *           application/json:
 *             example:
 *               images: [ { id: 1, filename: 'Image 1', giftId: 2, createdAt: '10/12/2023', updatedAt: '12/12/2023' }, { id: 2, filename: 'Image 2', giftId: 2, createdAt: '10/12/2023', updatedAt: '12/12/2023' } ]
 */

/**
 * @swagger
 * /image/{id}:
 *   get:
 *     summary: Récupérer une image par ID
 *     description: Récupère une image spécifique en fonction de son ID
 *     tags: [Images]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'image à récupérer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: L'image a été récupérée avec succès
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               filename: 'Image 1'
 *               giftId: 2
 *               createdAt: '10/12/2023'
 *               updatedAt: '12/12/2023'
 *       404:
 *         description: Aucune image trouvée avec l'ID fourni
 */

/**
 * @swagger
 * /image:
 *   post:
 *     summary: Ajouter de nouvelles images
 *     description: Ajoute de nouvelles images avec les fichiers fournis
 *     tags: [Images]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: Liste des fichiers à téléverser (maximum 5 fichiers)
 *             required:
 *               - files
 *     responses:
 *       200:
 *         description: Les images ont été ajoutées avec succès
 *         content:
 *           application/json:
 *             example:
 *               images: [ { id: 3, filename: 'Nouvelle Image 1' }, { id: 4, filename: 'Nouvelle Image 2' } ]
 */

/**
 * @swagger
 * /image/{id}:
 *   put:
 *     summary: Mettre à jour une image par ID
 *     description: Met à jour une image existante en fonction de son ID
 *     tags: [Images]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'image à mettre à jour
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             nom: 'Image Mise à Jour'
 *     responses:
 *       200:
 *         description: L'image a été mise à jour avec succès
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               filename: 'Image Mise à Jour'
 *       404:
 *         description: Aucune image trouvée avec l'ID fourni

/**
 * @swagger
 * /image/{id}:
 *   delete:
 *     summary: Supprimer une image par ID
 *     description: Supprime une image existante en fonction de son ID
 *     tags: [Images]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'image à supprimer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: L'image a été supprimée avec succès
 *       404:
 *         description: Aucune image trouvée avec l'ID fourni
 */

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    },
})

const upload = multer({ storage: storage })

class ImageRoutes {
    constructor() {
        this.router = express.Router()
        this.configureRoutes()
    }

    configureRoutes() {
        this.router.get('/', ImageController.getAll)
        this.router.get('/:id', ImageController.get)

        // On utilise upload.array pour traiter les fichiers
        this.router.post('/', upload.array('files', 5), ImageController.create)
        this.router.put('/:id', ImageController.update)
        this.router.delete('/:id', ImageController.delete)
    }

    getRouter() {
        return this.router
    }
}

export default new ImageRoutes().getRouter()
