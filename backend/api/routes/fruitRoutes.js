const express = require("express");
const Fruit = require("../models/Fruit");
const router = express.Router();

router.get("/", async (req, res) => {
  const fruits = await Fruit.find();

  if (!fruits) {
    return res.status(500).json({ message: "Internal server error." });
  }

  res.status(200).json(fruits);
});

router.post("/", async (req, res) => {
  try {
    const { name, price } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: "Name and price are required." });
    }

    const fruit = await Fruit.create({ name, price });

    if (!fruit) {
      return res.status(400).json({ message: "Invalid data." });
    }

    res.status(201).json(fruit);
  } catch (error) {
    res.status(400).json({ message: "Invalid data" });
  }
});

module.exports = router;
