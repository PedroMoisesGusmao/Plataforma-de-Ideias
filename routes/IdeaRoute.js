const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const ideasController = require('../controllers/ideasController');
 
router.post('/ideas',
  [
    body('title')
      .notEmpty().withMessage('O título é obrigatório')
      .isLength({ min: 3 }).withMessage('O título deve ter pelo menos 3 caracteres'),
 
    body('description')
      .notEmpty().withMessage('A descrição é obrigatória'),
 
    body('category')
      .notEmpty().withMessage('A categoria é obrigatória')
  ],
  ideasController.saveIdea
);
 
router.post('/ideas/:id',
  [
    body('title')
      .optional()
      .isLength({ min: 3 }).withMessage('O título deve ter pelo menos 3 caracteres'),
 
    body('description')
      .optional(),
 
    body('category')
      .optional()
  ],
  ideasController.updateIdea
);
 
module.exports = router;