const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  try {
    // Find all tags and include their associated product data
    const tags = await Tag.findAll({
      include: Product
    });
    res.json(tags);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    // Find a tag by its ID and include its associated product data
    const tag = await Tag.findByPk(req.params.id, {
      include: Product
    });
    if (!tag) {
      res.status(404).json({ message: 'Tag not found' });
      return;
    }
    res.json(tag);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  try {
    // Create a new tag
    const newTag = await Tag.create(req.body);
    res.status(201).json(newTag);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    // Update a tag's name by its ID
    const updatedTag = await Tag.update(req.body, {
      where: {
        id: req.params.id
      }
    });
    res.json(updatedTag);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    // Delete a tag by its ID
    const deletedTag = await Tag.destroy({
      where: {
        id: req.params.id
      }
    });
    res.json(deletedTag);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
