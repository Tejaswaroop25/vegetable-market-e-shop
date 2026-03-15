const express = require('express');
const router = express.Router();
const { 
    getVegetables, 
    updateVegetablePrice, 
    createVegetable, 
    deleteVegetable 
} = require('./vegetableController');

router.get('/', getVegetables);
router.post('/', createVegetable);
router.put('/:id', updateVegetablePrice);
router.delete('/:id', deleteVegetable);

module.exports = router;
