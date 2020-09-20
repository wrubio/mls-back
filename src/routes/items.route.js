const { Router } = require('express')
const itemsController = require('../controllers/items/items.controller')
const router = Router()

router.get('/items', itemsController.getItems)
router.get('/items/:id', itemsController.getItem)

module.exports = router