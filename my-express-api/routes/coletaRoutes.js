
const express = require('express');
const { createColeta, getColetas, updateColeta, deleteColeta } = require('../controllers/coletaController');
const { verifyToken } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/coletas', verifyToken, createColeta);
router.get('/coletas', verifyToken, getColetas);
router.put('/coletas/:id', verifyToken, updateColeta);
router.delete('/coletas/:id', verifyToken, deleteColeta);

module.exports = router;
