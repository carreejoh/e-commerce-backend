const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// The `/api/tags` endpoint

router.get("/", (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  ProductTag.findAll({
    include: [{ model: Product }],
  }).then((tagData) => {
    res.json(tagData);
  });
});

router.get("/:id", async (req, res) => {
  try {
    const tagData = await Tag.findByPk(req.params.id);
    if (!tagData) {
      res.status(404).json({ message: "This Tag doesn't exist" });
      return;
    } else {
      res.status(200).json(tagData);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const tag = await Tag.create({
      tag_name: req.body.tag_name,
    });
    res.json(tag);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const tag = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    res.json(tag);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const tag = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.json(tag);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
