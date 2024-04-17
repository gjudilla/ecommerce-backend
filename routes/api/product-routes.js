const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// Get all products
router.get('/', async (req, res) => {
  try {
    // Find all products and include their associated category and tag data
    const products = await Product.findAll({
      include: [Category, { model: Tag, through: ProductTag }]
    });
    res.json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get one product by ID
router.get('/:id', async (req, res) => {
  try {
    // Find a product by its ID and include its associated category and tag data
    const product = await Product.findByPk(req.params.id, {
      include: [Category, { model: Tag, through: ProductTag }]
    });
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create new product
router.post('/', async (req, res) => {
  try {
    // Create a new product
    const newProduct = await Product.create(req.body);
    // If there are tag IDs in the request body, create associations in the ProductTag model
    if (req.body.tagIds && req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map(tag_id => ({
        product_id: newProduct.id,
        tag_id
      }));
      await ProductTag.bulkCreate(productTagIdArr);
    }
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    // Update product data
    await Product.update(req.body, {
      where: {
        id: req.params.id
      }
    });
    // If there are tag IDs in the request body, update associations in the ProductTag model
    if (req.body.tagIds && req.body.tagIds.length) {
      // Remove existing associations
      await ProductTag.destroy({
        where: {
          product_id: req.params.id
        }
      });
      // Create new associations
      const productTagIdArr = req.body.tagIds.map(tag_id => ({
        product_id: req.params.id,
        tag_id
      }));
      await ProductTag.bulkCreate(productTagIdArr);
    }
    res.status(200).json({ message: 'Product updated successfully' });
  } catch (err) {
    res.status(400).json(err);
  }
});

// Delete one product by its ID
router.delete('/:id', async (req, res) => {
  try {
    // Delete a product by its ID
    await Product.destroy({
      where: {
        id: req.params.id
      }
    });
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;

