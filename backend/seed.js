const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Category = require('./models/Category');
const Product = require('./models/Product');

dotenv.config({ path: path.join(__dirname, '.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mystore';

const categories = [
  { name: 'Moisturizers', description: 'Daily hydration for all skin types' },
  { name: 'Serums', description: 'Targeted treatments with active ingredients' },
  { name: 'Cleansers', description: 'Gentle daily cleansing formulas' },
  { name: 'SPF', description: 'Daily sun protection' },
  { name: 'Toners', description: 'Balancing and prepping toners' },
  { name: 'Treatments', description: 'Targeted overnight and spot treatments' },
  { name: 'Eye Care', description: 'Delicate eye area formulas' },
];

const products = (cats) => [
  // Moisturizers
  {
    name: 'Hydra Glow Daily Moisturizer',
    description: 'A lightweight, fast-absorbing moisturizer infused with ceramides, hyaluronic acid, and niacinamide. Provides 72-hour hydration and visibly plumps skin in just 2 weeks. Fragrance-free and non-comedogenic.',
    price: 38,
    stock: 80,
    category: cats['Moisturizers'],
    image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600&q=80',
  },
  {
    name: 'Rich Barrier Repair Cream',
    description: 'A deeply nourishing cream with shea butter, squalane, and peptides that restores the skin barrier and locks in moisture overnight. Ideal for dry and sensitive skin.',
    price: 54,
    stock: 60,
    category: cats['Moisturizers'],
    image: 'https://images.unsplash.com/photo-1567721913486-6585f069b332?w=600&q=80',
  },
  {
    name: 'Balancing Gel Moisturizer',
    description: 'Oil-free gel formula with green tea extract and zinc PCA controls shine while delivering lightweight hydration. Perfect for oily and combination skin. Non-sticky finish.',
    price: 32,
    stock: 75,
    category: cats['Moisturizers'],
    image: 'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=600&q=80',
  },
  // Serums
  {
    name: 'Vitamin C Brightening Serum',
    description: '20% stabilised L-ascorbic acid serum that visibly fades dark spots, evens skin tone and delivers antioxidant protection. Results visible within 2 weeks of daily use.',
    price: 65,
    stock: 55,
    category: cats['Serums'],
    image: 'https://images.unsplash.com/photo-1571781418606-70265b9cce90?w=600&q=80',
  },
  {
    name: 'Hyaluronic Acid Plumping Serum',
    description: 'Multi-molecular hyaluronic acid serum works at every layer of the skin to deliver deep, lasting hydration. Visibly plumps fine lines and gives skin a dewy, bouncy texture.',
    price: 48,
    stock: 90,
    category: cats['Serums'],
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&q=80',
  },
  {
    name: 'Niacinamide 10% + Zinc Serum',
    description: 'High-strength niacinamide formula minimises the appearance of pores, controls oil production, and fades blemish marks. Contains zinc PCA for additional sebum regulation.',
    price: 28,
    stock: 100,
    category: cats['Serums'],
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&q=80',
  },
  // Cleansers
  {
    name: 'Gentle Milky Foam Cleanser',
    description: 'A pH-balanced, sulphate-free foam cleanser that removes makeup, excess oil and impurities without stripping the skin\'s natural moisture barrier. Leaves skin soft and comfortable.',
    price: 24,
    stock: 120,
    category: cats['Cleansers'],
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&q=80',
  },
  {
    name: 'Exfoliating AHA Gel Cleanser',
    description: 'Daily exfoliating cleanser with 5% glycolic acid gently resurfaces skin, unclogs pores and brightens dull complexions. Use morning or evening for smooth, radiant skin.',
    price: 29,
    stock: 70,
    category: cats['Cleansers'],
    image: 'https://images.unsplash.com/photo-1631730359585-38a4935cbec4?w=600&q=80',
  },
  // SPF
  {
    name: 'Invisible SPF 50+ Daily Shield',
    description: 'Ultra-lightweight broad-spectrum mineral sunscreen with zero white cast. Water-resistant formula with antioxidant vitamin E. Comfortable to wear daily under makeup.',
    price: 35,
    stock: 85,
    category: cats['SPF'],
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80',
  },
  {
    name: 'Tinted SPF 30 Glow Fluid',
    description: 'Lightweight tinted sunscreen with SPF 30 that blurs imperfections and gives skin a healthy natural glow. Buildable coverage with a breathable, skin-like finish.',
    price: 42,
    stock: 65,
    category: cats['SPF'],
    image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&q=80',
  },
  // Toners
  {
    name: 'Calming Rose Hydrating Toner',
    description: 'Alcohol-free hydrating toner with rose water, aloe vera, and panthenol that soothes irritation and preps skin to absorb serums and moisturisers more effectively.',
    price: 26,
    stock: 95,
    category: cats['Toners'],
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&q=80',
  },
  // Treatments
  {
    name: 'Retinol 0.5% Night Repair Cream',
    description: 'Encapsulated retinol cream that time-releases 0.5% retinol overnight to smooth fine lines, improve skin texture and stimulate collagen. Formulated with bakuchiol to reduce irritation.',
    price: 72,
    stock: 45,
    category: cats['Treatments'],
    image: 'https://images.unsplash.com/photo-1605462863863-10d9e47e15ee?w=600&q=80',
  },
  {
    name: 'Rose Hip Regenerating Facial Oil',
    description: 'Cold-pressed rosehip seed oil rich in omega fatty acids, vitamin A and C. Reduces hyperpigmentation, brightens and deeply nourishes. Apply 2-3 drops nightly for glowing skin.',
    price: 55,
    stock: 50,
    category: cats['Treatments'],
    image: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?w=600&q=80',
  },
  // Eye Care
  {
    name: 'Caffeine Under Eye Revival Gel',
    description: 'Cooling eye gel with 5% caffeine and peptides that visibly de-puffs, firms and brightens the under-eye area. Reduces the appearance of dark circles from first use.',
    price: 45,
    stock: 60,
    category: cats['Eye Care'],
    image: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=600&q=80',
  },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  await Product.deleteMany({});
  await Category.deleteMany({});
  console.log('Cleared existing products and categories');

  const createdCats = {};
  for (const cat of categories) {
    const created = await Category.create(cat);
    createdCats[cat.name] = created._id;
    console.log(`Created category: ${cat.name}`);
  }

  const productDocs = products(createdCats);
  await Product.insertMany(productDocs);
  console.log(`Inserted ${productDocs.length} products`);

  await mongoose.disconnect();
  console.log('Done.');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
