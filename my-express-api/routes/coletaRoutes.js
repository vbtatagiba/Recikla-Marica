const express = require('express');
const {
  createColeta,
  getColetas,
  getMaterials,
  getMaterialQuantities,
  updateColeta,
  deleteColeta,
  getAvailableColetas,
  acceptColeta,
} = require('../controllers/coletaController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/coletas', authMiddleware, createColeta);
router.get('/coletas', authMiddleware, getColetas);
router.get('/coletas/getMaterials', getMaterials);
router.get('/coletas/getMaterialQuantities', getMaterialQuantities);
router.put('/coletas/:id', authMiddleware, updateColeta);
router.delete('/coletas/:id', authMiddleware, deleteColeta);
router.get('/coletas-disponiveis', authMiddleware, getAvailableColetas);
router.put('/coletas/:id/aceitar', authMiddleware, acceptColeta);

module.exports = router;
