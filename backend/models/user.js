const { PrismaClient } = require('../generated/sql');
const prisma = new PrismaClient();

module.exports = {
  
  createUser: async (user) => {
    try {
      return await prisma.user.create({
        data: user,
      });
    } catch (error) {
      console.error('Error in createUser:', error);
      throw error;
    }
  },

  findUserByEmail: async (email) => {
    try {
      return await prisma.user.findUnique({
        where: { email },
      });
    } catch (error) {
      console.error('Error in findUserByEmail:', error);
      throw error;
    }
  },

};

