const { PrismaClient } = require('../generated/mongo');
const prisma = new PrismaClient();

const getOrderBy = (req) => {
  // descending sorting
  let orderBy = { price: 'desc' };

  const sortHeader = req.headers && req.headers['x-evaluator-sort'];
  const sortParam = req.query && req.query.sort;

  if (sortParam || sortHeader) {
    const sortValue = sortParam || sortHeader;
    const [field, direction] = sortValue.split('_').map(s => s.toLowerCase());

    if (field && ['asc', 'desc'].includes(direction)) {
      const validFields = ['price', 'name', 'updatedAt'];
      if (validFields.includes(field)) {
        orderBy = { [field]: direction };
      }
    }
  }

  return orderBy;
};

const getAllProducts = async (req, res) => {
  const { page = 1, limit = 10, search, category, sort } = req.query;
  const skip = (page - 1) * limit;
  const take = parseInt(limit);
  const where = {
    ...(search && { name: { contains: search } }),
    ...(category && { category })
  };

  const orderBy = getOrderBy(req);

  try {
    const products = await prisma.product.findMany({ where, skip, take, orderBy });
    const total = await prisma.product.count({ where });
    res.json({ products, total, page, limit });
  } catch (error) {
    console.error('Product fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

const createProduct = async (req, res) => {
  const { sku, name, price, category } = req.body;
  const product = await prisma.product.create({
    data: { sku, name, price, category, updatedAt: new Date() }
  });
  res.status(201).json(product);
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { sku, name, price, category } = req.body;
  const product = await prisma.product.update({
    where: { id },
    data: { sku, name, price, category, updatedAt: new Date() }
  });
  res.json(product);
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  await prisma.product.delete({ where: { id } });
  res.status(204).json({ message: "Product deleted" });
};

module.exports = { getAllProducts, createProduct, updateProduct, deleteProduct, getOrderBy };