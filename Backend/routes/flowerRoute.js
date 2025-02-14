const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const { createFlower, getFlowers, getSingleFlower, updateFlower, deleteFlower } = require('../controllers/flowerController');

// Get all flowers
router.get('/', getFlowers);

// Create a new flower (with image upload)
router.post('/', upload.single('image'), createFlower);

// Get a single flower by ID
router.get('/:id', getSingleFlower);

// Update a flower
router.put('/:id', upload.single('image'), updateFlower);
router.patch('/:id', upload.single('image'), updateFlower);


// Delete a flower
router.delete('/:id', deleteFlower);

module.exports = router;
