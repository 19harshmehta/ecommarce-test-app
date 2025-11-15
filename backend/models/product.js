const { PrismaClient } = require('../generated/mongo');
const prisma = new PrismaClient();

module.exports = {

  getProducts: async (options) => {
    try {
      return await prisma.product.findMany(options);
    } catch (error) {
      console.error('Error in getProducts:', error);
      throw error;
    }
  },

  createProduct: async (product) => {
    try {
      return await prisma.product.create({
        data: product,
      });
    } catch (error) {
      console.error('Error in createProduct:', error);
      throw error;
    }
  },

  updateProduct: async (id, product) => {
    try {
      return await prisma.product.update({
        where: { id },
        data: product,
      });
    } catch (error) {
      console.error('Error in updateProduct:', error);
      throw error;
    }
  },

  deleteProduct: async (id) => {
    try {
      return await prisma.product.delete({
        where: { id },
      });
    } catch (error) {
      console.error('Error in deleteProduct:', error);
      throw error;
    }
  },

  searchProducts: async (search, category, skip, take, orderBy) => {
    try {
      return await prisma.product.findMany({
        where: {
          AND: [
            search ? { name: { contains: search } } : {},
            category ? { category } : {},
          ],
        },
        skip,
        take,
        orderBy,
      });
    } catch (error) {
      console.error('Error in searchProducts:', error);
      throw error;
    }
  },

  countProducts: async (search, category) => {
    try {
      return await prisma.product.count({
        where: {
          AND: [
            search ? { name: { contains: search } } : {},
            category ? { category } : {},
          ],
        },
      });
    } catch (error) {
      console.error('Error in countProducts:', error);
      throw error;
    }
  },
};
