// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// Products belongsTo Category
Product.belongsTo(Category, {
  foreignKey: 'category_id'
})
// Categories have many Products
Category.hasMany(Product, {
  foreignKey: 'category_id'
})

ProductTag.belongsTo(Product, {
  foreignKey: 'product_id'
})

Product.hasMany(ProductTag, {
  foreignKey: 'product_id'
})
// Products belongToMany Tags (through ProductTag)
// Product.belongsToMany(Tag, {
//   foreignKey: 'pro'
// })
// Tags belongToMany Products (through ProductTag)

module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
