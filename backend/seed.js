const { PrismaClient: PrismaClientSQL } = require('./generated/sql');
const { PrismaClient: PrismaClientMongo } = require('./generated/mongo');
const prisma_sql = new PrismaClientSQL();
const prisma_mongo = new PrismaClientMongo();
const bcrypt = require('bcrypt');

async function seed() {
  try {
    const passwordHashAdmin = await bcrypt.hash('admin123', 10);
    const passwordHashCustomer = await bcrypt.hash('harsh123', 10);

    await prisma_sql.user.createMany({
      data: [
        {
          name: 'Admin User',
          email: 'admin@yopmail.com',
          passwordHash: passwordHashAdmin,
          role: 'admin'
        },
        {
          name: 'Harsh Mehta',
          email: 'harsh@yopmail.com',
          passwordHash: passwordHashCustomer,
          role: 'customer'
        }
      ]
    });

    console.log('SQL Users Seeded');

    const products = [
      { sku: 'ELEC-4001', name: 'Apple iPad Pro 12.9-inch (M3)', price: 1399.00, category: 'electronics' },
      { sku: 'ELEC-4002', name: 'Sony Bravia 65-inch OLED 4K TV', price: 2499.99, category: 'electronics' },
      { sku: 'ELEC-4003', name: 'Samsung Galaxy Buds Pro 3', price: 249.00, category: 'electronics' },

      { sku: 'FASH-5001', name: 'Prada Saffiano Leather Wallet', price: 720.00, category: 'fashion' },
      { sku: 'FASH-5002', name: 'Balenciaga Oversized Hoodie', price: 950.00, category: 'fashion' },
      { sku: 'FASH-5003', name: 'Versace Embroidered Silk Shirt', price: 1250.00, category: 'fashion' },

      { sku: 'CLOTH-6001', name: "Levi's Premium Denim Jacket", price: 169.99, category: 'clothing brand' },
      { sku: 'CLOTH-6002', name: 'Nike Air Force 1 Shadow Edition', price: 160.00, category: 'clothing brand' },
      { sku: 'CLOTH-6003', name: 'Zara Wool Blend Trench Coat', price: 220.00, category: 'clothing brand' },

      { sku: 'HARD-7001', name: 'Bosch Brushless Hammer Drill 850W', price: 329.00, category: 'hardware' },
      { sku: 'HARD-7002', name: 'Makita Heavy Duty Angle Grinder 9-Inch', price: 199.99, category: 'hardware' },
      { sku: 'HARD-7003', name: 'DeWalt Compact Router Kit', price: 279.50, category: 'hardware' },

      { sku: 'HOME-8001', name: 'Dyson V15 Detect Cordless Vacuum', price: 899.00, category: 'home appliances' },
      { sku: 'HOME-8002', name: 'LG 7-Star 1.5 Ton Smart AC', price: 1425.00, category: 'home appliances' },
      { sku: 'HOME-8003', name: 'Philips Premium Air Purifier Series 5000', price: 349.00, category: 'home appliances' },

      { sku: 'GAME-9001', name: 'PlayStation 5 Pro 2TB', price: 749.00, category: 'gaming' },
      { sku: 'GAME-9002', name: 'Xbox Elite Series 3 Controller', price: 199.00, category: 'gaming' },
      { sku: 'GAME-9003', name: 'Razer Viper Ultimate Gaming Mouse', price: 149.99, category: 'gaming' },

      { sku: 'BEAU-1001', name: 'Dior Capture Total Skincare Set', price: 420.00, category: 'beauty' },
      { sku: 'BEAU-1002', name: 'La Mer Moisturizing Soft Cream 60ml', price: 380.00, category: 'beauty' },
      { sku: 'BEAU-1003', name: 'Dyson Supersonic Hair Dryer Limited Edition', price: 499.00, category: 'beauty' },

      { sku: 'SPRT-1101', name: 'Adidas Predator Elite Football Boots', price: 280.00, category: 'sports' },
      { sku: 'SPRT-1102', name: 'Wilson Pro Staff RF97 Tennis Racket', price: 299.99, category: 'sports' },
      { sku: 'SPRT-1103', name: 'Under Armour Training Smart Vest', price: 120.00, category: 'sports' },

      { sku: 'AUTO-1201', name: 'Michelin Pilot Sport 4 Car Tire', price: 245.00, category: 'automotive' },
      { sku: 'AUTO-1202', name: 'Bosch Automotive Battery 70Ah', price: 185.00, category: 'automotive' },
      { sku: 'AUTO-1203', name: "Meguiar's Premium Ceramic Car Care Kit", price: 110.00, category: 'automotive' },

      { sku: 'FURN-1301', name: 'IKEA Modern Wooden Work Desk', price: 349.99, category: 'furniture' },
      { sku: 'FURN-1302', name: 'Sleepwell King Size Memory Foam Mattress', price: 599.00, category: 'furniture' },
      { sku: 'FURN-1303', name: 'Urban Ladder Recliner Sofa Chair', price: 899.00, category: 'furniture' },

      { sku: 'KITCH-1401', name: 'Prestige Steel Cookware Set (10 pcs)', price: 159.99, category: 'kitchenware' },
      { sku: 'KITCH-1402', name: 'KitchenAid Artisan Stand Mixer', price: 549.00, category: 'kitchenware' },
      { sku: 'KITCH-1403', name: 'Ninja Professional Blender 1500W', price: 199.99, category: 'kitchenware' },

      { sku: 'LUXE-1501', name: 'Rolex Submariner Black Dial', price: 9999.00, category: 'luxury' },
      { sku: 'LUXE-1502', name: 'Chanel Classic Flap Bag', price: 7200.00, category: 'luxury' },
      { sku: 'LUXE-1503', name: 'Montblanc Meisterstück Fountain Pen', price: 950.00, category: 'luxury' }
    ];

    for (const p of products) {
      await prisma_mongo.product.create({
        data: {
          sku: p.sku,
          name: p.name,
          price: p.price,
          category: p.category,
          updatedAt: new Date().toISOString()
        }
      });
    }

    console.log('Mongo Products Seeded');


    await prisma_sql.order.createMany({
      data: [
        { userId: 1, total: 2000.00 },
        { userId: 2, total: 1750.78 }
      ]
    });


    await prisma_sql.orderItem.createMany({
      data: [
        { orderId: 1, productSku: 'ELEC-4001', quantity: 3, priceAtPurchase: 650.00 },
        { orderId: 2, productSku: 'FASH-5001', quantity: 2, priceAtPurchase: 875.39 }
      ]
    });

    console.log('SQL Orders + Items Seeded');

  } catch (err) {
    console.error(err);
  } finally {
    await prisma_sql.$disconnect();
    await prisma_mongo.$disconnect();
  }
}

seed();
