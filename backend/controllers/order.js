const { PrismaClient: PrismaClientSQL } = require('../generated/sql');
const { PrismaClient: PrismaClientMongo } = require('../generated/mongo');

const prismaSql = new PrismaClientSQL();
const prismaMongo = new PrismaClientMongo();

const createOrder = async (req, res) => {
  const { items } = req.body;
  const userId = req.user.id;

  console.log(`[ORDER] Create order request from user: ${userId}`);

  if (!items || !items.length) {
    console.warn('[ORDER] No items provided in request');
    return res.status(400).json({ message: 'No items in cart' });
  }

  try {
    console.log('[ORDER] Fetching product prices for order...');

    const productIds = items.map(item => item.productId);

    const products = await prismaMongo.product.findMany({
      where: { id: { in: productIds } },
    });

    const productMap = products.reduce((map, product) => {
      map[product.id] = product.price;
      return map;
    }, {});

    let total = 0;

    const orderItems = items.map(item => {
      const priceAtPurchase = productMap[item.productId];

      if (!priceAtPurchase) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      total += priceAtPurchase * item.quantity;

      return {
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase,
      };
    });

    console.log('[ORDER] Creating order in SQL...');

    const order = await prismaSql.orders.create({
      data: {
        userId,
        total,
      },
    });

    const orderItemEntries = orderItems.map(item => ({
      orderId: order.id,
      ...item,
    }));

    await prismaSql.orderItem.createMany({
      data: orderItemEntries,
    });

    console.log('[ORDER] Fetching full order details...');

    const fullOrder = await prismaSql.orders.findUnique({
      where: { id: order.id },
      include: { items: true },
    });

    console.log('[ORDER] Order creation successful:', order.id);

    return res.status(201).json(fullOrder);

  } catch (error) {
    console.error('[ORDER] Checkout error:', error);
    return res.status(500).json({
      message: 'Checkout failed',
      error: error.message,
    });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    console.log(`[ORDER] Fetching all orders for user: ${userId}`);

    const orders = await prismaSql.orders.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({ orders });

  } catch (err) {
    console.error('[ORDER] Error fetching user orders:', err);
    return res.status(500).json({ message: 'Failed to fetch orders' });
  }
};


const getOrderById = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = Number(req.params.id);

    console.log(`[ORDER] Fetching order ${orderId} for user ${userId}`);

    const order = await prismaSql.orders.findUnique({
      where: { id: orderId },
      include: { items: true }
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // security check
    if (order.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    // Extract productIds (Mongo IDs)
    const productIds = order.items.map(i => i.productId);

    const mongoProducts = await prismaMongo.product.findMany({
      where: {
        id: { in: productIds }
      }
    });

    const productMap = {};
    mongoProducts.forEach(p => { productMap[p.id] = p; });

    // Merge SQL order item with Mongo product
    const orderWithProducts = {
      ...order,
      items: order.items.map(i => ({
        ...i,
        product: productMap[i.productId] || null
      }))
    };

    return res.json(orderWithProducts);

  } catch (err) {
    console.error('[ORDER] Error fetching order:', err);
    return res.status(500).json({ message: 'Failed to fetch order' });
  }
};

module.exports = {createOrder, getMyOrders, getOrderById };
