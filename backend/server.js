require('dotenv').config();
const express = require('express');
const { PrismaClient } = require('./generated/mongo');
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());

const prisma_mongo = new PrismaClient();
async function testMongoConnection() {
  try {
    await prisma_mongo.$connect();
    console.log('Mongo connected successfully');
  } catch (error) {
    console.error('Mongo connection failed:', error);
    process.exit(1);
  }
}

testMongoConnection().then(() => {
  const authRoutes = require('./routes/auth');
  const productRoutes = require('./routes/product');
  const orderRoutes = require('./routes/order');

  
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/orders', orderRoutes);
  const PORT = process.env.PORT || 9000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});