import type { ProductFamilyContent } from "../lib/content-types";

export const productFamilies: ProductFamilyContent[] = [
  {
    slug: "barrier-mats",
    categorySlug: "mats-rugs",
    name: "Barrier Mats",
    description:
      "Heavy-duty indoor-outdoor mats built for entrances, staircases, offices, and commercial spaces.",
    summary:
      "A practical floor mat range focused on dirt trapping, absorbency, non-slip use, and everyday durability across home and commercial environments.",
    gallery: [
      { src: "/images/mats/barrier-mats-1.jpg", alt: "Barrier mat main view" },
      {
        src: "/images/mats/barrier-mats-2.jpg",
        alt: "Barrier mat lifestyle view",
      },
      {
        src: "/images/mats/barrier-mats-3.jpg",
        alt: "Barrier mat feature panel",
      },
    ],
    features: [
      "Heavy duty construction",
      "Rubber non-slip backing",
      "Absorbent dirt trapper surface",
      "Indoor and outdoor suitability",
      "Water absorbent performance",
      "Easy to clean with vacuum cleaner",
      "Available in different sizes and colours",
    ],
    useCases: [
      "Home entrances",
      "Offices",
      "Staircases",
      "Commercial spaces",
      "Doorways",
      "Entry transition areas",
    ],
    variants: [
      { title: "Charcoal Barrier Mat" },
      { title: "Grey Barrier Mat" },
      { title: "Blue Barrier Mat" },
      { title: "Red/Brown Variant Barrier Mat" },
    ],
    specifications: [
      {
        variant: "Barrier Mats",
        size: "Multiple sizes",
        material: "Rubber backing / textile surface",
        useCase: "Entrance and floor protection",
        finish: "Multiple colours",
      },
    ],
    relatedProducts: [
      { title: "Hallway Runner Rugs", href: "/products/hallway-runner-rugs" },
      { title: "Shaggy Rugs", href: "/products/shaggy-rugs" },
      { title: "Chindi Rag Rugs", href: "/products/chindi-rag-rugs" },
    ],
    relatedCategories: [
      { title: "Mats & Rugs", href: "/categories/mats-rugs" },
      {
        title: "Kitchen & Household",
        href: "/categories/kitchen-household",
      },
      {
        title: "Decoration & Seasonal",
        href: "/categories/decoration-seasonal",
      },
    ],
    support: {
      title: "Have a Product Question?",
      description:
        "Need help with size selection, colour options, or bulk requirements? Our B2B support team can help.",
      ctas: [
        { label: "Contact Support", variant: "primary" },
        { label: "Request Quote", variant: "outline" },
      ],
    },
  },
  {
    slug: "shaggy-rugs",
    categorySlug: "mats-rugs",
    name: "Shaggy Rugs",
    description:
      "Soft high-pile rugs for living rooms, bedrooms, kids rooms, and hallways.",
    summary:
      "A comfort-led area rug range with plush texture, non-slip support, and soft-touch appeal for family-oriented interiors.",
    gallery: [
      { src: "/images/mats/shaggy-rug-1.jpg", alt: "Shaggy rug main view" },
      { src: "/images/mats/shaggy-rug-2.jpg", alt: "Shaggy rug lifestyle" },
      { src: "/images/mats/shaggy-rug-3.jpg", alt: "Shaggy rug detail" },
    ],
    features: [
      "Soft high quality surface",
      "Memory foam comfort",
      "Non-slip backing",
      "No shedding design",
      "High pile thickness",
      "Easy to clean",
      "Suitable for bedroom, living room, kids room, and hallway",
    ],
    useCases: [
      "Bedroom",
      "Living room",
      "Kids room",
      "Hallway",
    ],
    variants: [
      { title: "Dark Beige Shaggy Rug" },
      { title: "Large Shaggy Area Rug" },
      { title: "Runner-Style Shaggy Rug" },
    ],
    specifications: [
      {
        variant: "Shaggy Rug",
        size: "60 x 100 [partially visible]",
        material: "Polypropylene",
        finish: "Dark Beige",
        useCase: "Soft indoor area rug",
      },
    ],
    relatedProducts: [
      { title: "Barrier Mats", href: "/products/barrier-mats" },
      { title: "Chindi Rag Rugs", href: "/products/chindi-rag-rugs" },
      { title: "Hallway Runner Rugs", href: "/products/hallway-runner-rugs" },
    ],
    relatedCategories: [
      { title: "Mats & Rugs", href: "/categories/mats-rugs" },
      {
        title: "Decoration & Seasonal",
        href: "/categories/decoration-seasonal",
      },
      {
        title: "Kitchen & Household",
        href: "/categories/kitchen-household",
      },
    ],
    support: {
      title: "Need Help Choosing the Right Rug?",
      description:
        "Contact our team for support with room use, sizing, and suitable variants for your range.",
      ctas: [
        { label: "Contact Support", variant: "primary" },
        { label: "Request Quote", variant: "outline" },
      ],
    },
  },
  {
    slug: "chindi-rag-rugs",
    categorySlug: "mats-rugs",
    name: "Chindi Rag Rugs",
    description:
      "Fair trade multi-colour recycled cotton rugs with fringed handcrafted finish.",
    summary:
      "A colourful recycled-cotton rug family combining craft-led appeal, decorative personality, and multi-room suitability.",
    gallery: [
      { src: "/images/mats/chindi-rug-1.jpg", alt: "Chindi rug main view" },
      { src: "/images/mats/chindi-rug-2.jpg", alt: "Chindi rug lifestyle" },
      { src: "/images/mats/chindi-rug-3.jpg", alt: "Chindi rug detail" },
    ],
    features: [
      "100% recycled material positioning",
      "Handmade flat woven construction",
      "Fringed decorative finish",
      "Bright multi-colour appearance",
      "Multi-purpose room suitability",
      "Multiple sizes available",
    ],
    useCases: [
      "Bedroom",
      "Living room",
      "Kids room",
      "Hallway",
      "Dining area",
      "Conservatory",
    ],
    variants: [
      { title: "100x164 Chindi Rug" },
      { title: "Small Chindi Rug" },
      { title: "Large Chindi Rug" },
    ],
    specifications: [
      {
        variant: "Chindi Rag Rug",
        size: "100x164",
        material: "Cotton",
        finish: "Multicolour / fringed",
        useCase: "Decorative recycled rug",
      },
    ],
    relatedProducts: [
      { title: "Shaggy Rugs", href: "/products/shaggy-rugs" },
      { title: "Barrier Mats", href: "/products/barrier-mats" },
      { title: "Hallway Runner Rugs", href: "/products/hallway-runner-rugs" },
    ],
    relatedCategories: [
      { title: "Mats & Rugs", href: "/categories/mats-rugs" },
      {
        title: "Decoration & Seasonal",
        href: "/categories/decoration-seasonal",
      },
      {
        title: "Kitchen & Household",
        href: "/categories/kitchen-household",
      },
    ],
    support: {
      title: "Need More Variant Information?",
      description:
        "Our team can help with sizes, colours, and merchandising suitability for your range.",
      ctas: [
        { label: "Contact Support", variant: "primary" },
        { label: "Request Quote", variant: "outline" },
      ],
    },
  },
  {
    slug: "hallway-runner-rugs",
    categorySlug: "mats-rugs",
    name: "Hallway Runner Rugs",
    description:
      "Practical long-format runners for corridors, entryways, and under-counter areas.",
    summary:
      "A runner-rug family focused on narrow-space floor protection, long-format utility, and everyday indoor use.",
    gallery: [
      {
        src: "/images/mats/hallway-runner-1.jpg",
        alt: "Hallway runner main view",
      },
      {
        src: "/images/mats/hallway-runner-2.jpg",
        alt: "Hallway runner lifestyle",
      },
      {
        src: "/images/mats/hallway-runner-3.jpg",
        alt: "Hallway runner detail",
      },
    ],
    features: [
      "Low profile format",
      "Dirt trapping function",
      "Easy to clean",
      "Vacuum-friendly maintenance",
      "Suitable for corridors and long narrow spaces",
      "Multiple sizes and colours likely available",
    ],
    useCases: [
      "Entryway",
      "Corridor",
      "Kitchen under-counter area",
      "Door area",
      "Family home circulation spaces",
    ],
    variants: [
      { title: "Grey Hallway Runner Rug" },
      { title: "Sell-on Runner Rug" },
    ],
    specifications: [
      {
        variant: "Hallway Runner Rug",
        size: "Multiple sizes",
        material: "Textile surface",
        useCase: "Indoor floor protection",
        finish: "Multiple colours",
      },
    ],
    relatedProducts: [
      { title: "Barrier Mats", href: "/products/barrier-mats" },
      { title: "Shaggy Rugs", href: "/products/shaggy-rugs" },
      { title: "Chindi Rag Rugs", href: "/products/chindi-rag-rugs" },
    ],
    relatedCategories: [
      { title: "Mats & Rugs", href: "/categories/mats-rugs" },
      {
        title: "Kitchen & Household",
        href: "/categories/kitchen-household",
      },
      {
        title: "Decoration & Seasonal",
        href: "/categories/decoration-seasonal",
      },
    ],
    support: {
      title: "Need Help Choosing the Right Runner?",
      description:
        "Contact our team for support with dimensions, colourways, and corridor-use recommendations.",
      ctas: [
        { label: "Contact Support", variant: "primary" },
        { label: "Request Quote", variant: "outline" },
      ],
    },
  },
  {
    slug: "wax-burners",
    categorySlug: "decoration-seasonal",
    name: "Wax Burners",
    description:
      "Decorative ceramic and porcelain burners for home fragrance, aroma, and gift-led seasonal and home décor use.",
    summary:
      "A decorative home fragrance product family combining ceramic craft, aromatherapy use, and giftable décor styling.",
    gallery: [
      { src: "/images/decor/wax-burner-1.jpg", alt: "Wax burner main view" },
      { src: "/images/decor/wax-burner-2.jpg", alt: "Wax burner detail" },
      { src: "/images/decor/wax-burner-3.jpg", alt: "Wax burner lifestyle" },
    ],
    features: [
      "High-quality porcelain construction",
      "Tea light powered aroma use",
      "Tree of life cut-out design",
      "Decorative home fragrance function",
      "Suitable for gifting and décor",
      "Compact tabletop product",
    ],
    useCases: [
      "Home fragrance",
      "Gift item",
      "Bedroom décor",
      "Living room décor",
      "Seasonal display",
    ],
    variants: [
      { title: "Tree of Life Cut-Out Grey Wax Burner" },
      { title: "Ceramic Aroma Burner" },
    ],
    specifications: [
      {
        variant: "Wax Burner",
        capacity: "90ml",
        material: "Porcelain",
        dimensions: "11cm diameter / 11cm height",
        finish: "Grey",
        useCase: "Tea light aroma burner",
      },
    ],
    relatedProducts: [
      {
        title: "Christmas Candle Bridges",
        href: "/products/christmas-candle-bridges",
      },
      {
        title: "Artificial Christmas Trees",
        href: "/products/artificial-christmas-trees",
      },
      {
        title: "Pencil Slim Trees",
        href: "/products/pencil-slim-christmas-trees",
      },
    ],
    relatedCategories: [
      {
        title: "Decoration & Seasonal",
        href: "/categories/decoration-seasonal",
      },
      { title: "Mats & Rugs", href: "/categories/mats-rugs" },
      {
        title: "Kitchen & Household",
        href: "/categories/kitchen-household",
      },
    ],
    support: {
      title: "Need More Product Information?",
      description:
        "We can help with decorative use, gifting suitability, and wholesale assortment planning.",
      ctas: [
        { label: "Contact Support", variant: "primary" },
        { label: "Request Quote", variant: "outline" },
      ],
    },
  },
  {
    slug: "christmas-candle-bridges",
    categorySlug: "decoration-seasonal",
    name: "Christmas Candle Bridges",
    description:
      "Traditional indoor Christmas lighting décor in natural wood designs with flameless LED candle-style presentation.",
    summary:
      "A seasonal tabletop lighting family blending traditional Christmas styling, safety, and decorative display value.",
    gallery: [
      {
        src: "/images/decor/candle-bridge-1.jpg",
        alt: "Christmas candle bridge",
      },
      {
        src: "/images/decor/candle-bridge-2.jpg",
        alt: "Candle bridge detail",
      },
      {
        src: "/images/decor/candle-bridge-3.jpg",
        alt: "Candle bridge lifestyle",
      },
    ],
    features: [
      "Natural wooden arch design",
      "7 LED candle lights",
      "Battery operated",
      "Safe for kids and pets",
      "Indoor festive décor",
      "Window, table, and display suitability",
    ],
    useCases: [
      "Window display",
      "Dining table décor",
      "Festive indoor decoration",
      "Seasonal merchandising",
      "Giftable Christmas item",
    ],
    variants: [
      { title: "7 Light Candle Bridge" },
      { title: "Natural Wood Candle Bridge" },
    ],
    specifications: [
      {
        variant: "Candle Bridge",
        dimensions: "39 x 5.5 x 29 cm",
        material: "Wood",
        compatibility: "Battery powered",
        finish: "Golden / green",
        useCase: "Indoor Christmas lighting",
      },
    ],
    relatedProducts: [
      { title: "Wax Burners", href: "/products/wax-burners" },
      {
        title: "Artificial Christmas Trees",
        href: "/products/artificial-christmas-trees",
      },
      {
        title: "Pencil Slim Trees",
        href: "/products/pencil-slim-christmas-trees",
      },
    ],
    relatedCategories: [
      {
        title: "Decoration & Seasonal",
        href: "/categories/decoration-seasonal",
      },
      { title: "Mats & Rugs", href: "/categories/mats-rugs" },
      {
        title: "Kitchen & Household",
        href: "/categories/kitchen-household",
      },
    ],
    support: {
      title: "Need Seasonal Range Support?",
      description:
        "Our team can help with festive merchandising, order planning, and seasonal assortment questions.",
      ctas: [
        { label: "Contact Support", variant: "primary" },
        { label: "Request Quote", variant: "outline" },
      ],
    },
  },
  {
    slug: "artificial-christmas-trees",
    categorySlug: "decoration-seasonal",
    name: "Artificial Christmas Trees",
    description:
      "Decorative seasonal tree ranges for festive retail periods and indoor home display.",
    summary:
      "A festive décor family with multiple heights and formats suited to Christmas merchandising and display-led retail.",
    gallery: [
      {
        src: "/images/decor/christmas-tree-1.jpg",
        alt: "Artificial Christmas tree",
      },
      {
        src: "/images/decor/christmas-tree-2.jpg",
        alt: "Christmas tree lifestyle",
      },
      {
        src: "/images/decor/christmas-tree-3.jpg",
        alt: "Christmas tree detail",
      },
    ],
    features: [
      "Easy to assemble",
      "Seasonal visual appeal",
      "Indoor display suitability",
      "Multiple tree formats",
      "Festive merchandising value",
    ],
    useCases: [
      "Home decoration",
      "Retail festive display",
      "Seasonal merchandising",
    ],
    variants: [
      { title: "6ft Deluxe Artificial Christmas Tree" },
      { title: "White Artificial Christmas Tree" },
    ],
    specifications: [
      {
        variant: "6ft Deluxe Tree",
        size: "183cm",
        finish: "Green",
        useCase: "Indoor festive display",
      },
    ],
    relatedProducts: [
      {
        title: "Pencil Slim Trees",
        href: "/products/pencil-slim-christmas-trees",
      },
      {
        title: "Christmas Candle Bridges",
        href: "/products/christmas-candle-bridges",
      },
      { title: "Wax Burners", href: "/products/wax-burners" },
    ],
    relatedCategories: [
      {
        title: "Decoration & Seasonal",
        href: "/categories/decoration-seasonal",
      },
      { title: "Mats & Rugs", href: "/categories/mats-rugs" },
      {
        title: "Kitchen & Household",
        href: "/categories/kitchen-household",
      },
    ],
    support: {
      title: "Need Seasonal Planning Support?",
      description:
        "Contact us for tree variant guidance, seasonal order support, and merchandising planning.",
      ctas: [
        { label: "Contact Support", variant: "primary" },
        { label: "Request Quote", variant: "outline" },
      ],
    },
  },
  {
    slug: "pencil-slim-christmas-trees",
    categorySlug: "decoration-seasonal",
    name: "Pencil Slim Christmas Trees",
    description:
      "Space-saving festive trees with slim profile and decorative impact for compact spaces.",
    summary:
      "A slim-format Christmas tree family designed to save floor space while maintaining festive display value.",
    gallery: [
      { src: "/images/decor/pencil-tree-1.jpg", alt: "Pencil slim tree" },
      {
        src: "/images/decor/pencil-tree-2.jpg",
        alt: "Pencil tree lifestyle",
      },
      {
        src: "/images/decor/pencil-tree-3.jpg",
        alt: "Pencil tree detail",
      },
    ],
    features: [
      "Space-saving slim profile",
      "Easy assembly",
      "Metal stand included",
      "Reusable seasonal décor",
      "Suitable for medium and large rooms while saving floor space",
    ],
    useCases: [
      "Compact room Christmas display",
      "Apartment-friendly festive décor",
      "Retail festive range",
    ],
    variants: [
      { title: "6ft Pencil Slim Tree" },
      { title: "Green Slim Christmas Tree" },
    ],
    specifications: [
      {
        variant: "6ft Pencil Slim Tree",
        dimensions: "182 x 30 x 182 cm",
        material: "Metal / PVC [visible meaning]",
        finish: "Green",
        useCase: "Space-saving Christmas display",
      },
    ],
    relatedProducts: [
      {
        title: "Artificial Christmas Trees",
        href: "/products/artificial-christmas-trees",
      },
      {
        title: "Christmas Candle Bridges",
        href: "/products/christmas-candle-bridges",
      },
      { title: "Wax Burners", href: "/products/wax-burners" },
    ],
    relatedCategories: [
      {
        title: "Decoration & Seasonal",
        href: "/categories/decoration-seasonal",
      },
      { title: "Mats & Rugs", href: "/categories/mats-rugs" },
      {
        title: "Kitchen & Household",
        href: "/categories/kitchen-household",
      },
    ],
    support: {
      title: "Need More Product Information?",
      description:
        "We can help with seasonal format selection, sizing, and trade order planning.",
      ctas: [
        { label: "Contact Support", variant: "primary" },
        { label: "Request Quote", variant: "outline" },
      ],
    },
  },
  {
    slug: "stock-pot-4-5l-24cm",
    categorySlug: "kitchen-household",
    name: "Stock Pot 4.5L / 24cm",
    description:
      "A practical non-stick stock pot with glass lid, designed for everyday cooking and suitable for trade buyers looking to stock versatile kitchen essentials.",
    summary:
      "Multi-use cookware with glass lid, easy-clean surface, and compatibility with everyday kitchen routines.",
    gallery: [
      { src: "/images/kitchen/stock-pot-1.jpg", alt: "Stock Pot front view" },
      { src: "/images/kitchen/stock-pot-2.jpg", alt: "Stock Pot detail" },
      { src: "/images/kitchen/stock-pot-3.jpg", alt: "Stock Pot cooking use" },
    ],
    features: [
      "Versatile 3-in-1 pot",
      "Quick clean surface",
      "Efficient heat transmission",
      "Even heat spreading",
      "Superior heat retention",
      "Glass lid included",
      "Heat-resistant side handles",
    ],
    useCases: [
      "Soups",
      "Sauces",
      "Pasta",
      "Stock",
      "Family meals",
      "General stovetop cooking",
    ],
    variants: [
      { title: "Stock Pot 3.0L / 20cm" },
      { title: "Stock Pot 6.5L / 28cm" },
      { title: "Cookware Set (3-piece)" },
    ],
    specifications: [
      {
        variant: "Stock Pot 4.5L / 24cm",
        diameter: "24cm",
        capacity: "4.5L",
        material: "Aluminium",
        compatibility: "Induction / Gas Compatible",
        lidIncluded: "Glass lid included",
        finish: "Grey finish",
      },
      {
        variant: "Stock Pot 3.0L / 20cm",
        diameter: "20cm",
        capacity: "3.0L",
        material: "Aluminium",
        compatibility: "Induction / Gas Compatible",
        lidIncluded: "Glass lid included",
        finish: "Grey finish",
      },
      {
        variant: "Stock Pot 6.5L / 28cm",
        diameter: "28cm",
        capacity: "6.5L",
        material: "Aluminium",
        compatibility: "Induction / Gas Compatible",
        lidIncluded: "Glass lid included",
        finish: "Grey finish",
      },
      {
        variant: "Cookware Set (3-piece)",
        diameter: "Various",
        capacity: "Various",
        material: "Aluminium",
        compatibility: "Induction / Gas Compatible",
        lidIncluded: "Glass lids included",
        finish: "Grey finish",
      },
    ],
    relatedProducts: [
      { title: "Wok Pan with Glass Lid 32cm", href: "/products/wok-pan-glass-lid-32cm" },
      { title: "Non Stick Frying Pan 30cm", href: "/products/non-stick-frying-pan-30cm" },
      { title: "Chip Pan with Basket", href: "/products/chip-pan-with-basket" },
      { title: "Milk Pot 14cm", href: "/products/milk-pot-14cm" },
      { title: "Egg Poacher Pan", href: "/products/egg-poacher-pan" },
    ],
    relatedCategories: [
      { title: "Kitchen & Household", href: "/categories/kitchen-household" },
      { title: "Fruit Baskets", href: "/products/fruit-basket" },
      { title: "Corner Plate Racks", href: "/products/corner-plate-rack" },
    ],
    support: {
      title: "Have a Product Question?",
      description:
        "Need account-specific help or have questions about this product? Our B2B support team is here to assist with product queries, MOQ requirements, and ordering.",
      ctas: [
        { label: "Contact Support", variant: "primary" },
        { label: "Live Chat", variant: "outline" },
      ],
    },
  },
  {
    slug: "wok-pan-glass-lid-32cm",
    categorySlug: "kitchen-household",
    name: "Wok Pan with Glass Lid 32cm",
    description:
      "Large-capacity wok with tempered glass lid for versatile stir-fry and everyday cooking.",
    summary:
      "Ceramic-coated wok with induction-friendly base and family-size usability for multiple home kitchen routines.",
    gallery: [
      { src: "/images/kitchen/wok-pan-1.jpg", alt: "Wok pan front view" },
      { src: "/images/kitchen/wok-pan-2.jpg", alt: "Wok pan lifestyle" },
      { src: "/images/kitchen/wok-pan-3.jpg", alt: "Wok pan detail" },
    ],
    features: [
      "Ceramic coating",
      "Glass lid included",
      "Aluminium body",
      "Induction-friendly base",
      "Double-sided handles",
      "Easy cleaning",
    ],
    useCases: [
      "Stir fry cooking",
      "Everyday family meals",
      "Multi-cooktop home use",
    ],
    variants: [
      { title: "Blue Wok Pan" },
      { title: "Wok with Glass Lid 32cm" },
    ],
    specifications: [
      {
        variant: "Wok Pan 32cm",
        dimensions: "32 x 42 x 9 cm",
        material: "Aluminium",
        compatibility: "Induction / electric / halogen / gas",
        lidIncluded: "Glass lid included",
        finish: "Blue ceramic finish",
      },
    ],
    relatedProducts: [
      { title: "Stock Pot 4.5L / 24cm", href: "/products/stock-pot-4-5l-24cm" },
      { title: "Non Stick Frying Pan 30cm", href: "/products/non-stick-frying-pan-30cm" },
      { title: "Chip Pan with Basket", href: "/products/chip-pan-with-basket" },
    ],
    relatedCategories: [
      { title: "Kitchen & Household", href: "/categories/kitchen-household" },
      { title: "Fruit Baskets", href: "/products/fruit-basket" },
      { title: "Corner Plate Racks", href: "/products/corner-plate-rack" },
    ],
    support: {
      title: "Need More Product Information?",
      description:
        "We can help with variant selection, range planning, and bulk order support for cookware lines.",
      ctas: [
        { label: "Contact Support", variant: "primary" },
        { label: "Request Quote", variant: "outline" },
      ],
    },
  },
  {
    slug: "non-stick-frying-pan-30cm",
    categorySlug: "kitchen-household",
    name: "Non Stick Frying Pan 30cm",
    description:
      "Large-format pan with broad hob compatibility and practical daily-use performance.",
    summary:
      "A large frying pan / skillet family suited to multiple cooktops and general-purpose home cooking.",
    gallery: [
      { src: "/images/kitchen/frying-pan-1.jpg", alt: "Frying pan front view" },
      { src: "/images/kitchen/frying-pan-2.jpg", alt: "Frying pan detail" },
      { src: "/images/kitchen/frying-pan-3.jpg", alt: "Frying pan use" },
    ],
    features: [
      "Non-stick interior",
      "Glass lid with steam vent",
      "Stainless steel ergonomic handle",
      "Broad hob compatibility",
      "Large 30cm cooking surface",
    ],
    useCases: [
      "Frying",
      "Skillet cooking",
      "Everyday pan use",
      "General home kitchen tasks",
    ],
    variants: [
      { title: "30cm Large Frying Pan" },
      { title: "Blue Finish Frying Pan" },
    ],
    specifications: [
      {
        variant: "30cm Frying Pan",
        diameter: "30cm",
        capacity: "4.5 quarts",
        material: "Stainless Steel / coated interior",
        compatibility:
          "Electric / Gas / Halogen / Induction / Oven / Grill",
        lidIncluded: "Glass lid included",
        finish: "Blue finish",
      },
    ],
    relatedProducts: [
      { title: "Stock Pot 4.5L / 24cm", href: "/products/stock-pot-4-5l-24cm" },
      { title: "Wok Pan with Glass Lid 32cm", href: "/products/wok-pan-glass-lid-32cm" },
      { title: "Chip Pan with Basket", href: "/products/chip-pan-with-basket" },
    ],
    relatedCategories: [
      { title: "Kitchen & Household", href: "/categories/kitchen-household" },
      { title: "Fruit Baskets", href: "/products/fruit-basket" },
      { title: "Corner Plate Racks", href: "/products/corner-plate-rack" },
    ],
    support: {
      title: "Have a Product Question?",
      description:
        "Need help with size, compatibility, or broader cookware family planning? Our team can help.",
      ctas: [
        { label: "Contact Support", variant: "primary" },
        { label: "Request Quote", variant: "outline" },
      ],
    },
  },
  {
    slug: "chip-pan-with-basket",
    categorySlug: "kitchen-household",
    name: "Chip Pan with Basket",
    description:
      "A multi-use chip pan family with basket and lid for fries, chips, wedges, and broader saucepan use.",
    summary:
      "A practical fryer/saucepan hybrid suitable for family kitchens and broad cookware ranges.",
    gallery: [
      { src: "/images/kitchen/chip-pan-1.jpg", alt: "Chip pan main view" },
      { src: "/images/kitchen/chip-pan-2.jpg", alt: "Chip pan detail" },
      { src: "/images/kitchen/chip-pan-3.jpg", alt: "Chip pan use" },
    ],
    features: [
      "Basket and lid included",
      "Use as chip fryer, saucepan, or stock pot",
      "Heat-resistant handles",
      "Family-size capacity",
      "All-in-one hob positioning on variants",
    ],
    useCases: [
      "Chips",
      "Fries",
      "Wedges",
      "Pasta",
      "Sauces",
      "General saucepan use",
    ],
    variants: [
      { title: "Blue Fat Fixer Chip Fryer" },
      { title: "Black Chip Pan 22cm" },
    ],
    specifications: [
      {
        variant: "Blue Fryer",
        dimensions: "28 x 30 x 12 cm",
        capacity: "4L",
        material: "Aluminium",
        lidIncluded: "Glass lid included",
        finish: "Blue",
      },
      {
        variant: "Black Chip Pan",
        dimensions: "10 x 20 x 10.5 cm",
        capacity: "4.2L",
        material: "Aluminium",
        compatibility: "Gas [visible on one family page]",
        lidIncluded: "Glass lid included",
        finish: "Black",
      },
    ],
    relatedProducts: [
      { title: "Stock Pot 4.5L / 24cm", href: "/products/stock-pot-4-5l-24cm" },
      { title: "Wok Pan with Glass Lid 32cm", href: "/products/wok-pan-glass-lid-32cm" },
      { title: "Non Stick Frying Pan 30cm", href: "/products/non-stick-frying-pan-30cm" },
    ],
    relatedCategories: [
      { title: "Kitchen & Household", href: "/categories/kitchen-household" },
      { title: "Milk Pans", href: "/products/milk-pot-14cm" },
      { title: "Egg Poacher Pans", href: "/products/egg-poacher-pan" },
    ],
    support: {
      title: "Need Help with Variant Selection?",
      description:
        "Contact us for support with pan variants, capacity, and product-family planning for your range.",
      ctas: [
        { label: "Contact Support", variant: "primary" },
        { label: "Request Quote", variant: "outline" },
      ],
    },
  },
  {
    slug: "milk-pot-14cm",
    categorySlug: "kitchen-household",
    name: "Milk Pot 14cm",
    description:
      "Compact saucepan / milk pan designed for smaller cooking tasks and everyday stovetop use.",
    summary:
      "A small-format kitchen essential for milk, sauces, butter, and compact home cooking routines.",
    gallery: [
      { src: "/images/kitchen/milk-pan-1.jpg", alt: "Milk pot main view" },
      { src: "/images/kitchen/milk-pan-2.jpg", alt: "Milk pot detail" },
    ],
    features: [
      "Compact 14cm size",
      "Long stay-cool handle",
      "Non-stick interior",
      "Small-batch and reheating suitability",
      "Gas / halogen / radiant ring compatibility",
    ],
    useCases: [
      "Boiling milk",
      "Making sauces",
      "Melting butter",
      "Small kitchen tasks",
    ],
    variants: [
      { title: "14cm Black Milk Pot" },
    ],
    specifications: [
      {
        variant: "Milk Pot 14cm",
        diameter: "14cm",
        capacity: "1.4L",
        material: "Aluminium",
        compatibility: "Gas / Halogen / Radiant ring / Solid hotplate",
        lidIncluded: "No lid shown in extracted page",
        finish: "Black",
      },
    ],
    relatedProducts: [
      { title: "Stock Pot 4.5L / 24cm", href: "/products/stock-pot-4-5l-24cm" },
      { title: "Chip Pan with Basket", href: "/products/chip-pan-with-basket" },
      { title: "Egg Poacher Pan", href: "/products/egg-poacher-pan" },
    ],
    relatedCategories: [
      { title: "Kitchen & Household", href: "/categories/kitchen-household" },
      { title: "Fruit Baskets", href: "/products/fruit-basket" },
      { title: "Corner Plate Racks", href: "/products/corner-plate-rack" },
    ],
    support: {
      title: "Need More Information?",
      description:
        "Our team can help with product suitability, compatibility, and small-format cookware ranges.",
      ctas: [
        { label: "Contact Support", variant: "primary" },
        { label: "Request Quote", variant: "outline" },
      ],
    },
  },
  {
    slug: "egg-poacher-pan",
    categorySlug: "kitchen-household",
    name: "Egg Poacher Pan",
    description:
      "Speciality cookware for poaching eggs and breakfast preparation with glass lid and four-cup format.",
    summary:
      "A niche utility cookware item suited to breakfast, egg preparation, and speciality kitchen ranges.",
    gallery: [
      {
        src: "/images/kitchen/egg-poacher-1.jpg",
        alt: "Egg poacher main view",
      },
      {
        src: "/images/kitchen/egg-poacher-2.jpg",
        alt: "Egg poacher detail",
      },
    ],
    features: [
      "Four nylon poaching cups",
      "Glass lid included",
      "Non-stick interior",
      "Stay-cool handles and knob",
      "Speciality breakfast cookware positioning",
    ],
    useCases: [
      "Poached eggs",
      "Coddled eggs",
      "Breakfast preparation",
    ],
    variants: [
      { title: "20cm Egg Poacher Pan" },
    ],
    specifications: [
      {
        variant: "Egg Poacher Pan",
        diameter: "20cm",
        material: "Aluminium",
        compatibility: "Gas / Radiant ring",
        lidIncluded: "Glass lid included",
        finish: "Black",
      },
    ],
    relatedProducts: [
      { title: "Milk Pot 14cm", href: "/products/milk-pot-14cm" },
      { title: "Chip Pan with Basket", href: "/products/chip-pan-with-basket" },
      { title: "Stock Pot 4.5L / 24cm", href: "/products/stock-pot-4-5l-24cm" },
    ],
    relatedCategories: [
      { title: "Kitchen & Household", href: "/categories/kitchen-household" },
      { title: "Fruit Baskets", href: "/products/fruit-basket" },
      { title: "Corner Plate Racks", href: "/products/corner-plate-rack" },
    ],
    support: {
      title: "Have a Product Question?",
      description:
        "Need more detail on the egg poacher format or category placement? Contact our B2B support team.",
      ctas: [
        { label: "Contact Support", variant: "primary" },
        { label: "Request Quote", variant: "outline" },
      ],
    },
  },
  {
    slug: "fruit-basket",
    categorySlug: "kitchen-household",
    name: "Fruit Basket",
    description:
      "Decorative and functional wire fruit basket designed for countertop display and everyday home organisation.",
    summary:
      "A modern open-wire fruit basket family combining countertop utility with display-friendly homeware styling.",
    gallery: [
      { src: "/images/kitchen/fruit-basket-1.jpg", alt: "Fruit basket main view" },
      { src: "/images/kitchen/fruit-basket-2.jpg", alt: "Fruit basket lifestyle" },
      { src: "/images/kitchen/fruit-basket-3.jpg", alt: "Fruit basket detail" },
    ],
    features: [
      "Geometric wire design",
      "Countertop fruit display",
      "Air circulation support",
      "Decorative centerpiece use",
      "Suitable for fruit, vegetables, bread, and snacks",
    ],
    useCases: [
      "Kitchen countertop display",
      "Fruit storage",
      "Decorative centerpiece",
      "Giftable homeware",
    ],
    variants: [
      { title: "Minimal Copper Fruit Bowl" },
      { title: "Modern Wire Fruit Bowl" },
      { title: "Open Curved Fruit Bowl" },
    ],
    specifications: [
      {
        variant: "Fruit Basket",
        material: "Metal wire",
        useCase: "Countertop display",
        finish: "Copper / wire finishes [visible family]",
      },
    ],
    relatedProducts: [
      { title: "Corner Plate Rack", href: "/products/corner-plate-rack" },
      { title: "Stock Pot 4.5L / 24cm", href: "/products/stock-pot-4-5l-24cm" },
      { title: "Radiator Airers", href: "/products/radiator-airers" },
    ],
    relatedCategories: [
      { title: "Kitchen & Household", href: "/categories/kitchen-household" },
      { title: "Mats & Rugs", href: "/categories/mats-rugs" },
      {
        title: "Decoration & Seasonal",
        href: "/categories/decoration-seasonal",
      },
    ],
    support: {
      title: "Need More Variant Information?",
      description:
        "We can help with finish options, display suitability, and homeware assortment planning.",
      ctas: [
        { label: "Contact Support", variant: "primary" },
        { label: "Request Quote", variant: "outline" },
      ],
    },
  },
  {
    slug: "corner-plate-rack",
    categorySlug: "kitchen-household",
    name: "Corner Plate Rack",
    description:
      "A space-saving countertop corner organiser for plates, bowls, mugs, spices, and everyday kitchen items.",
    summary:
      "A kitchen organisation family with strong utility, multiple colourways, and broad countertop-storage relevance.",
    gallery: [
      { src: "/images/kitchen/plate-rack-1.jpg", alt: "Corner plate rack main view" },
      { src: "/images/kitchen/plate-rack-2.jpg", alt: "Corner plate rack lifestyle" },
      { src: "/images/kitchen/plate-rack-3.jpg", alt: "Corner plate rack detail" },
    ],
    features: [
      "Corner-saving layout",
      "Multi-tier rack format",
      "Suitable for plates, bowls, mugs, and jars",
      "Open wire visibility",
      "Plastic-coated / coated steel finish family",
      "Multiple colourways available",
    ],
    useCases: [
      "Countertop storage",
      "Cupboard corner organisation",
      "Plate and bowl storage",
      "Kitchen utility display",
    ],
    variants: [
      { title: "White Corner Plate Rack" },
      { title: "Gold / Copper Corner Plate Rack" },
      { title: "Black Corner Plate Rack" },
    ],
    specifications: [
      {
        variant: "Corner Plate Rack",
        material: "Steel / coated wire",
        useCase: "Kitchen organisation",
        finish: "White / Gold / Black variants",
      },
    ],
    relatedProducts: [
      { title: "Fruit Basket", href: "/products/fruit-basket" },
      { title: "Radiator Airers", href: "/products/radiator-airers" },
      { title: "Rotary Dryers", href: "/products/rotary-dryers" },
    ],
    relatedCategories: [
      { title: "Kitchen & Household", href: "/categories/kitchen-household" },
      { title: "Fruit Baskets", href: "/products/fruit-basket" },
      {
        title: "Garden & Outdoor",
        href: "/categories/garden-outdoor",
      },
    ],
    support: {
      title: "Need Help Choosing the Right Variant?",
      description:
        "Contact our team for colourway, storage-use, and merchandising support.",
      ctas: [
        { label: "Contact Support", variant: "primary" },
        { label: "Request Quote", variant: "outline" },
      ],
    },
  },
  {
    slug: "radiator-airers",
    categorySlug: "kitchen-household",
    name: "Radiator Airers",
    description:
      "Compact foldable over-radiator drying solutions for small spaces and everyday indoor laundry use.",
    summary:
      "A utility-focused drying range designed for compact homes, bathrooms, bedrooms, and space-saving laundry routines.",
    gallery: [
      { src: "/images/kitchen/radiator-airer-1.jpg", alt: "Radiator airer main view" },
      { src: "/images/kitchen/radiator-airer-2.jpg", alt: "Radiator airer lifestyle" },
      { src: "/images/kitchen/radiator-airer-3.jpg", alt: "Radiator airer detail" },
    ],
    features: [
      "Foldable over-radiator design",
      "Space-saving drying function",
      "Suitable for towels, socks, underwear, and lighter garments",
      "Adjustable, lightweight, resistant positioning",
      "Indoor laundry use",
    ],
    useCases: [
      "Bathroom drying",
      "Bedroom drying",
      "Hallway drying",
      "Compact indoor laundry support",
    ],
    variants: [
      { title: "Pack of 3 Drying Rails" },
      { title: "5 Bar Radiator Airer" },
      { title: "3 / 5 Rail Variants" },
    ],
    specifications: [
      {
        variant: "5 Bar Radiator Airer",
        dimensions: "51 x 34 x 16 cm",
        material: "Metal",
        useCase: "Over-radiator drying",
        finish: "Random / white variants",
      },
    ],
    relatedProducts: [
      { title: "Rotary Dryers", href: "/products/rotary-dryers" },
      { title: "Corner Plate Rack", href: "/products/corner-plate-rack" },
      { title: "Fruit Basket", href: "/products/fruit-basket" },
    ],
    relatedCategories: [
      { title: "Kitchen & Household", href: "/categories/kitchen-household" },
      {
        title: "Garden & Outdoor",
        href: "/categories/garden-outdoor",
      },
      { title: "Mats & Rugs", href: "/categories/mats-rugs" },
    ],
    support: {
      title: "Need Help with Utility Product Selection?",
      description:
        "Our team can help with variant choice, use-case fit, and bundle planning for utility ranges.",
      ctas: [
        { label: "Contact Support", variant: "primary" },
        { label: "Request Quote", variant: "outline" },
      ],
    },
  },
  {
    slug: "rotary-dryers",
    categorySlug: "kitchen-household",
    name: "Rotary Dryers",
    description:
      "Outdoor umbrella-style drying racks with adjustable rotary design, ground spike support, and weather-ready use.",
    summary:
      "A practical outdoor laundry family for household drying with foldable rotary arms and weather-oriented utility.",
    gallery: [
      { src: "/images/kitchen/rotary-dryer-1.jpg", alt: "Rotary dryer main view" },
      { src: "/images/kitchen/rotary-dryer-2.jpg", alt: "Rotary dryer detail" },
      { src: "/images/kitchen/rotary-dryer-3.jpg", alt: "Rotary dryer lifestyle" },
    ],
    features: [
      "Adjustable umbrella-style dryer",
      "Ground spike and socket use",
      "Weatherproof cover included on variants",
      "360-degree rotating structure",
      "Suitable for large laundry loads",
    ],
    useCases: [
      "Outdoor laundry drying",
      "Family laundry",
      "Garden utility use",
    ],
    variants: [
      { title: "50m Rotary Dryer" },
      { title: "60m Rotary Dryer" },
    ],
    specifications: [
      {
        variant: "Rotary Dryer",
        dimensions: "130 x 12 x 12 cm",
        material: "Alloy Steel / Metal",
        useCase: "Outdoor washing line",
        finish: "Grey",
      },
    ],
    relatedProducts: [
      { title: "Radiator Airers", href: "/products/radiator-airers" },
      { title: "Corner Plate Rack", href: "/products/corner-plate-rack" },
      { title: "Fruit Basket", href: "/products/fruit-basket" },
    ],
    relatedCategories: [
      { title: "Kitchen & Household", href: "/categories/kitchen-household" },
      {
        title: "Garden & Outdoor",
        href: "/categories/garden-outdoor",
      },
      { title: "Mats & Rugs", href: "/categories/mats-rugs" },
    ],
    support: {
      title: "Need Help with Outdoor Utility Products?",
      description:
        "Contact our team for support with format selection, trade suitability, and outdoor utility planning.",
      ctas: [
        { label: "Contact Support", variant: "primary" },
        { label: "Request Quote", variant: "outline" },
      ],
    },
  },
  {
    slug: "bamboo-fence-screening",
    categorySlug: "garden-outdoor",
    name: "Bamboo Fence Screening",
    description:
      "Natural bamboo privacy and decorative fencing for gardens, balconies, patios, and outdoor spaces.",
    summary:
      "A natural-material outdoor screening family designed for privacy, décor, and flexible fence enhancement.",
    gallery: [
      { src: "/images/garden/bamboo-fence-1.jpg", alt: "Bamboo fence screening main view" },
      { src: "/images/garden/bamboo-fence-2.jpg", alt: "Bamboo fence detail" },
      { src: "/images/garden/bamboo-fence-3.jpg", alt: "Bamboo fence lifestyle" },
    ],
    features: [
      "Natural bamboo material",
      "Eco-friendly positioning",
      "Flexible for curved surfaces",
      "Easy installation with wire, cable ties, screws, or nails",
      "All-weather use",
      "Easy cleaning",
    ],
    useCases: [
      "Privacy screens",
      "Balcony décor",
      "Patio screening",
      "Fence covering",
      "Garden wall decoration",
    ],
    variants: [
      { title: "2m x 3m Bamboo Fence" },
    ],
    specifications: [
      {
        variant: "Bamboo Fence Screening",
        size: "2m x 3m",
        material: "Bamboo",
        useCase: "Privacy screening",
        finish: "Natural bamboo",
      },
    ],
    relatedProducts: [
      { title: "Bamboo Canes", href: "/products/bamboo-canes" },
      { title: "Green Garden Sticks", href: "/products/green-garden-sticks" },
      { title: "Artificial Hedge Screening", href: "/products/artificial-hedge-screening" },
    ],
    relatedCategories: [
      { title: "Garden & Outdoor", href: "/categories/garden-outdoor" },
      { title: "Gazing Balls", href: "/products/gazing-balls" },
      {
        title: "Kitchen & Household",
        href: "/categories/kitchen-household",
      },
    ],
    support: {
      title: "Need Help with Screening Options?",
      description:
        "Our team can help with material choice, size selection, and privacy/product-fit guidance.",
      ctas: [
        { label: "Contact Support", variant: "primary" },
        { label: "Request Quote", variant: "outline" },
      ],
    },
  },
  {
    slug: "bamboo-canes",
    categorySlug: "garden-outdoor",
    name: "Bamboo Canes",
    description:
      "Natural support for growing gardens, available in multiple lengths and suitable for vegetables, flowers, trellis systems, and general plant support.",
    summary:
      "Reusable natural bamboo support range designed for indoor and outdoor gardening.",
    gallery: [
      { src: "/images/garden/bamboo-canes-1.jpg", alt: "Bamboo canes bundle" },
      { src: "/images/garden/bamboo-canes-2.jpg", alt: "Bamboo canes in garden use" },
      { src: "/images/garden/bamboo-canes-3.jpg", alt: "Bamboo canes detail" },
    ],
    features: [
      "Natural bamboo material",
      "Smooth finish",
      "Reusable and eco-friendly",
      "Weather-resistant positioning",
      "Multiple lengths available",
      "Suitable for indoor and outdoor gardening",
    ],
    useCases: [
      "Tomato support",
      "Flower and stem support",
      "Trellis systems",
      "Vegetable support",
      "DIY garden structures",
    ],
    variants: [
      { title: "60cm Bamboo Canes" },
      { title: "90cm Bamboo Canes" },
      { title: "120cm Bamboo Canes" },
      { title: "150cm Bamboo Canes" },
      { title: "180cm Bamboo Canes" },
    ],
    specifications: [
      {
        variant: "60cm",
        size: "60cm",
        material: "Natural Bamboo",
        useCase: "Short plant support",
      },
      {
        variant: "90cm",
        size: "90cm",
        material: "Natural Bamboo",
        useCase: "General support",
      },
      {
        variant: "120cm",
        size: "120cm",
        material: "Natural Bamboo",
        useCase: "Vegetable support",
      },
      {
        variant: "150cm",
        size: "150cm",
        material: "Natural Bamboo",
        useCase: "Larger support structures",
      },
      {
        variant: "180cm",
        size: "180cm",
        material: "Natural Bamboo",
        useCase: "Tall plant and trellis support",
      },
    ],
    relatedProducts: [
      { title: "Green Garden Sticks", href: "/products/green-garden-sticks" },
      { title: "Wooden Garden Stakes", href: "/products/wooden-garden-stakes" },
      { title: "Bamboo Fence Screening", href: "/products/bamboo-fence-screening" },
    ],
    relatedCategories: [
      { title: "Garden & Outdoor", href: "/categories/garden-outdoor" },
      { title: "Artificial Hedge Screening", href: "/products/artificial-hedge-screening" },
      { title: "Gazing Balls", href: "/products/gazing-balls" },
    ],
    support: {
      title: "Need Help Choosing the Right Size?",
      description:
        "Contact our team for support with size selection, pack quantities, and garden-use recommendations.",
      ctas: [
        { label: "Contact Support", variant: "primary" },
        { label: "Request Quote", variant: "outline" },
      ],
    },
  },
  {
    slug: "green-garden-sticks",
    categorySlug: "garden-outdoor",
    name: "Green Garden Sticks",
    description:
      "Coated green plant support sticks for indoor and outdoor use, designed to blend with planting while providing practical structure.",
    summary:
      "A size-rich plant support family suited for flowers, vegetables, houseplants, and general stem support.",
    gallery: [
      { src: "/images/garden/green-sticks-1.jpg", alt: "Green garden sticks main view" },
      { src: "/images/garden/green-sticks-2.jpg", alt: "Green sticks lifestyle" },
      { src: "/images/garden/green-sticks-3.jpg", alt: "Green sticks detail" },
    ],
    features: [
      "Reusable",
      "No fading dye",
      "Strong and durable",
      "Plant-support friendly finish",
      "Visually blends with foliage",
      "Multiple lengths available",
    ],
    useCases: [
      "House plants",
      "Flowering pots",
      "Stem tying",
      "Vegetable support",
      "Tomato support",
      "Climbing plant support",
    ],
    variants: [
      { title: "30cm Green Sticks" },
      { title: "40cm Green Sticks" },
      { title: "50cm Green Sticks" },
      { title: "60cm Green Sticks" },
      { title: "75cm Green Sticks" },
      { title: "90cm Green Sticks" },
      { title: "120cm Green Sticks" },
      { title: "150cm Green Sticks" },
      { title: "180cm Green Sticks" },
    ],
    specifications: [
      {
        variant: "Green Garden Stick",
        size: "5mm diameter family",
        material: "Coated support stick",
        useCase: "Plant support",
        finish: "Green",
      },
    ],
    relatedProducts: [
      { title: "Bamboo Canes", href: "/products/bamboo-canes" },
      { title: "Wooden Garden Stakes", href: "/products/wooden-garden-stakes" },
      { title: "Bamboo Fence Screening", href: "/products/bamboo-fence-screening" },
    ],
    relatedCategories: [
      { title: "Garden & Outdoor", href: "/categories/garden-outdoor" },
      { title: "Artificial Hedge Screening", href: "/products/artificial-hedge-screening" },
      { title: "Gazing Balls", href: "/products/gazing-balls" },
    ],
    support: {
      title: "Need More Product Information?",
      description:
        "We can help with sizing, support use cases, and trade-ready assortment planning for your garden range.",
      ctas: [
        { label: "Contact Support", variant: "primary" },
        { label: "Request Quote", variant: "outline" },
      ],
    },
  },
  {
    slug: "wooden-garden-stakes",
    categorySlug: "garden-outdoor",
    name: "Wooden Garden Stakes",
    description:
      "Pointed timber stakes designed for support, edging, and practical outdoor garden use.",
    summary:
      "A simple support and fencing accessory for plant, garden, and outdoor utility use.",
    gallery: [
      { src: "/images/garden/wooden-stakes-1.jpg", alt: "Wooden stakes main view" },
      { src: "/images/garden/wooden-stakes-2.jpg", alt: "Wooden stakes detail" },
    ],
    features: [
      "Pointed stake format",
      "Outdoor support use",
      "Natural timber appearance",
      "Practical utility role",
    ],
    useCases: [
      "Outdoor support",
      "Garden edging",
      "Simple fence and support applications",
    ],
    variants: [{ title: "Wooden Garden Stakes Bundle" }],
    specifications: [
      {
        variant: "Wooden Stakes",
        material: "Wood",
        useCase: "Garden support / edging",
        finish: "Natural wood",
      },
    ],
    relatedProducts: [
      { title: "Bamboo Canes", href: "/products/bamboo-canes" },
      { title: "Green Garden Sticks", href: "/products/green-garden-sticks" },
      { title: "Bamboo Fence Screening", href: "/products/bamboo-fence-screening" },
    ],
    relatedCategories: [
      { title: "Garden & Outdoor", href: "/categories/garden-outdoor" },
      { title: "Artificial Hedge Screening", href: "/products/artificial-hedge-screening" },
      { title: "Gazing Balls", href: "/products/gazing-balls" },
    ],
    support: {
      title: "Need Help with Utility Product Selection?",
      description:
        "Contact us for more information on support applications, variant suitability, and bulk orders.",
      ctas: [
        { label: "Contact Support", variant: "primary" },
        { label: "Request Quote", variant: "outline" },
      ],
    },
  },
  {
    slug: "artificial-hedge-screening",
    categorySlug: "garden-outdoor",
    name: "Artificial Hedge Screening",
    description:
      "UV-protected, fire-resistant, low-maintenance outdoor screening for fences, walls, terraces, and garden privacy use.",
    summary:
      "A decorative privacy product family combining realistic green conifer appearance with practical outdoor screening performance.",
    gallery: [
      {
        src: "/images/garden/artificial-hedge-1.jpg",
        alt: "Artificial hedge screening main view",
      },
      {
        src: "/images/garden/artificial-hedge-2.jpg",
        alt: "Artificial hedge detail",
      },
      {
        src: "/images/garden/artificial-hedge-3.jpg",
        alt: "Artificial hedge lifestyle",
      },
    ],
    features: [
      "UV protected",
      "Fire resistant",
      "Low maintenance",
      "Double-sided conifer look",
      "Suitable for walls, fences, terraces, and poolsides",
      "Available in multiple sizes",
    ],
    useCases: [
      "Garden privacy screening",
      "Fence covering",
      "Wall enhancement",
      "Outdoor zoning",
      "Poolside privacy",
      "Terrace privacy",
    ],
    variants: [
      { title: "1m x 3m Artificial Hedge" },
      { title: "1.5m x 3m Artificial Hedge" },
    ],
    specifications: [
      {
        variant: "Artificial Hedge Screening",
        size: "1m x 3m / 1.5m x 3m",
        material: "Plastic",
        useCase: "Privacy screening",
        finish: "Green conifer look",
      },
    ],
    relatedProducts: [
      { title: "Bamboo Fence Screening", href: "/products/bamboo-fence-screening" },
      { title: "Bamboo Canes", href: "/products/bamboo-canes" },
      { title: "Gazing Balls", href: "/products/gazing-balls" },
    ],
    relatedCategories: [
      { title: "Garden & Outdoor", href: "/categories/garden-outdoor" },
      {
        title: "Decoration & Seasonal",
        href: "/categories/decoration-seasonal",
      },
      { title: "Mats & Rugs", href: "/categories/mats-rugs" },
    ],
    support: {
      title: "Need Help with Screening Options?",
      description:
        "Our team can help with size selection, installation suitability, and privacy-use planning.",
      ctas: [
        { label: "Contact Support", variant: "primary" },
        { label: "Request Quote", variant: "outline" },
      ],
    },
  },
  {
    slug: "gazing-balls",
    categorySlug: "garden-outdoor",
    name: "Gazing Balls",
    description:
      "Reflective stainless steel garden ornaments suited for lawns, patios, planters, bowls, and outdoor decorative styling.",
    summary:
      "A premium-look outdoor décor family with mirrored finish, multiple sizes, and strong gift/display appeal.",
    gallery: [
      { src: "/images/garden/gazing-balls-1.jpg", alt: "Gazing balls main view" },
      { src: "/images/garden/gazing-balls-2.jpg", alt: "Gazing balls detail" },
      { src: "/images/garden/gazing-balls-3.jpg", alt: "Gazing balls lifestyle" },
    ],
    features: [
      "Reflective mirror finish",
      "Stainless steel construction",
      "Indoor and outdoor use",
      "Suitable for bowls, baskets, pots, lawns, and patios",
      "Pack includes multiple ball sizes",
    ],
    useCases: [
      "Garden décor",
      "Patio styling",
      "Planter accent use",
      "Giftable outdoor decoration",
    ],
    variants: [
      { title: "Pack of 4 Gazing Balls" },
    ],
    specifications: [
      {
        variant: "Pack of 4",
        size: "2 x 10cm / 1 x 15cm / 1 x 20cm",
        material: "Stainless Steel",
        useCase: "Decorative garden ornament",
        finish: "Silver mirror finish",
      },
    ],
    relatedProducts: [
      { title: "Artificial Hedge Screening", href: "/products/artificial-hedge-screening" },
      { title: "Bamboo Fence Screening", href: "/products/bamboo-fence-screening" },
      { title: "Bamboo Canes", href: "/products/bamboo-canes" },
    ],
    relatedCategories: [
      { title: "Garden & Outdoor", href: "/categories/garden-outdoor" },
      {
        title: "Decoration & Seasonal",
        href: "/categories/decoration-seasonal",
      },
      { title: "Mats & Rugs", href: "/categories/mats-rugs" },
    ],
    support: {
      title: "Need More Product Information?",
      description:
        "Contact us for help with decorative use cases, assortment planning, and wholesale support.",
      ctas: [
        { label: "Contact Support", variant: "primary" },
        { label: "Request Quote", variant: "outline" },
      ],
    },
  },
  {
    slug: "hula-hoops",
    categorySlug: "toys-games",
    name: "Gloss Hula Hoops",
    description:
      "Lightweight activity hoops for kids, adults, events, play, dance, and fitness use.",
    summary:
      "A colourful activity product family bridging toys, events, and light fitness routines.",
    gallery: [
      { src: "/images/toys/hula-hoops-1.jpg", alt: "Hula hoops main view" },
      { src: "/images/toys/hula-hoops-2.jpg", alt: "Hula hoops detail" },
      { src: "/images/toys/hula-hoops-3.jpg", alt: "Hula hoops lifestyle" },
    ],
    features: [
      "Suitable for kids and adults",
      "Fun hoop activity",
      "Exercise, dance, and fitness positioning",
      "Bright colours",
      "Suitable for events and birthdays",
      "Durable PVC-based construction",
    ],
    useCases: [
      "Indoor play",
      "Outdoor play",
      "Beginner exercise",
      "Dance and movement",
      "Party and event activity",
    ],
    variants: [
      { title: "10 Pack Multicolour 60cm (Medium)" },
    ],
    specifications: [
      {
        variant: "Gloss Hula Hoops",
        size: "60cm (Medium)",
        material: "Plastic / PVC / Wood",
        useCase: "Activity and fitness",
        finish: "Gold / multicolour family",
      },
    ],
    relatedProducts: [
      { title: "Garden & Outdoor", href: "/categories/garden-outdoor" },
      { title: "Mats & Rugs", href: "/categories/mats-rugs" },
      {
        title: "Decoration & Seasonal",
        href: "/categories/decoration-seasonal",
      },
    ],
    relatedCategories: [
      { title: "Toys & Games", href: "/categories/toys-games" },
      { title: "Garden & Outdoor", href: "/categories/garden-outdoor" },
      { title: "Mats & Rugs", href: "/categories/mats-rugs" },
    ],
    support: {
      title: "Need More Product Information?",
      description:
        "We can help with pack configuration, activity positioning, and trade suitability for this range.",
      ctas: [
        { label: "Contact Support", variant: "primary" },
        { label: "Request Quote", variant: "outline" },
      ],
    },
  },
];