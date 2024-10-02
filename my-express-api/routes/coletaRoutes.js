
const express = require('express');
const { createColeta, getColetas, updateColeta, deleteColeta } = require('../controllers/coletaController');
const {authMiddleware }= require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/coletas', authMiddleware, createColeta);
router.get('/coletas', authMiddleware, getColetas);
router.put('/coletas/:id', authMiddleware, updateColeta);
router.delete('/coletas/:id', authMiddleware, deleteColeta);

module.exports = router;
