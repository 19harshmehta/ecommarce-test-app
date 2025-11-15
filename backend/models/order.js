const { PrismaClient } = require('../generated/sql');
const prisma = new PrismaClient();

module.exports = {
  
  createOrder: async (order) => {
    try {
      return await prisma.order.create({
        data: order,
      });
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  createManyOrderItems: async (items) => {
    try {
      return await prisma.orderItem.createMany({
        data: items,
      });
    } catch (error) {
      console.error('Error creating order items:', error);
      throw error;
    }
  },

  getUserOrders: async (userId) => {
    try {
      return await prisma.order.findMany({
        where: { userId },
        include: {
          items: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  },
};
