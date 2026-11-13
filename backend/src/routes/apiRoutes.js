const express = require('express');
const router = express.Router();
const animalController = require('../controllers/animalController');
const servicoController = require('../controllers/servicoController');

router.get('/animais', animalController.listarAnimais);
router.post('/animais', animalController.criarAnimal);
router.delete('/animais/:id', animalController.excluirAnimal);
router.get('/animais/:id/historico', servicoController.consultarHistoricoPorAnimal);

router.get('/servicos', servicoController.listarServicos);
router.post('/servicos', servicoController.registrarServico);

module.exports = router;
