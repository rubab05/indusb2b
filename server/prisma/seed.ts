import { PrismaClient, AccountType, ApprovalStatus, UserRole, OrderStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ─── BRAND CONFIG ─────────────────────────────────────
  await prisma.brandConfig.upsert({
    where: { id: 'brand-default' },
    update: {},
    create: {
      id: 'brand-default',
      brandName: 'HOMATZ',
      primaryColor: '#1a1a1a',
      secondaryColor: '#f5f5f5',
      accentColor: '#f59e0b',
    },
  });

  // ─── USERS ────────────────────────────────────────────
  const passwordHash = await bcrypt.hash('test123', 12);
  const adminHash = await bcrypt.hash('admin123', 12);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@homatz.com' },
    update: {},
    create: {
      email: 'admin@homatz.com',
      passwordHash: adminHash,
      companyName: 'HOMATZ Admin',
      accountType: AccountType.WHOLESALE,
      approvalStatus: ApprovalStatus.APPROVED,
      role: UserRole.ADMIN,
    },
  });

  const wholesaleUser = await prisma.user.upsert({
    where: { email: 'buyer@tradeco.com' },
    update: {},
    create: {
      email: 'buyer@tradeco.com',
      passwordHash,
      companyName: 'TradeCo Ltd',
      accountType: AccountType.WHOLESALE,
      approvalStatus: ApprovalStatus.APPROVED,
      role: UserRole.PARTNER,
      profile: {
        create: {
          contactName: 'James Henderson',
          contactEmail: 'james@tradeco.com',
          contactPhone: '07700 900123',
          companyRegNumber: '12345678',
          addressLine1: '45 Commerce Street',
          city: 'Manchester',
          postcode: 'M1 2AB',
          country: 'United Kingdom',
          revenueRange: '£500k–£1m',
        },
      },
    },
  });

  const dropshipUser = await prisma.user.upsert({
    where: { email: 'seller@dropstore.co.uk' },
    update: {},
    create: {
      email: 'seller@dropstore.co.uk',
      passwordHash,
      companyName: 'DropStore UK',
      accountType: AccountType.DROPSHIP,
      approvalStatus: ApprovalStatus.APPROVED,
      role: UserRole.PARTNER,
      profile: {
        create: {
          contactName: 'Sarah Patel',
          contactEmail: 'sarah@dropstore.co.uk',
          contactPhone: '07700 900456',
          addressLine1: '12 Digital Lane',
          city: 'London',
          postcode: 'E1 6RF',
          country: 'United Kingdom',
          websiteUrl: 'https://dropstore.co.uk',
          platform: 'Shopify',
          estimatedMonthlyVolume: '200–500 orders',
        },
      },
      dropshipBalance: {
        create: {
          currentBalance: 342.5,
          currency: 'GBP',
          threshold: 50,
          isLocked: false,
        },
      },
    },
  });

  const pendingUser = await prisma.user.upsert({
    where: { email: 'newbiz@startup.com' },
    update: {},
    create: {
      email: 'newbiz@startup.com',
      passwordHash,
      companyName: 'Startup Supplies',
      accountType: AccountType.WHOLESALE,
      approvalStatus: ApprovalStatus.PENDING,
      role: UserRole.PARTNER,
    },
  });

  const rejectedUser = await prisma.user.upsert({
    where: { email: 'rejected@example.com' },
    update: {},
    create: {
      email: 'rejected@example.com',
      passwordHash,
      companyName: 'Rejected Co',
      accountType: AccountType.DROPSHIP,
      approvalStatus: ApprovalStatus.REJECTED,
      role: UserRole.PARTNER,
    },
  });

  console.log('✅ Users seeded');

  // ─── PARTNER APPLICATIONS ──────────────────────────────
  await prisma.partnerApplication.createMany({
    skipDuplicates: true,
    data: [
      {
        userId: wholesaleUser.id,
        accountType: AccountType.WHOLESALE,
        status: ApprovalStatus.APPROVED,
        businessType: 'Retailer',
        categoriesOfInterest: ['Kitchen & Household', 'Garden & Outdoor'],
        reviewedBy: adminUser.id,
        reviewedAt: new Date('2024-01-15'),
      },
      {
        userId: dropshipUser.id,
        accountType: AccountType.DROPSHIP,
        status: ApprovalStatus.APPROVED,
        businessType: 'Online Retailer',
        categoriesOfInterest: ['Mats & Rugs', 'Decoration & Seasonal'],
        reviewedBy: adminUser.id,
        reviewedAt: new Date('2024-02-20'),
      },
      {
        userId: pendingUser.id,
        accountType: AccountType.WHOLESALE,
        status: ApprovalStatus.PENDING,
        businessType: 'Distributor',
        categoriesOfInterest: ['Toys & Games'],
      },
      {
        userId: rejectedUser.id,
        accountType: AccountType.DROPSHIP,
        status: ApprovalStatus.REJECTED,
        adminNotes: 'Could not verify business registration.',
        reviewedBy: adminUser.id,
        reviewedAt: new Date('2024-03-01'),
      },
    ],
  });

  console.log('✅ Applications seeded');

  // ─── CATEGORIES ──────────────────────────────────────
  const kitchenCat = await prisma.category.upsert({
    where: { slug: 'kitchen-and-household' },
    update: {},
    create: {
      name: 'Kitchen & Household',
      slug: 'kitchen-and-household',
      heroTitle: 'Kitchen & Household Essentials',
      heroDescription: 'Premium wholesale kitchen and household products for trade buyers.',
      intro: 'Our kitchen and household range offers quality cookware, storage solutions, and home essentials at competitive wholesale prices.',
      benefits: [
        { icon: 'award', title: 'Trade Quality', description: 'Commercial-grade materials built for volume and durability.' },
        { icon: 'package', title: 'Bulk Ready', description: 'All products available in bulk with competitive MOQs.' },
        { icon: 'truck', title: 'Fast Dispatch', description: 'In-stock items dispatched within 2 business days.' },
      ],
      status: 'published',
      sortOrder: 1,
    },
  });

  const matsRugsCat = await prisma.category.upsert({
    where: { slug: 'mats-and-rugs' },
    update: {},
    create: {
      name: 'Mats & Rugs',
      slug: 'mats-and-rugs',
      heroTitle: 'Mats & Rugs Wholesale',
      heroDescription: 'Commercial and residential mats and rugs for trade buyers.',
      intro: 'A comprehensive range of mats and rugs for retail, contract, and hospitality sectors.',
      status: 'published',
      sortOrder: 2,
    },
  });

  const decorCat = await prisma.category.upsert({
    where: { slug: 'decoration-and-seasonal' },
    update: {},
    create: {
      name: 'Decoration & Seasonal',
      slug: 'decoration-and-seasonal',
      heroTitle: 'Decoration & Seasonal Products',
      heroDescription: 'Seasonal and decorative products for wholesale buyers.',
      intro: 'Stock up on seasonal bestsellers and decorative lines with excellent margins.',
      status: 'published',
      sortOrder: 3,
    },
  });

  const gardenCat = await prisma.category.upsert({
    where: { slug: 'garden-and-outdoor' },
    update: {},
    create: {
      name: 'Garden & Outdoor',
      slug: 'garden-and-outdoor',
      heroTitle: 'Garden & Outdoor Wholesale',
      heroDescription: 'Garden products, screening, and outdoor accessories for trade.',
      intro: 'From bamboo fencing to artificial hedges, our garden range covers everything for trade buyers.',
      status: 'published',
      sortOrder: 4,
    },
  });

  const toysCat = await prisma.category.upsert({
    where: { slug: 'toys-and-games' },
    update: {},
    create: {
      name: 'Toys & Games',
      slug: 'toys-and-games',
      heroTitle: 'Toys & Games Wholesale',
      heroDescription: 'Wholesale toys and games at competitive trade prices.',
      intro: 'Fun, safe, and competitively priced toys and games for wholesale buyers.',
      status: 'published',
      sortOrder: 5,
    },
  });

  console.log('✅ Categories seeded');

  // ─── SUBCATEGORIES ───────────────────────────────────
  await prisma.subcategory.createMany({
    skipDuplicates: true,
    data: [
      { categoryId: kitchenCat.id, name: 'Cookware', slug: 'cookware', sortOrder: 1 },
      { categoryId: kitchenCat.id, name: 'Storage & Organisation', slug: 'storage-and-organisation', sortOrder: 2 },
      { categoryId: kitchenCat.id, name: 'Bakeware', slug: 'bakeware', sortOrder: 3 },
      { categoryId: matsRugsCat.id, name: 'Barrier Mats', slug: 'barrier-mats', sortOrder: 1 },
      { categoryId: matsRugsCat.id, name: 'Rugs', slug: 'rugs', sortOrder: 2 },
      { categoryId: matsRugsCat.id, name: 'Runner Rugs', slug: 'runner-rugs', sortOrder: 3 },
      { categoryId: decorCat.id, name: 'Candles & Wax', slug: 'candles-and-wax', sortOrder: 1 },
      { categoryId: decorCat.id, name: 'Christmas Decorations', slug: 'christmas-decorations', sortOrder: 2 },
      { categoryId: gardenCat.id, name: 'Fencing & Screening', slug: 'fencing-and-screening', sortOrder: 1 },
      { categoryId: gardenCat.id, name: 'Garden Canes & Stakes', slug: 'garden-canes-and-stakes', sortOrder: 2 },
      { categoryId: gardenCat.id, name: 'Garden Ornaments', slug: 'garden-ornaments', sortOrder: 3 },
      { categoryId: toysCat.id, name: 'Outdoor Play', slug: 'outdoor-play', sortOrder: 1 },
    ],
  });

  console.log('✅ Subcategories seeded');

  // ─── PRODUCT FAMILIES ────────────────────────────────
  const stockPot = await prisma.productFamily.upsert({
    where: { slug: 'stock-pots' },
    update: {},
    create: {
      categoryId: kitchenCat.id,
      name: 'Stock Pots',
      slug: 'stock-pots',
      summary: 'Heavy-duty stainless steel stock pots for professional and home use.',
      longDescription: 'Our range of stainless steel stock pots is designed for the demands of professional catering and bulk home cooking. Available in multiple sizes, each pot features a thick base for even heat distribution, riveted handles, and a tight-fitting lid.',
      features: [
        'Heavy-gauge stainless steel construction',
        'Encapsulated aluminium base for even heat distribution',
        'Riveted stay-cool handles',
        'Suitable for all hob types including induction',
        'Dishwasher safe',
      ],
      useCases: [
        'Restaurant and catering kitchen use',
        'Batch cooking for meal prep businesses',
        'Wholesale retail for kitchen stores',
        'Food service operations',
      ],
      gallery: ['/images/stock-pot-1.jpg', '/images/stock-pot-2.jpg', '/images/stock-pot-3.jpg'],
      specifications: [
        { key: 'Material', value: 'Stainless Steel 18/10' },
        { key: 'Base', value: 'Encapsulated aluminium' },
        { key: 'Hob Compatibility', value: 'All hobs including induction' },
        { key: 'Dishwasher Safe', value: 'Yes' },
        { key: 'Lid Included', value: 'Yes' },
      ],
      status: 'published',
      sortOrder: 1,
    },
  });

  const barrierMats = await prisma.productFamily.upsert({
    where: { slug: 'barrier-mats' },
    update: {},
    create: {
      categoryId: matsRugsCat.id,
      name: 'Barrier Mats',
      slug: 'barrier-mats',
      summary: 'Heavy-duty entrance barrier mats for commercial and residential use.',
      features: ['Scraper-coir surface removes dirt effectively', 'Heavy rubber backing prevents slipping', 'Available in multiple sizes', 'Suitable for indoor and covered outdoor use'],
      useCases: ['Commercial building entrances', 'Retail store fronts', 'Office lobbies', 'Hotels and hospitality'],
      gallery: ['/images/barrier-mat-1.jpg'],
      specifications: [{ key: 'Surface Material', value: 'Coir / Rubber' }, { key: 'Backing', value: 'Heavy rubber' }],
      status: 'published',
      sortOrder: 1,
    },
  });

  const shaggyRugs = await prisma.productFamily.upsert({
    where: { slug: 'shaggy-rugs' },
    update: {},
    create: {
      categoryId: matsRugsCat.id,
      name: 'Shaggy Rugs',
      slug: 'shaggy-rugs',
      summary: 'Soft, deep-pile shaggy rugs in assorted colours and sizes.',
      features: ['Deep pile for comfort underfoot', 'Stain-resistant fibres', 'Non-slip backing', 'Wide range of colours available'],
      useCases: ['Living rooms', 'Bedrooms', 'Home décor retail'],
      gallery: ['/images/shaggy-rug-1.jpg'],
      specifications: [{ key: 'Pile Height', value: '50mm' }, { key: 'Material', value: 'Polyester' }],
      status: 'published',
      sortOrder: 2,
    },
  });

  const waxBurners = await prisma.productFamily.upsert({
    where: { slug: 'wax-burners' },
    update: {},
    create: {
      categoryId: decorCat.id,
      name: 'Wax Burners',
      slug: 'wax-burners',
      summary: 'Ceramic and glass wax melt burners in seasonal and contemporary designs.',
      features: ['Elegant ceramic and glass designs', 'Unscented — compatible with all wax melts', 'Wide dish bowl for even wax pool', 'Gift-box packaging available'],
      useCases: ['Home fragrance retail', 'Gift shops', 'Spa and wellness boutiques'],
      gallery: ['/images/wax-burner-1.jpg'],
      specifications: [{ key: 'Material', value: 'Ceramic / Glass' }, { key: 'Dimensions', value: 'Various' }],
      status: 'published',
      sortOrder: 1,
    },
  });

  const bambooFence = await prisma.productFamily.upsert({
    where: { slug: 'bamboo-fence-screening' },
    update: {},
    create: {
      categoryId: gardenCat.id,
      name: 'Bamboo Fence Screening',
      slug: 'bamboo-fence-screening',
      summary: 'Natural bamboo roll fencing and screening for gardens and outdoor spaces.',
      features: ['Natural bamboo poles', 'UV-resistant wire binding', 'Easy to cut and install', 'Biodegradable and sustainable'],
      useCases: ['Garden privacy screening', 'Balcony and patio dividers', 'Retail display stands'],
      gallery: ['/images/bamboo-fence-1.jpg'],
      specifications: [{ key: 'Material', value: 'Natural bamboo' }, { key: 'Heights Available', value: '90cm, 120cm, 180cm' }],
      status: 'published',
      sortOrder: 1,
    },
  });

  const hulaHoops = await prisma.productFamily.upsert({
    where: { slug: 'hula-hoops' },
    update: {},
    create: {
      categoryId: toysCat.id,
      name: 'Hula Hoops',
      slug: 'hula-hoops',
      summary: 'Colourful plastic hula hoops in assorted sizes for children and adults.',
      features: ['Lightweight durable plastic', 'Bright assorted colours', 'Available in junior and adult sizes', 'Ideal for PE and outdoor play'],
      useCases: ['Toy retail', 'Sports and leisure shops', 'School PE equipment suppliers'],
      gallery: ['/images/hula-hoop-1.jpg'],
      specifications: [{ key: 'Material', value: 'HDPE plastic' }, { key: 'Sizes', value: '60cm, 75cm, 90cm' }],
      status: 'published',
      sortOrder: 1,
    },
  });

  // More product families
  const chindiBrugRugs = await prisma.productFamily.upsert({
    where: { slug: 'chindi-rag-rugs' },
    update: {},
    create: {
      categoryId: matsRugsCat.id,
      name: 'Chindi Rag Rugs',
      slug: 'chindi-rag-rugs',
      summary: 'Handwoven cotton chindi rugs — colourful, eco-friendly, and great value.',
      features: ['Handwoven recycled cotton', 'Vibrant multicolour designs', 'Flat weave — easy to clean', 'Eco-friendly production'],
      useCases: ['Ethical home goods retail', 'Boho and eclectic interiors', 'Market stalls and gift shops'],
      gallery: ['/images/chindi-rug-1.jpg'],
      specifications: [{ key: 'Material', value: 'Recycled cotton' }, { key: 'Construction', value: 'Handwoven flat weave' }],
      status: 'published',
      sortOrder: 3,
    },
  });

  const hallwayRunners = await prisma.productFamily.upsert({
    where: { slug: 'hallway-runner-rugs' },
    update: {},
    create: {
      categoryId: matsRugsCat.id,
      name: 'Hallway Runner Rugs',
      slug: 'hallway-runner-rugs',
      summary: 'Long hallway runners in classic and contemporary designs.',
      features: ['Non-slip backing', 'Durable woven construction', 'Available in 60cm × 200cm and 80cm × 300cm', 'Machine washable'],
      useCases: ['Hallways and corridors', 'Kitchen runners', 'Hotel room corridors'],
      gallery: ['/images/hallway-runner-1.jpg'],
      specifications: [{ key: 'Material', value: 'Polypropylene' }, { key: 'Backing', value: 'Non-slip latex' }],
      status: 'published',
      sortOrder: 4,
    },
  });

  const christmasBridges = await prisma.productFamily.upsert({
    where: { slug: 'christmas-candle-bridges' },
    update: {},
    create: {
      categoryId: decorCat.id,
      name: 'Christmas Candle Bridges',
      slug: 'christmas-candle-bridges',
      summary: 'Traditional wooden Advent candle bridges with LED lighting.',
      features: ['Natural wood construction', 'Warm white LED candles', 'Battery operated', 'Scandinavian style'],
      useCases: ['Christmas gift retail', 'Home décor seasonal lines', 'Garden centre seasonal displays'],
      gallery: ['/images/candle-bridge-1.jpg'],
      specifications: [{ key: 'Material', value: 'Natural pine' }, { key: 'Lighting', value: 'Warm white LED' }],
      status: 'published',
      sortOrder: 2,
    },
  });

  const artificialTrees = await prisma.productFamily.upsert({
    where: { slug: 'artificial-christmas-trees' },
    update: {},
    create: {
      categoryId: decorCat.id,
      name: 'Artificial Christmas Trees',
      slug: 'artificial-christmas-trees',
      summary: 'Full, lush artificial Christmas trees in traditional and snow-tipped styles.',
      features: ['Fire retardant PVC tips', 'Metal hinged branch system', 'Foldable for easy storage', 'Available 4ft to 7ft'],
      useCases: ['Seasonal retail', 'Garden centres', 'Online gift stores'],
      gallery: ['/images/artificial-tree-1.jpg'],
      specifications: [{ key: 'Material', value: 'PVC / PE mix' }, { key: 'Frame', value: 'Steel with hinged branches' }],
      status: 'published',
      sortOrder: 3,
    },
  });

  const pencilTrees = await prisma.productFamily.upsert({
    where: { slug: 'pencil-slim-christmas-trees' },
    update: {},
    create: {
      categoryId: decorCat.id,
      name: 'Pencil Slim Christmas Trees',
      slug: 'pencil-slim-christmas-trees',
      summary: 'Space-saving slim pencil Christmas trees — perfect for hallways and small spaces.',
      features: ['Ultra-slim profile', 'Sturdy metal base', 'Pre-shaped branches for easy setup', 'Available 5ft and 6ft'],
      useCases: ['Apartment and small space retail', 'Office decoration', 'Hotels and commercial properties'],
      gallery: ['/images/pencil-tree-1.jpg'],
      specifications: [{ key: 'Material', value: 'PVC' }, { key: 'Base', value: 'Weighted metal base' }],
      status: 'published',
      sortOrder: 4,
    },
  });

  const bambooCanes = await prisma.productFamily.upsert({
    where: { slug: 'bamboo-canes' },
    update: {},
    create: {
      categoryId: gardenCat.id,
      name: 'Bamboo Canes',
      slug: 'bamboo-canes',
      summary: 'Natural bamboo garden canes for plant support and training.',
      features: ['Natural bamboo — sustainably sourced', 'Multiple lengths: 60cm to 180cm', 'Sold in bundle packs', 'Lightweight and strong'],
      useCases: ['Garden centres', 'DIY retail', 'Horticultural suppliers'],
      gallery: ['/images/bamboo-cane-1.jpg'],
      specifications: [{ key: 'Material', value: 'Natural bamboo' }, { key: 'Lengths', value: '60cm, 90cm, 120cm, 150cm, 180cm' }],
      status: 'published',
      sortOrder: 2,
    },
  });

  const greenGardenSticks = await prisma.productFamily.upsert({
    where: { slug: 'green-garden-sticks' },
    update: {},
    create: {
      categoryId: gardenCat.id,
      name: 'Green Garden Sticks',
      slug: 'green-garden-sticks',
      summary: 'Coated green garden sticks for neat, discreet plant support.',
      features: ['PVC-coated steel for durability', 'Blends in with foliage', 'Rust-resistant coating', 'Bundle packs of 20'],
      useCases: ['Floristry suppliers', 'Garden centres', 'Plant nurseries'],
      gallery: ['/images/green-stick-1.jpg'],
      specifications: [{ key: 'Material', value: 'PVC-coated steel' }, { key: 'Lengths', value: '30cm, 45cm, 60cm' }],
      status: 'published',
      sortOrder: 3,
    },
  });

  const woodenStakes = await prisma.productFamily.upsert({
    where: { slug: 'wooden-garden-stakes' },
    update: {},
    create: {
      categoryId: gardenCat.id,
      name: 'Wooden Garden Stakes',
      slug: 'wooden-garden-stakes',
      summary: 'Pointed wooden stakes for plant support, fencing, and garden marking.',
      features: ['Pressure-treated pine', 'Pointed for easy insertion', 'Multiple heights available', 'Natural and untreated options'],
      useCases: ['Tree staking', 'Temporary fencing', 'Garden centres and farm shops'],
      gallery: ['/images/wooden-stake-1.jpg'],
      specifications: [{ key: 'Material', value: 'Pine' }, { key: 'Treatment', value: 'Pressure treated / untreated' }],
      status: 'published',
      sortOrder: 4,
    },
  });

  const artificialHedge = await prisma.productFamily.upsert({
    where: { slug: 'artificial-hedge-screening' },
    update: {},
    create: {
      categoryId: gardenCat.id,
      name: 'Artificial Hedge Screening',
      slug: 'artificial-hedge-screening',
      summary: 'Realistic artificial hedge panels for instant garden privacy.',
      features: ['UV-stabilised for outdoor use', 'Realistic leaf texture', 'Easy clip installation', 'Low maintenance — no watering required'],
      useCases: ['Garden privacy panels', 'Balcony screening', 'Event and exhibition backdrops'],
      gallery: ['/images/artificial-hedge-1.jpg'],
      specifications: [{ key: 'Material', value: 'UV-stabilised polyethylene' }, { key: 'Panel Size', value: '100cm × 100cm' }],
      status: 'published',
      sortOrder: 5,
    },
  });

  const gazingBalls = await prisma.productFamily.upsert({
    where: { slug: 'gazing-balls' },
    update: {},
    create: {
      categoryId: gardenCat.id,
      name: 'Gazing Balls',
      slug: 'gazing-balls',
      summary: 'Mirrored gazing balls for garden decoration — eye-catching and weatherproof.',
      features: ['High-gloss mirrored surface', 'UV and weather resistant', 'Lightweight hollow construction', 'Available in multiple colours'],
      useCases: ['Garden centres', 'Home décor retail', 'Outdoor living sections'],
      gallery: ['/images/gazing-ball-1.jpg'],
      specifications: [{ key: 'Material', value: 'Stainless steel / plastic mirror' }, { key: 'Sizes', value: '15cm, 20cm, 30cm' }],
      status: 'published',
      sortOrder: 6,
    },
  });

  console.log('✅ Product families seeded');

  // ─── PRODUCT VARIANTS ────────────────────────────────
  await prisma.productVariant.createMany({
    skipDuplicates: true,
    data: [
      { productFamilyId: stockPot.id, name: '10 Litre', sku: 'SP-10L', sortOrder: 1, specs: { capacity: '10L', diameter: '28cm', height: '22cm' } },
      { productFamilyId: stockPot.id, name: '15 Litre', sku: 'SP-15L', sortOrder: 2, specs: { capacity: '15L', diameter: '30cm', height: '27cm' } },
      { productFamilyId: stockPot.id, name: '20 Litre', sku: 'SP-20L', sortOrder: 3, specs: { capacity: '20L', diameter: '32cm', height: '32cm' } },
      { productFamilyId: stockPot.id, name: '30 Litre', sku: 'SP-30L', sortOrder: 4, specs: { capacity: '30L', diameter: '36cm', height: '38cm' } },
      { productFamilyId: barrierMats.id, name: '45×75cm Brown', sku: 'BM-4575-BR', sortOrder: 1 },
      { productFamilyId: barrierMats.id, name: '60×90cm Brown', sku: 'BM-6090-BR', sortOrder: 2 },
      { productFamilyId: barrierMats.id, name: '90×150cm Brown', sku: 'BM-90150-BR', sortOrder: 3 },
      { productFamilyId: shaggyRugs.id, name: 'Grey 80×150cm', sku: 'SR-80150-GY', sortOrder: 1 },
      { productFamilyId: shaggyRugs.id, name: 'Cream 80×150cm', sku: 'SR-80150-CR', sortOrder: 2 },
      { productFamilyId: shaggyRugs.id, name: 'Charcoal 120×170cm', sku: 'SR-120170-CH', sortOrder: 3 },
      { productFamilyId: hulaHoops.id, name: '60cm Assorted', sku: 'HH-60-ASST', sortOrder: 1 },
      { productFamilyId: hulaHoops.id, name: '75cm Assorted', sku: 'HH-75-ASST', sortOrder: 2 },
      { productFamilyId: hulaHoops.id, name: '90cm Assorted', sku: 'HH-90-ASST', sortOrder: 3 },
    ],
  });

  console.log('✅ Variants seeded');

  // ─── PRICE LIST ITEMS ────────────────────────────────
  await prisma.priceListItem.createMany({
    skipDuplicates: true,
    data: [
      { productFamilyId: stockPot.id, moq: 6, unitPrice: 18.50, bulkTiers: [{ minQty: 12, pricePerUnit: 16.75, label: 'Case of 12' }, { minQty: 24, pricePerUnit: 15.50, label: 'Pallet qty' }], stockStatus: 'In Stock' },
      { productFamilyId: barrierMats.id, moq: 10, unitPrice: 7.25, bulkTiers: [{ minQty: 25, pricePerUnit: 6.50, label: '25+' }], stockStatus: 'In Stock' },
      { productFamilyId: shaggyRugs.id, moq: 5, unitPrice: 14.99, bulkTiers: [{ minQty: 20, pricePerUnit: 12.50, label: '20+' }], stockStatus: 'In Stock' },
      { productFamilyId: waxBurners.id, moq: 12, unitPrice: 4.95, bulkTiers: [{ minQty: 48, pricePerUnit: 4.25, label: 'Box of 48' }], stockStatus: 'In Stock' },
      { productFamilyId: bambooFence.id, moq: 10, unitPrice: 9.99, bulkTiers: [{ minQty: 50, pricePerUnit: 8.75, label: '50+' }], stockStatus: 'Low Stock' },
      { productFamilyId: hulaHoops.id, moq: 24, unitPrice: 1.75, bulkTiers: [{ minQty: 100, pricePerUnit: 1.50, label: '100+' }], stockStatus: 'In Stock' },
    ],
  });

  // ─── MOQ RULES ───────────────────────────────────────
  await prisma.mOQRule.createMany({
    skipDuplicates: true,
    data: [
      { categoryId: kitchenCat.id, minQuantity: 6, unit: 'units', notes: 'Standard kitchen range MOQ' },
      { categoryId: matsRugsCat.id, minQuantity: 5, unit: 'units', notes: 'Mats and rugs MOQ' },
      { categoryId: gardenCat.id, minQuantity: 10, unit: 'units', notes: 'Garden products MOQ' },
      { categoryId: toysCat.id, minQuantity: 24, unit: 'units', notes: 'Toys MOQ — outer box quantity' },
    ],
  });

  // ─── BULK DISCOUNT TIERS ─────────────────────────────
  await prisma.bulkDiscountTier.createMany({
    skipDuplicates: true,
    data: [
      { tierName: 'Bronze', minQty: 1, maxQty: 99, discountPercent: 0 },
      { tierName: 'Silver', minQty: 100, maxQty: 499, discountPercent: 5 },
      { tierName: 'Gold', minQty: 500, maxQty: 999, discountPercent: 10 },
      { tierName: 'Platinum', minQty: 1000, discountPercent: 15 },
    ],
  });

  console.log('✅ Pricing seeded');

  // ─── ORDERS ──────────────────────────────────────────
  const order1 = await prisma.order.upsert({
    where: { orderNumber: 'HTZ-2024-0001' },
    update: {},
    create: {
      orderNumber: 'HTZ-2024-0001',
      userId: wholesaleUser.id,
      status: OrderStatus.DELIVERED,
      subtotal: 222.00,
      shippingCost: 15.00,
      total: 237.00,
      shippingAddress: { name: 'James Henderson', company: 'TradeCo Ltd', line1: '45 Commerce Street', city: 'Manchester', postcode: 'M1 2AB', country: 'UK' },
      items: {
        create: [
          { productFamilyId: stockPot.id, productName: 'Stock Pots 10L', sku: 'SP-10L', quantity: 12, unitPrice: 18.50, lineTotal: 222.00 },
        ],
      },
      timeline: {
        create: [
          { status: 'NEW', note: 'Order placed', date: new Date('2024-10-01T09:00:00Z') },
          { status: 'PROCESSING', note: 'Order confirmed', date: new Date('2024-10-01T11:00:00Z') },
          { status: 'PACKED', note: 'Packed and ready', date: new Date('2024-10-02T09:00:00Z') },
          { status: 'SHIPPED', note: 'Dispatched via DPD', date: new Date('2024-10-02T14:00:00Z') },
          { status: 'DELIVERED', note: 'Delivered', date: new Date('2024-10-04T10:30:00Z') },
        ],
      },
      tracking: {
        create: {
          carrier: 'DPD',
          trackingNumber: 'DPD1234567890',
          trackingUrl: 'https://tracking.dpd.co.uk/parcels/DPD1234567890',
          estimatedDelivery: new Date('2024-10-04'),
        },
      },
      invoice: {
        create: {
          invoiceNumber: 'INV-2024-0001',
          amount: 237.00,
          status: 'paid',
          dueDate: new Date('2024-10-31'),
          paidDate: new Date('2024-10-15'),
        },
      },
    },
  });

  const order2 = await prisma.order.upsert({
    where: { orderNumber: 'HTZ-2024-0002' },
    update: {},
    create: {
      orderNumber: 'HTZ-2024-0002',
      userId: wholesaleUser.id,
      status: OrderStatus.SHIPPED,
      subtotal: 149.75,
      shippingCost: 12.00,
      total: 161.75,
      shippingAddress: { name: 'James Henderson', company: 'TradeCo Ltd', line1: '45 Commerce Street', city: 'Manchester', postcode: 'M1 2AB', country: 'UK' },
      items: {
        create: [
          { productFamilyId: barrierMats.id, productName: 'Barrier Mats 60×90cm', sku: 'BM-6090-BR', quantity: 20, unitPrice: 7.25, lineTotal: 145.00 },
          { productFamilyId: hulaHoops.id, productName: 'Hula Hoops 60cm', sku: 'HH-60-ASST', quantity: 24, unitPrice: 1.75, lineTotal: 42.00 },
        ],
      },
      timeline: {
        create: [
          { status: 'NEW', note: 'Order placed', date: new Date('2024-11-05T10:00:00Z') },
          { status: 'PROCESSING', note: 'Order confirmed', date: new Date('2024-11-05T14:00:00Z') },
          { status: 'SHIPPED', note: 'Dispatched via Royal Mail', date: new Date('2024-11-06T09:00:00Z') },
        ],
      },
      tracking: {
        create: {
          carrier: 'Royal Mail',
          trackingNumber: 'RM9876543210GB',
          trackingUrl: 'https://www.royalmail.com/track-your-item#/tracking-results/RM9876543210GB',
          estimatedDelivery: new Date('2024-11-08'),
        },
      },
      invoice: {
        create: {
          invoiceNumber: 'INV-2024-0002',
          amount: 161.75,
          status: 'pending',
          dueDate: new Date('2024-12-05'),
        },
      },
    },
  });

  const order3 = await prisma.order.upsert({
    where: { orderNumber: 'HTZ-2024-0003' },
    update: {},
    create: {
      orderNumber: 'HTZ-2024-0003',
      userId: wholesaleUser.id,
      status: OrderStatus.PROCESSING,
      subtotal: 89.50,
      shippingCost: 9.99,
      total: 99.49,
      shippingAddress: { name: 'James Henderson', company: 'TradeCo Ltd', line1: '45 Commerce Street', city: 'Manchester', postcode: 'M1 2AB', country: 'UK' },
      items: {
        create: [
          { productFamilyId: waxBurners.id, productName: 'Wax Burners Ceramic', sku: 'WB-CER-ASST', quantity: 24, unitPrice: 4.95, lineTotal: 118.80 },
        ],
      },
      timeline: {
        create: [
          { status: 'NEW', note: 'Order placed', date: new Date('2024-11-20T08:00:00Z') },
          { status: 'PROCESSING', note: 'In warehouse', date: new Date('2024-11-20T12:00:00Z') },
        ],
      },
      invoice: {
        create: {
          invoiceNumber: 'INV-2024-0003',
          amount: 99.49,
          status: 'pending',
          dueDate: new Date('2024-12-20'),
        },
      },
    },
  });

  // Additional orders for variety
  await prisma.order.upsert({
    where: { orderNumber: 'HTZ-2024-0004' },
    update: {},
    create: {
      orderNumber: 'HTZ-2024-0004',
      userId: dropshipUser.id,
      status: OrderStatus.NEW,
      subtotal: 35.00,
      shippingCost: 5.99,
      total: 40.99,
      shippingAddress: { name: 'Customer Name', company: '', line1: '1 High Street', city: 'London', postcode: 'SW1A 1AA', country: 'UK' },
      items: {
        create: [
          { productFamilyId: hulaHoops.id, productName: 'Hula Hoops 75cm', sku: 'HH-75-ASST', quantity: 20, unitPrice: 1.75, lineTotal: 35.00 },
        ],
      },
      timeline: {
        create: [{ status: 'NEW', note: 'Order received', date: new Date('2024-11-22T16:00:00Z') }],
      },
      invoice: {
        create: {
          invoiceNumber: 'INV-2024-0004',
          amount: 40.99,
          status: 'pending',
          dueDate: new Date('2024-12-22'),
        },
      },
    },
  });

  console.log('✅ Orders seeded');

  // ─── RETURNS ─────────────────────────────────────────
  await prisma.returnRequest.upsert({
    where: { returnNumber: 'RET-2024-0001' },
    update: {},
    create: {
      returnNumber: 'RET-2024-0001',
      orderId: order1.id,
      partnerName: 'TradeCo Ltd',
      reason: 'DAMAGED',
      description: '2 units arrived with dented lids. Outer packaging was intact.',
      status: 'RESOLVED',
      resolutionType: 'REPLACEMENT',
      resolutionNotes: 'Replacement units dispatched on HTZ-2024-REP-001.',
      resolvedAt: new Date('2024-10-10'),
      notes: {
        create: [
          { authorName: 'Support Team', body: 'Investigated — confirmed damage on arrival. Replacement approved.' },
        ],
      },
    },
  });

  console.log('✅ Returns seeded');

  // ─── SUPPORT TICKETS ─────────────────────────────────
  const ticket1 = await prisma.supportTicket.upsert({
    where: { ticketNumber: 'TKT-2024-0001' },
    update: {},
    create: {
      ticketNumber: 'TKT-2024-0001',
      userId: wholesaleUser.id,
      subject: 'Missing item from order HTZ-2024-0002',
      category: 'Order Issue',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      relatedOrderId: order2.id,
      assignedTo: adminUser.id,
      messages: {
        create: [
          { author: 'partner', authorName: 'James Henderson', body: 'Hi, my order HTZ-2024-0002 arrived but was missing 5 hula hoops. Please advise.' },
          { author: 'support', authorName: 'HOMATZ Support', body: 'Thank you for letting us know. We are investigating this with our warehouse team and will respond within 24 hours.' },
        ],
      },
      internalNotes: {
        create: [
          { authorName: 'Warehouse Manager', body: 'Picking error confirmed. Short-picked by 5 units. Arrange dispatch ASAP.' },
        ],
      },
    },
  });

  await prisma.supportTicket.upsert({
    where: { ticketNumber: 'TKT-2024-0002' },
    update: {},
    create: {
      ticketNumber: 'TKT-2024-0002',
      userId: wholesaleUser.id,
      subject: 'Request for updated price list Q4 2024',
      category: 'Product Query',
      status: 'RESOLVED',
      priority: 'NORMAL',
      messages: {
        create: [
          { author: 'partner', authorName: 'James Henderson', body: 'Could you send the latest wholesale price list for Q4 2024?' },
          { author: 'support', authorName: 'HOMATZ Support', body: 'The updated Q4 2024 price list is now available in your account under Price List. Please let us know if you have questions.' },
        ],
      },
    },
  });

  await prisma.supportTicket.upsert({
    where: { ticketNumber: 'TKT-2024-0003' },
    update: {},
    create: {
      ticketNumber: 'TKT-2024-0003',
      userId: dropshipUser.id,
      subject: 'Balance top-up not reflected',
      category: 'Billing',
      status: 'OPEN',
      priority: 'URGENT',
      messages: {
        create: [
          { author: 'partner', authorName: 'Sarah Patel', body: 'I transferred £200 two days ago as a top-up but my balance has not been updated. Reference: TOPUP-2024-NOV.' },
        ],
      },
    },
  });

  console.log('✅ Support tickets seeded');

  // ─── DROPSHIP TRANSACTIONS ───────────────────────────
  await prisma.transaction.createMany({
    skipDuplicates: true,
    data: [
      { userId: dropshipUser.id, type: 'top-up', reference: 'TOPUP-2024-001', description: 'Bank transfer top-up', amount: 500.00, runningBalance: 500.00, createdAt: new Date('2024-10-01') },
      { userId: dropshipUser.id, type: 'order', reference: 'HTZ-2024-DS001', description: 'Order payment — 10× Hula Hoops', amount: -52.50, runningBalance: 447.50, createdAt: new Date('2024-10-05') },
      { userId: dropshipUser.id, type: 'order', reference: 'HTZ-2024-DS002', description: 'Order payment — 5× Shaggy Rugs', amount: -74.95, runningBalance: 372.55, createdAt: new Date('2024-10-15') },
      { userId: dropshipUser.id, type: 'refund', reference: 'REF-2024-001', description: 'Refund — damaged item return', amount: 14.99, runningBalance: 387.54, createdAt: new Date('2024-10-20') },
      { userId: dropshipUser.id, type: 'top-up', reference: 'TOPUP-2024-002', description: 'Bank transfer top-up', amount: 200.00, runningBalance: 587.54, createdAt: new Date('2024-11-01') },
      { userId: dropshipUser.id, type: 'order', reference: 'HTZ-2024-DS003', description: 'Order payment — 24× Wax Burners', amount: -118.80, runningBalance: 468.74, createdAt: new Date('2024-11-10') },
      { userId: dropshipUser.id, type: 'order', reference: 'HTZ-2024-DS004', description: 'Order payment — Barrier Mats', amount: -72.50, runningBalance: 396.24, createdAt: new Date('2024-11-15') },
      { userId: dropshipUser.id, type: 'adjustment', reference: 'ADJ-2024-001', description: 'Credit adjustment — overcharge correction', amount: 53.74, runningBalance: 449.98, createdAt: new Date('2024-11-18') },
      { userId: dropshipUser.id, type: 'order', reference: 'HTZ-2024-DS005', description: 'Order payment', amount: -40.99, runningBalance: 408.99, createdAt: new Date('2024-11-22') },
      { userId: dropshipUser.id, type: 'order', reference: 'HTZ-2024-DS006', description: 'Order payment', amount: -66.49, runningBalance: 342.50, createdAt: new Date('2024-11-25') },
    ],
  });

  console.log('✅ Transactions seeded');

  // ─── FAQ ITEMS ───────────────────────────────────────
  await prisma.fAQItem.createMany({
    skipDuplicates: true,
    data: [
      { question: 'How do I apply for a wholesale account?', answer: 'Click "Apply for Trade Access" on our homepage and complete the wholesale application form. Applications are reviewed within 2–3 business days.', category: 'Getting Started', sortOrder: 1 },
      { question: 'What is the difference between wholesale and dropship accounts?', answer: 'Wholesale accounts purchase stock in bulk and hold inventory. Dropship accounts order per sale and we fulfil directly to their customers.', category: 'Getting Started', sortOrder: 2 },
      { question: 'What are the minimum order quantities (MOQ)?', answer: 'MOQs vary by category. Generally: Kitchen 6 units, Mats & Rugs 5 units, Garden 10 units, Toys 24 units. Full MOQ list is available in your account.', category: 'Ordering', sortOrder: 3 },
      { question: 'How long does delivery take?', answer: 'In-stock items are dispatched within 2 business days. Standard UK delivery is 3–5 days. Express options are available.', category: 'Delivery', sortOrder: 4 },
      { question: 'Can I return items?', answer: 'Yes. Items can be returned within 30 days if they arrive damaged or faulty. Please raise a return request through your account portal.', category: 'Returns', sortOrder: 5 },
      { question: 'How do I top up my dropship balance?', answer: 'Go to Dashboard → Dropship → Top Up Funds. Bank transfer and card options are available.', category: 'Dropship', sortOrder: 6 },
      { question: 'Can I download a price list?', answer: 'Yes. Approved partners can download a full price list as CSV or PDF from Dashboard → Price List.', category: 'Ordering', sortOrder: 7 },
    ],
  });

  // ─── CONTENT PAGES ───────────────────────────────────
  await prisma.contentPage.createMany({
    skipDuplicates: true,
    data: [
      {
        title: 'About HOMATZ',
        slug: 'about',
        body: '<h2>Who We Are</h2><p>HOMATZ is a UK-based wholesale and dropshipping platform specialising in kitchen, household, garden, and seasonal products. We connect manufacturers and importers directly with retail buyers, distributors, and online sellers.</p><h2>Our Mission</h2><p>We believe trade buying should be simple, transparent, and efficient. Our platform removes barriers between quality products and the businesses that sell them.</p>',
        status: 'published',
      },
      {
        title: 'How It Works',
        slug: 'how-it-works',
        body: '<h2>Getting Started</h2><ol><li><strong>Apply</strong> — Submit a trade application (wholesale or dropship).</li><li><strong>Get Approved</strong> — Applications reviewed within 2–3 business days.</li><li><strong>Browse & Order</strong> — Access full product catalogue and pricing.</li><li><strong>We Fulfil</strong> — We dispatch from our warehouse directly.</li></ol>',
        status: 'published',
      },
      {
        title: 'Privacy Policy',
        slug: 'privacy-policy',
        body: '<h2>Privacy Policy</h2><p>Last updated: January 2024</p><p>HOMATZ takes your privacy seriously. This policy explains how we collect, use, and protect your personal data in accordance with the UK GDPR.</p>',
        status: 'published',
      },
      {
        title: 'Terms & Conditions',
        slug: 'terms',
        body: '<h2>Terms & Conditions</h2><p>Last updated: January 2024</p><p>These terms govern your use of the HOMATZ B2B platform and all purchases made through it.</p>',
        status: 'published',
      },
      {
        title: 'Shipping Information',
        slug: 'shipping',
        body: '<h2>Shipping</h2><p>We dispatch all in-stock orders within 2 business days. Standard UK delivery 3–5 days. Express 1–2 day options available at checkout.</p>',
        status: 'published',
      },
      {
        title: 'Returns Policy',
        slug: 'returns',
        body: '<h2>Returns</h2><p>We accept returns within 30 days for damaged or faulty items. Raise a return request through your partner dashboard.</p>',
        status: 'published',
      },
    ],
  });

  console.log('✅ FAQ and content pages seeded');

  // ─── VENDORS ─────────────────────────────────────────
  const vendor1 = await prisma.vendor.upsert({
    where: { id: 'vendor-eastern-imports' },
    update: {},
    create: {
      id: 'vendor-eastern-imports',
      name: 'Eastern Imports Ltd',
      contactEmail: 'orders@easternimports.co.uk',
      contactPhone: '020 7123 4567',
      address: 'Unit 5, Warehouse Park, Birmingham B12 0PQ',
      notes: 'Primary supplier for kitchen and garden ranges. Lead time 4–6 weeks ex-warehouse.',
      status: 'active',
    },
  });

  const vendor2 = await prisma.vendor.upsert({
    where: { id: 'vendor-euro-textile' },
    update: {},
    create: {
      id: 'vendor-euro-textile',
      name: 'Euro Textile Co',
      contactEmail: 'trade@eurotextile.com',
      contactPhone: '+44 161 234 5678',
      address: 'Mill Lane Industrial Estate, Bradford BD1 4DQ',
      notes: 'Supplier for mats, rugs, and soft furnishings. MOQ 100 units per SKU.',
      status: 'active',
    },
  });

  await prisma.vendorProductMapping.createMany({
    skipDuplicates: true,
    data: [
      { vendorId: vendor1.id, productFamilyId: stockPot.id },
      { vendorId: vendor1.id, productFamilyId: waxBurners.id },
      { vendorId: vendor1.id, productFamilyId: bambooFence.id },
      { vendorId: vendor1.id, productFamilyId: hulaHoops.id },
      { vendorId: vendor2.id, productFamilyId: barrierMats.id },
      { vendorId: vendor2.id, productFamilyId: shaggyRugs.id },
      { vendorId: vendor2.id, productFamilyId: chindiBrugRugs.id },
      { vendorId: vendor2.id, productFamilyId: hallwayRunners.id },
    ],
  });

  console.log('✅ Vendors seeded');

  // ─── ACTIVITY LOG ────────────────────────────────────
  await prisma.activityLog.createMany({
    skipDuplicates: true,
    data: [
      { userId: adminUser.id, userName: 'Admin', actionType: 'APPROVAL', description: 'Approved wholesale application for TradeCo Ltd', entityType: 'Partner', entityId: wholesaleUser.id, createdAt: new Date('2024-01-15') },
      { userId: adminUser.id, userName: 'Admin', actionType: 'APPROVAL', description: 'Approved dropship application for DropStore UK', entityType: 'Partner', entityId: dropshipUser.id, createdAt: new Date('2024-02-20') },
      { userId: adminUser.id, userName: 'Admin', actionType: 'ORDER_UPDATE', description: 'Marked order HTZ-2024-0001 as DELIVERED', entityType: 'Order', entityId: order1.id, createdAt: new Date('2024-10-04') },
      { userId: adminUser.id, userName: 'Admin', actionType: 'CONTENT_EDIT', description: 'Updated FAQ item: MOQ information', entityType: 'FAQ', createdAt: new Date('2024-11-01') },
      { userId: adminUser.id, userName: 'Admin', actionType: 'PRICING_CHANGE', description: 'Updated bulk pricing tiers for Stock Pots', entityType: 'Product', entityId: stockPot.id, createdAt: new Date('2024-11-15') },
      { userId: adminUser.id, userName: 'Admin', actionType: 'RETURN', description: 'Resolved return RET-2024-0001 with replacement', entityType: 'Return', createdAt: new Date('2024-10-10') },
    ],
  });

  console.log('✅ Activity log seeded');

  // ─── PRICING RULES ───────────────────────────────────
  await prisma.pricingRule.createMany({
    skipDuplicates: true,
    data: [
      { categoryId: kitchenCat.id, visibleToWholesale: true, visibleToDropship: true },
      { categoryId: matsRugsCat.id, visibleToWholesale: true, visibleToDropship: true },
      { categoryId: decorCat.id, visibleToWholesale: true, visibleToDropship: true },
      { categoryId: gardenCat.id, visibleToWholesale: true, visibleToDropship: false },
      { categoryId: toysCat.id, visibleToWholesale: true, visibleToDropship: true },
    ],
  });

  console.log('✅ Pricing rules seeded');

  console.log('\n🎉 Database seeding complete!');
  console.log('\nTest users:');
  console.log('  Admin:      admin@homatz.com       / admin123');
  console.log('  Wholesale:  buyer@tradeco.com       / test123');
  console.log('  Dropship:   seller@dropstore.co.uk  / test123');
  console.log('  Pending:    newbiz@startup.com       / test123');
  console.log('  Rejected:   rejected@example.com    / test123');

  // suppress unused variable warnings
  void ticket1;
  void order3;
  void pendingUser;
  void rejectedUser;
  void christmasBridges;
  void artificialTrees;
  void pencilTrees;
  void bambooCanes;
  void greenGardenSticks;
  void woodenStakes;
  void artificialHedge;
  void gazingBalls;
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
