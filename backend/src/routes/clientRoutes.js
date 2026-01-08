const express = require('express');
const { getClients, getClient, createClient, updateClient, deleteClient } = require('../controllers/clientController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authenticateToken); // Protect all client routes

router.get('/', getClients);
router.get('/:id', getClient);
router.post('/', createClient);
router.put('/:id', updateClient);
router.delete('/:id', deleteClient);

module.exports = router;
