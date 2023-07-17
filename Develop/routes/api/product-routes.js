const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  Product.findAll({
    include: [{model: Category}, {model: ProductTag}]
  }).then((productData) => {
    res.json(productData);
  });
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try {
    const productData = await Product.findByPk(req.params.id);
    if(!productData) {
      res.status(404).json({ message: "This product doesn't exist"});
      return;
    } else {
      res.status(200).json(productData);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// create new product
router.post('/', (req, res) => {
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product


router.put('/:id', async (req,res) => {
  try{
    const product = await Product.update(req.body, 
      {
        where: {
          id: req.params.id,
        },
      })
      if(!product) {
        res.json({message: "Product doesn't exist"})
      }
      res.json(product)
  } catch (err) {
    res.json(err)
  }
})

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value

  try{

    const relatedTags = await ProductTag.destroy(
      {
        where: {
          product_id: req.params.id
        }
      }
      )
      const product = await Product.destroy({
        where: {
          id: req.params.id,
        },
      })
      if(!product) {
        res.json({message: "No product found"})
      }
      res.json(product + relatedTags)
  } catch(err) {
    res.json(err)
  }
})

//   Product.destroy({
//     where: {
//       id: req.params.id,
//     },
//   })
//   .then((deletedProduct) => {
//     res.json(deletedProduct);
//   })
//   .catch((err) => res.json(err));
// });

module.exports = router;
