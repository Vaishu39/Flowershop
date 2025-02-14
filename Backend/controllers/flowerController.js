const mongoose = require("mongoose");
const Flower = require("../models/FlowerModel");
const fs = require('fs');
const path = require('path');

// Define the path where the images will be stored
const UPLOAD_PATH = path.join(__dirname, '..', 'uploads');


if (!fs.existsSync(UPLOAD_PATH)) {
    fs.mkdirSync(UPLOAD_PATH, { recursive: true });
}

// Create a Flower (POST)
const createFlower = async (req, res) => {
    const { name, quantity, color } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';

    try {
        const flower = await Flower.create({ name, image, quantity, color });
        res.status(201).json(flower);
    } catch (error) {
        console.error("Error creating flower:", error);
        res.status(400).json({ error: "Failed to create flower. Ensure all fields are correctly filled." });
    }
};

// Get all Flowers (GET)
const getFlowers = async (req, res) => {
    try {
        const flowers = await Flower.find().select("name image quantity color"); // More readable
        res.status(200).json(flowers);
    } catch (error) {
        console.error("Error fetching flowers:", error);
        res.status(500).json({ error: "Could not retrieve flowers." });
    }
};

// Get a Single Flower (GET)
const getSingleFlower = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid Flower ID" });
    }

    try {
        const flower = await Flower.findById(id);
        if (!flower) {
            return res.status(404).json({ error: "Flower not found" });
        }
        res.status(200).json(flower);
    } catch (error) {
        console.error("Error fetching flower:", error);
        res.status(500).json({ error: "Error retrieving the flower." });
    }
};

// Update a Flower (PUT & PATCH)
const updateFlower = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid Flower ID" });
    }

    try {
        const flower = await Flower.findById(id);
        if (!flower) {
            return res.status(404).json({ error: "Flower not found" });
        }

        let updateData = { ...req.body };

        // Delete old image if a new image is uploaded
        if (req.file) {
            if (flower.image) {
                const oldImagePath = path.join(__dirname, "..", flower.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            updateData.image = `/uploads/${req.file.filename}`;
        }
        

        const updatedFlower = await Flower.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        res.status(200).json(updatedFlower);
    } catch (error) {
        console.error("Error updating flower:", error);
        res.status(500).json({ error: "Could not update flower." });
    }
};

// Delete a Flower (DELETE)
const deleteFlower = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid Flower ID" });
    }

    try {
        const flower = await Flower.findByIdAndDelete(id);
        if (!flower) {
            return res.status(404).json({ error: "Flower not found" });
        }

        // Delete image file
        if (flower.image) {
            const imagePath = path.join(__dirname, '..', flower.image);
            if (fs.existsSync(imagePath)) {
                fs.unlink(imagePath, (err) => {
                    if (err) console.error("Error deleting image:", err);
                });
            }
        }
        res.status(200).json({ message: "Flower deleted successfully" });
    } catch (error) {
        console.error("Error deleting flower:", error);
        res.status(500).json({ error: "Could not delete flower." });
    }
};

module.exports = { createFlower, getFlowers, getSingleFlower, updateFlower, deleteFlower };
