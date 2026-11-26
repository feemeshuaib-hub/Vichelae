import type {
  CategoryMeta,
  EquipmentItem,
  FaqItem,
  SampleReview,
} from '../types/rental';

export const BUSINESS_INFO = {
  name: 'Vvichelae Event Rentals',
  shortName: 'VVICHELAE',
  subName: 'EVENT RENTALS',
  tagline: 'Every Celebration, Beautifully Set.',
  location: 'Lagos, Nigeria',
  serviceArea: 'Lagos and surrounding areas',
  whatsappDisplay: '08144084281',
  whatsappUrl: 'https://wa.me/2348144084281',
  email: 'vvichelae@gmail.com',
  emblemImage: '/assets/aistudio/Burgundy_and_Gold_Event_Rentals_Logo_b611a13d.png',
  heroImage: '/assets/aistudio/Amazon_com__10ftx40ft_Navy_Blue_Ceiling_Curtain_for_Wedding_Parties___2_Panels_Wrinkle-Free_40_FT_Long_Tent_Draping_Curtains_for_Wedding__Birthday___Theme_Parties__40ft_Height_with_Rod_Pocket___Home___Kitchen_49f92038.jpg',
  videos: {
    showcase: {
      heading: 'See the Difference Beautiful Details Make.',
      src: '/videos/vvichelae-event-showcase.mp4',
      poster: '/src/assets/images/video_showcase_poster_1795644006085.jpg',
      caption:
        'A closer look at how our seating, round banquet tables, linens, drapery, and lighting come together in a finished Lagos reception hall.',
    },
    transformation: {
      heading: 'From Empty Space to Unforgettable Moments.',
      src: '/videos/vvichelae-event-transformation.mp4',
      poster: '/src/assets/images/video_transformation_poster_1795644006813.jpg',
      caption:
        'Watch a bare marquee floor come to life with modular staging, a red carpet walkway, lined seating, and ceiling canopy drapery.',
    },
  },
} as const;

export const CATEGORIES: CategoryMeta[] = [
  {
    name: 'Seating & Furniture',
    slug: 'seating-furniture',
    tagline: 'Comfort & Arrangement',
    description: 'Clean white event chairs, cushioned banquet seating, and full-size round dining tables.',
    image: '/assets/aistudio/Purple_Reception___Purple_wedding_theme__Purple_reception__Wedding_reception_decorations_5cee5bde.jpg',
  },
  {
    name: 'Tents & Canopies',
    slug: 'tents-canopies',
    tagline: 'Outdoor Shelter',
    description: 'From intimate 3m × 3m garden canopies to grand clear-span marquee event tents.',
    image: '/assets/aistudio/01f3d5132b2f7c438293e32d20599811_565ea264.jpg',
  },
  {
    name: 'Fabrics & Decoration',
    slug: 'fabrics-decoration',
    tagline: 'Textiles & Draping',
    description: 'Pressed event tablecloths, fitted chair covers with satin sashes, and layered backdrops.',
    image: '/assets/aistudio/download__2__1c304333.jpg',
  },
  {
    name: 'Catering & Serving Equipment',
    slug: 'catering-serving',
    tagline: 'Buffet & Hospitality',
    description: 'Mirror-finish stainless chafing dishes, twin beverage dispensers, and oval serving trays.',
    image: '/assets/aistudio/4Packs_Large_Capacity_Stainless_Steel_Chafing_Dish_Buffet_Set_Party_Thermal_Food_Container_Tableware_Christmas_Kitchenware__Winter_Cookware_Set_0a351641.jpg',
  },
  {
    name: 'Event Setup & Accessories',
    slug: 'event-setup-accessories',
    tagline: 'Staging & Ambience',
    description: 'Modular stage platforms, VIP red carpet runners, and wireless LED uplighting.',
    image: '/assets/aistudio/test_cb8d1dd5.jpg',
  },
];

/**
 * Central editable equipment inventory (15 products — 3 per category).
 * Update dailyPrice, availableStock, or descriptions here and every page updates automatically.
 */
export const EQUIPMENT_ITEMS: EquipmentItem[] = [
  // CATEGORY 1: SEATING & FURNITURE
  {
    id: 'white-plastic-chair',
    slug: 'white-plastic-event-chair',
    name: 'White Plastic Event Chair',
    category: 'Seating & Furniture',
    dailyPrice: 500,
    availableStock: 300,
    shortDescription: 'Clean, stackable molded white event chairs suited for outdoor gatherings, ceremonies, and large guest counts.',
    fullDescription:
      'Our White Plastic Event Chair is a reliable seating essential for large celebrations, traditional engagements, outdoor ceremonies, and community gatherings across Lagos. Each chair is cleaned before dispatch, stacks neatly for effortless venue arrangement, and pairs easily with fitted chair covers and satin sashes.',
    rentalInfo: [
      'Cleaned and inspected prior to collection or delivery',
      'Stackable design for quick venue layout and pack-down',
      'Compatible with our Chair Covers and Satin Sashes',
      'Available for customer collection or Lagos delivery (confirmed separately)',
    ],
    specifications: [
      { label: 'Material', value: 'Heavy-duty UV-stabilized polypropylene' },
      { label: 'Finish', value: 'Crisp matte-gloss white' },
      { label: 'Recommended Use', value: 'Outdoor receptions, ceremonies, large gatherings' },
      { label: 'Listed Stock', value: '300 units' },
    ],
    image: '/src/assets/images/white_plastic_chair_1795644006738.jpg',
    galleryImages: [
      {
        src: '/src/assets/images/white_plastic_chair_1795644006738.jpg',
        caption: 'Neatly arranged rows on an outdoor event lawn',
      },
      {
        src: '/src/assets/images/chair_satin_sashes_1795644067414.jpg',
        caption: 'Optional pairing with ivory chair covers and champagne sashes',
      },
    ],
  },
  {
    id: 'elegant-banquet-chair',
    slug: 'elegant-banquet-chair',
    name: 'Elegant Banquet Chair',
    category: 'Seating & Furniture',
    dailyPrice: 1500,
    availableStock: 120,
    featured: true,
    shortDescription: 'Gold-framed padded banquet chairs with warm ivory velvet cushions designed for upscale receptions and dinners.',
    fullDescription:
      'Designed for wedding receptions, milestone dinners, and executive galas, our Elegant Banquet Chair combines a refined gold-finished frame with plush ivory upholstery. Guests enjoy supportive seating throughout long programmes while your floor plan maintains a cohesive, dressed-up aesthetic without extra covers.',
    rentalInfo: [
      'Padded seat and contoured backrest in warm ivory upholstery',
      'Ready to style directly around Round Banquet Tables',
      'Suitable for indoor halls, hotel ballrooms, and covered marquees',
      'Collection and return dates apply uniformly across your basket',
    ],
    specifications: [
      { label: 'Frame', value: 'Gold-finished reinforced metal frame' },
      { label: 'Upholstery', value: 'Warm ivory cushioned fabric' },
      { label: 'Recommended Use', value: 'Weddings, VIP dining, corporate dinners' },
      { label: 'Listed Stock', value: '120 units' },
    ],
    image: '/src/assets/images/elegant_banquet_chair_1795644007039.jpg',
    galleryImages: [
      {
        src: '/src/assets/images/elegant_banquet_chair_1795644007039.jpg',
        caption: 'Row of gold-framed ivory banquet chairs',
      },
      {
        src: '/src/assets/images/round_banquet_table_1795644007566.jpg',
        caption: 'Paired around a dressed round banquet table',
      },
    ],
  },
  {
    id: 'round-banquet-table',
    slug: 'round-banquet-table',
    name: 'Round Banquet Table',
    category: 'Seating & Furniture',
    dailyPrice: 5000,
    availableStock: 30,
    shortDescription: 'Spacious round banquet dining table accommodating up to 10 guests comfortably for weddings and formal meals.',
    fullDescription:
      'Our Round Banquet Table provides generous surface area for floral centerpieces, dinnerware, and shared platters while encouraging conversation across the table. Built with folding steel legs for practical transport and quick floor setup, each table pairs cleanly with our Premium Event Tablecloths.',
    rentalInfo: [
      'Seats 8 to 10 guests per table depending on chair style',
      'Folding undercarriage for straightforward loading and staging',
      'Recommended pairing: Premium Event Tablecloth',
      'Suitable for indoor halls and canopy-covered outdoor venues',
    ],
    specifications: [
      { label: 'Capacity', value: '8–10 guests per table' },
      { label: 'Shape', value: 'Full circular banquet profile' },
      { label: 'Base', value: 'Locking steel folding legs' },
      { label: 'Listed Stock', value: '30 units' },
    ],
    image: '/src/assets/images/round_banquet_table_1795644007566.jpg',
    galleryImages: [
      {
        src: '/src/assets/images/round_banquet_table_1795644007566.jpg',
        caption: 'Full reception setting dressed in warm ivory linen',
      },
      {
        src: '/src/assets/images/premium_event_tablecloth_1795644065605.jpg',
        caption: 'Compatible with our ivory and champagne table linens',
      },
    ],
  },

  // CATEGORY 2: TENTS & CANOPIES
  {
    id: 'standard-3m-canopy',
    slug: 'standard-3m-3m-canopy',
    name: 'Standard 3m × 3m Canopy',
    category: 'Tents & Canopies',
    dailyPrice: 15000,
    availableStock: 12,
    shortDescription: 'Compact 3m × 3m crisp white outdoor canopy ideal for garden parties, vendor booths, and shaded lounges.',
    fullDescription:
      'The Standard 3m × 3m Canopy offers practical sun and light-weather shelter for intimate home celebrations, registration desks, catering prep areas, and exhibition stands. Its clean white peaked profile fits easily into residential compounds, courtyards, and narrow outdoor spaces across Lagos.',
    rentalInfo: [
      'Compact 9 sqm footprint fits driveways, lawns, and courtyards',
      'Clean white roof canopy with sturdy corner legs',
      'Can be combined in multiples for buffet lines or welcome stations',
      'Delivery and setup logistics confirmed separately after enquiry',
    ],
    specifications: [
      { label: 'Footprint', value: '3m × 3m (9 sqm)' },
      { label: 'Canopy Colour', value: 'Crisp event white' },
      { label: 'Ideal Capacity', value: '1 round table or 10–12 seated guests' },
      { label: 'Listed Stock', value: '12 units' },
    ],
    image: '/src/assets/images/small_event_canopy_1795644008169.jpg',
    galleryImages: [
      {
        src: '/src/assets/images/small_event_canopy_1795644008169.jpg',
        caption: '3m × 3m canopy pitched on a manicured garden lawn',
      },
      {
        src: '/src/assets/images/hero_event_setup_1795644006016.jpg',
        caption: 'Outdoor celebration styling inspiration',
      },
    ],
  },
  {
    id: 'premium-6m-canopy',
    slug: 'premium-6m-6m-canopy',
    name: 'Premium 6m × 6m Canopy',
    category: 'Tents & Canopies',
    dailyPrice: 45000,
    availableStock: 6,
    featured: true,
    shortDescription: 'High-peak 6m × 6m pagoda canopy tent with elegant valance styling for medium outdoor receptions.',
    fullDescription:
      'With its signature high-peak pagoda silhouette and spacious 36-square-metre coverage, the Premium 6m × 6m Canopy anchors outdoor birthday dinners, bridal showers, naming ceremonies, and VIP hospitality zones. Multiple units can be aligned seamlessly to shade larger guest counts.',
    rentalInfo: [
      'Generous 36 sqm covered floor space per unit',
      'High-peak pagoda roof profile allows warm airflow and lighting suspension',
      'Suitable for paved courtyards, lawns, and open event compounds',
      'Site access and delivery details reviewed upon enquiry',
    ],
    specifications: [
      { label: 'Footprint', value: '6m × 6m (36 sqm)' },
      { label: 'Style', value: 'High-peak white pagoda structure' },
      { label: 'Ideal Capacity', value: '3–4 round tables (30–40 seated guests)' },
      { label: 'Listed Stock', value: '6 units' },
    ],
    image: '/src/assets/images/medium_pagoda_canopy_1795644008216.jpg',
    galleryImages: [
      {
        src: '/src/assets/images/medium_pagoda_canopy_1795644008216.jpg',
        caption: 'High-peak 6m × 6m pagoda canopy in a courtyard setting',
      },
      {
        src: '/src/assets/images/hero_event_setup_1795644006016.jpg',
        caption: 'Draped canopy reception atmosphere',
      },
    ],
  },
  {
    id: 'large-marquee-tent',
    slug: 'large-marquee-event-tent',
    name: 'Large Marquee Event Tent',
    category: 'Tents & Canopies',
    dailyPrice: 120000,
    availableStock: 2,
    shortDescription: 'Grand clear-span marquee event tent built for large weddings, corporate functions, and full-scale receptions.',
    fullDescription:
      'Our Large Marquee Event Tent creates a complete architectural venue anywhere in Lagos and surrounding areas. Offering an unobstructed interior span with high eaves, it accommodates banquet seating, a raised stage platform, backdrop draping, and chandelier or LED uplighting setups with poise.',
    rentalInfo: [
      'Clear-span interior with no obstructing centre poles',
      'Ideal for major weddings, corporate galas, and milestone receptions',
      'Pairs with Modular Event Stage Platform and LED Event Uplighting',
      'Site inspection and delivery arrangements confirmed separately',
    ],
    specifications: [
      { label: 'Structure', value: 'Heavy-duty clear-span aluminum marquee' },
      { label: 'Interior', value: 'Open span supporting draping & lighting' },
      { label: 'Recommended Use', value: 'Full-scale weddings & corporate functions' },
      { label: 'Listed Stock', value: '2 units' },
    ],
    image: '/src/assets/images/large_marquee_tent_1795644009303.jpg',
    galleryImages: [
      {
        src: '/src/assets/images/large_marquee_tent_1795644009303.jpg',
        caption: 'Grand marquee illuminated warmly for an evening reception',
      },
      {
        src: '/src/assets/images/video_transformation_poster_1795644006813.jpg',
        caption: 'Spacious clear-span interior arranged with stage and aisle',
      },
    ],
  },

  // CATEGORY 3: FABRICS & DECORATION
  {
    id: 'premium-event-tablecloth',
    slug: 'premium-event-tablecloth',
    name: 'Premium Event Tablecloth',
    category: 'Fabrics & Decoration',
    dailyPrice: 1500,
    availableStock: 100,
    shortDescription: 'Crisply pressed, heavy-drape event tablecloths in warm ivory and champagne finishes for round or buffet tables.',
    fullDescription:
      'Elevate every dining and serving table with our Premium Event Tablecloths. Laundered and steam-pressed before each rental, the heavy-weight fabric falls smoothly to create clean, tailored table lines across banquet rounds, cake tables, and buffet stations.',
    rentalInfo: [
      'Professionally laundered and pressed prior to dispatch',
      'Generous drop tailored for Round Banquet Tables and serving stations',
      'Warm ivory and champagne tones coordinate with all decor palettes',
      'Return folded and free from permanent wax or burn damage',
    ],
    specifications: [
      { label: 'Fabric', value: 'Heavy-weight woven banquet linen / satin blend' },
      { label: 'Palette', value: 'Warm Ivory & Champagne Gold options' },
      { label: 'Fit', value: 'Round banquet & rectangular buffet tables' },
      { label: 'Listed Stock', value: '100 units' },
    ],
    image: '/src/assets/images/premium_event_tablecloth_1795644065605.jpg',
    galleryImages: [
      {
        src: '/src/assets/images/premium_event_tablecloth_1795644065605.jpg',
        caption: 'Freshly pressed ivory and champagne table linens',
      },
      {
        src: '/src/assets/images/round_banquet_table_1795644007566.jpg',
        caption: 'Styled on a full 10-seater banquet table',
      },
    ],
  },
  {
    id: 'chair-covers-sashes',
    slug: 'chair-covers-and-satin-sashes',
    name: 'Chair Covers and Satin Sashes',
    category: 'Fabrics & Decoration',
    dailyPrice: 500,
    availableStock: 250,
    shortDescription: 'Tailored stretch ivory chair covers paired with luminous satin bow sashes for a cohesive reception look.',
    fullDescription:
      'Transform standard event seating into a coordinated celebration display with our Chair Covers and Satin Sashes. Each set includes one fitted ivory chair cover and one smooth satin sash that ties neatly into a crisp bow or contemporary drape.',
    rentalInfo: [
      'Includes 1 fitted chair cover + 1 matching satin sash per unit',
      'Fits standard plastic and armless banquet event chairs',
      'Freshly laundered and ready to dress your venue seating',
      'High stock availability for large Lagos celebrations',
    ],
    specifications: [
      { label: 'Set Contents', value: '1 fitted cover + 1 satin sash' },
      { label: 'Cover Tone', value: 'Warm Ivory stretch weave' },
      { label: 'Sash Material', value: 'Lustrous satin ribbon' },
      { label: 'Listed Stock', value: '250 units' },
    ],
    image: '/src/assets/images/chair_satin_sashes_1795644067414.jpg',
    galleryImages: [
      {
        src: '/src/assets/images/chair_satin_sashes_1795644067414.jpg',
        caption: 'Fitted ivory chair covers finished with champagne satin bows',
      },
      {
        src: '/src/assets/images/video_showcase_poster_1795644006085.jpg',
        caption: 'Coordinated dining hall presentation',
      },
    ],
  },
  {
    id: 'decorative-backdrop-drape-set',
    slug: 'decorative-backdrop-and-drape-set',
    name: 'Decorative Backdrop and Drape Set',
    category: 'Fabrics & Decoration',
    dailyPrice: 12000,
    availableStock: 20,
    featured: true,
    shortDescription: 'Floor-to-ceiling layered chiffon drapery and valance swag set with support frame for stages and sweetheart tables.',
    fullDescription:
      'Create an unforgettable focal point behind the couple’s table, birthday throne, or corporate keynote stage. Our Decorative Backdrop and Drape Set pairs soft flowing chiffon panels with sculpted valance swags on an adjustable upright frame, ready to glow under LED uplighting.',
    rentalInfo: [
      'Includes backdrop frame hardware and layered fabric drapes',
      'Adjustable height and span to frame head tables or photo walls',
      'Enhances dramatically when paired with LED Event Uplighting',
      'Suitable for halls, marquees, and sheltered outdoor stages',
    ],
    specifications: [
      { label: 'Components', value: 'Adjustable frame + chiffon panels + swags' },
      { label: 'Primary Tone', value: 'Warm Ivory & Champagne Gold accents' },
      { label: 'Application', value: 'Sweetheart backdrop, photo wall, stage rear' },
      { label: 'Listed Stock', value: '20 units' },
    ],
    image: '/src/assets/images/backdrop_drape_set_1795644009047.jpg',
    galleryImages: [
      {
        src: '/src/assets/images/backdrop_drape_set_1795644009047.jpg',
        caption: 'Full layered ivory and gold valance backdrop setup',
      },
      {
        src: '/src/assets/images/video_showcase_poster_1795644006085.jpg',
        caption: 'Backlit backdrop framing a grand banquet room',
      },
    ],
  },

  // CATEGORY 4: EVENT SETUP & ACCESSORIES
  {
    id: 'modular-event-stage',
    slug: 'modular-event-stage-platform',
    name: 'Modular Event Stage Platform',
    category: 'Event Setup & Accessories',
    dailyPrice: 8000,
    availableStock: 20,
    shortDescription: 'Sturdy carpeted modular stage deck section with pleated black skirting for bands, speakers, and high tables.',
    fullDescription:
      'Build the exact stage footprint your event requires with our Modular Event Stage Platforms. Each heavy-duty section locks securely to adjacent decks to form a level, non-slip carpeted riser for wedding couples, live bands, MCs, or corporate keynote panels.',
    rentalInfo: [
      'Rent single modules for podiums or combine multiple units for full stages',
      'Includes fitted black pleated stage skirting on exposed sides',
      'Carpeted top surface reduces footstep noise and looks clean in photos',
      'Delivery and assembly logistics confirmed separately upon enquiry',
    ],
    specifications: [
      { label: 'Deck Surface', value: 'Charcoal non-slip event carpet' },
      { label: 'Finish', value: 'Black pleated perimeter skirting' },
      { label: 'Configuration', value: 'Interlocking modular riser panels' },
      { label: 'Listed Stock', value: '20 units' },
    ],
    image: '/src/assets/images/modular_event_stage_1795644066370.jpg',
    galleryImages: [
      {
        src: '/src/assets/images/modular_event_stage_1795644066370.jpg',
        caption: 'Assembled modular stage with black skirting and steps',
      },
      {
        src: '/src/assets/images/video_transformation_poster_1795644006813.jpg',
        caption: 'Stage platform positioned inside a marquee hall',
      },
    ],
  },
  {
    id: 'red-carpet-runner',
    slug: 'red-carpet-runner',
    name: 'Red Carpet Runner',
    category: 'Event Setup & Accessories',
    dailyPrice: 5000,
    availableStock: 15,
    shortDescription: 'Plush crimson VIP entrance and ceremonial aisle carpet runner for grand arrivals and processionals.',
    fullDescription:
      'Give guests and celebrants an unmistakable VIP arrival with our plush Red Carpet Runner. Ideal for bridal processionals, grand entrance walkways, award nights, and corporate product launches, it lays flat for safe, smooth footsteps indoors or on level outdoor walkways.',
    rentalInfo: [
      'Deep crimson pile vacuumed and rolled clean prior to each hire',
      'Suitable for wedding aisles, entrance foyers, and marquee walkways',
      'Connect multiple runners seamlessly for extended entrance paths',
      'Keep dry and avoid heavy mud exposure where possible',
    ],
    specifications: [
      { label: 'Colour', value: 'Rich ceremonial crimson red' },
      { label: 'Surface', value: 'Dense low-pile plush event carpet' },
      { label: 'Recommended Use', value: 'VIP arrivals, bridal aisles, award nights' },
      { label: 'Listed Stock', value: '15 units' },
    ],
    image: '/src/assets/images/red_carpet_runner_1795644009849.jpg',
    galleryImages: [
      {
        src: '/src/assets/images/red_carpet_runner_1795644009849.jpg',
        caption: 'Plush crimson carpet runner at a grand venue entrance',
      },
      {
        src: '/src/assets/images/video_transformation_poster_1795644006813.jpg',
        caption: 'Full-length aisle runner inside an event marquee',
      },
    ],
  },
  {
    id: 'led-event-uplighting',
    slug: 'led-event-uplighting',
    name: 'LED Event Uplighting',
    category: 'Event Setup & Accessories',
    dailyPrice: 3500,
    availableStock: 40,
    shortDescription: 'Compact floor-standing LED uplight fixtures that wash venue walls, pillars, and drapes in warm architectural colour.',
    fullDescription:
      'Lighting defines the mood of an evening celebration. Our LED Event Uplighting units sit discreetly along walls, columns, or behind chiffon backdrop drapes, casting smooth vertical beams in warm champagne amber, rich plum, or custom event hues to transform plain interiors.',
    rentalInfo: [
      'Low-profile black housings blend discreetly along venue perimeters',
      'Selectable warm amber, plum, ivory, and full-spectrum tones',
      'Ideal for illuminating Decorative Backdrop and Drape Sets',
      'Tested before every dispatch for consistent brightness',
    ],
    specifications: [
      { label: 'Light Source', value: 'High-output multi-colour architectural LED' },
      { label: 'Placement', value: 'Floor-standing adjustable tilt bracket' },
      { label: 'Application', value: 'Wall wash, pillar accents, backdrop glow' },
      { label: 'Listed Stock', value: '40 units' },
    ],
    image: '/src/assets/images/led_event_uplighting_1795644010558.jpg',
    galleryImages: [
      {
        src: '/src/assets/images/led_event_uplighting_1795644010558.jpg',
        caption: 'LED fixtures casting warm amber and plum light columns',
      },
      {
        src: '/src/assets/images/backdrop_drape_set_1795644009047.jpg',
        caption: 'Uplighting illuminating pleated ivory backdrop drapes',
      },
    ],
  },

  // CATEGORY 5: CATERING & SERVING EQUIPMENT
  {
    id: 'stainless-steel-chafing-dish',
    slug: 'stainless-steel-chafing-dish',
    name: 'Stainless Steel Chafing Dish',
    category: 'Catering & Serving Equipment',
    dailyPrice: 7000,
    availableStock: 25,
    featured: true,
    shortDescription: 'Mirror-polished roll-top rectangular stainless steel chafing dish for elegant, warm buffet service.',
    fullDescription:
      'Keep Jollof rice, proteins, and signature dishes piping hot while presenting a polished buffet line. Our Stainless Steel Chafing Dishes feature smooth roll-top lids, sturdy frames, and deep food pans designed for professional caterers and private event hosts alike.',
    rentalInfo: [
      'Includes frame, water pan, food pan, fuel holders, and roll-top lid',
      'Sanitized and polished to a mirror finish before collection',
      'Designed for neat alignment along draped buffet tables',
      'Please rinse food residue gently prior to return',
    ],
    specifications: [
      { label: 'Material', value: 'Heavy-gauge mirror-polished stainless steel' },
      { label: 'Lid Type', value: 'Smooth 180-degree roll-top cover' },
      { label: 'Format', value: 'Full-size rectangular buffet dish' },
      { label: 'Listed Stock', value: '25 units' },
    ],
    image: '/src/assets/images/stainless_chafing_dish_1795644066968.jpg',
    galleryImages: [
      {
        src: '/src/assets/images/stainless_chafing_dish_1795644066968.jpg',
        caption: 'Buffet line of mirror-polished roll-top chafing dishes',
      },
      {
        src: '/src/assets/images/catering_serving_trays_1795644067836.jpg',
        caption: 'Complement with our oval stainless serving tray sets',
      },
    ],
  },
  {
    id: 'beverage-dispenser',
    slug: 'beverage-dispenser',
    name: 'Beverage Dispenser',
    category: 'Catering & Serving Equipment',
    dailyPrice: 4000,
    availableStock: 15,
    shortDescription: 'Crystal-clear glass beverage dispenser on a brushed stainless steel stand with drip-free serving spigot.',
    fullDescription:
      'Serve chilled zobo, chapman, infused water, or fresh fruit punch with effortless sophistication. Each Beverage Dispenser pairs a thick faceted glass vessel with a sturdy elevated stainless stand and smooth-pour tap so guests can serve themselves cleanly.',
    rentalInfo: [
      'Elevated stainless stand leaves comfortable clearance for tall glasses',
      'Drip-resistant metal spigot with stainless steel lid',
      'Sanitized before dispatch and packed safely for transport',
      'Suitable for welcome drinks, brunch stations, and bar tables',
    ],
    specifications: [
      { label: 'Vessel', value: 'Thick faceted clear glass jar' },
      { label: 'Stand & Lid', value: 'Brushed stainless steel base & top' },
      { label: 'Pour Mechanism', value: 'Stainless steel lever spigot' },
      { label: 'Listed Stock', value: '15 units' },
    ],
    image: '/src/assets/images/catering_beverage_dispenser_1795644010897.jpg',
    galleryImages: [
      {
        src: '/src/assets/images/catering_beverage_dispenser_1795644010897.jpg',
        caption: 'Clear glass beverage dispensers on stainless steel stands',
      },
    ],
  },
  {
    id: 'premium-serving-tray-set',
    slug: 'premium-serving-tray-set',
    name: 'Premium Serving Tray Set',
    category: 'Catering & Serving Equipment',
    dailyPrice: 2500,
    availableStock: 30,
    shortDescription: 'Nested three-piece polished stainless oval serving tray set with champagne gold rim handles.',
    fullDescription:
      'Designed for smooth table service, small chops platters, and VIP hospitality, our Premium Serving Tray Set brings cohesive polish to every course. The brushed gold-toned handles provide balanced grip for servers while complementing warm ivory and champagne table themes.',
    rentalInfo: [
      'Each rental unit includes a nested 3-tray graduated set',
      'Polished stainless surface with raised champagne-gold handles',
      'Ideal for canapés, small chops, desserts, and VIP table service',
      'Cleaned and checked as a complete 3-piece set on return',
    ],
    specifications: [
      { label: 'Set Contents', value: '3 nested oval serving trays (S, M, L)' },
      { label: 'Finish', value: 'Polished stainless steel & gold-tone handles' },
      { label: 'Recommended Use', value: 'Small chops, VIP table service, pastries' },
      { label: 'Listed Stock', value: '30 units' },
    ],
    image: '/src/assets/images/catering_serving_trays_1795644067836.jpg',
    galleryImages: [
      {
        src: '/src/assets/images/catering_serving_trays_1795644067836.jpg',
        caption: 'Nested 3-piece oval serving tray set with gold handles',
      },
      {
        src: '/src/assets/images/stainless_chafing_dish_1795644066968.jpg',
        caption: 'Pairs with our stainless steel chafing dishes',
      },
    ],
  },
];

export const SAMPLE_REVIEWS: SampleReview[] = [
  {
    id: 'testimonial-amaka',
    customerName: 'Amaka O.',
    serviceRented: 'Wedding Rental – Chairs, Tables & Decoration',
    quote:
      'I rented banquet chairs, round tables, chair covers and decorative fabrics for my wedding reception. Everything looked beautiful and was in excellent condition. The equipment made our venue look so elegant, and I loved how organised the rental process was. I would definitely recommend them!',
  },
  {
    id: 'testimonial-daniel',
    customerName: 'Daniel E.',
    serviceRented: 'Birthday Event – Canopy, Chairs & Tables',
    quote:
      'I needed chairs, tables and canopies for my birthday celebration. I was impressed by the quality of the equipment and how easy it was to select everything I needed in one place. The setup made the occasion even more special. Great experience!',
  },
  {
    id: 'testimonial-blessing',
    customerName: 'Blessing A.',
    serviceRented: 'Corporate Event – Stage, Lighting & Catering Equipment',
    quote:
      'We rented stage equipment, event lighting and catering supplies for a corporate gathering. I particularly liked having different equipment options available in one place. Everything came together beautifully, and the experience made planning much easier for our team.',
  },
  {
    id: 'testimonial-chisom',
    customerName: 'Chisom N.',
    serviceRented: 'Private Celebration – Backdrop Drapes, Chair Covers & Centrepieces',
    quote:
      "The decorative fabrics, chair covers and centrepieces I rented completely transformed our venue. Everything looked beautiful and coordinated perfectly with our event theme. I was impressed by the variety available and how easy the rental process was. I'll definitely use Vvichelae again!",
  },
];

export const FAQS: FaqItem[] = [
  {
    id: 'how-to-rent',
    featuredOnHome: true,
    question: 'How do I rent equipment?',
    answer:
      'Browse the Equipment catalogue, open any item to review its specifications and available stock, and add your required quantities to the Rental Basket. Once your items are selected, choose your collection and return dates on the Rental Basket page, fill in your contact and event details, and click SEND RENTAL ENQUIRY.',
  },
  {
    id: 'how-costs-calculated',
    featuredOnHome: true,
    question: 'How are rental costs calculated?',
    answer:
      'Rental days are calculated as Return Date minus Collection Date (so collecting on Friday and returning on Saturday counts as 1 rental day). For each item, the cost equals Daily Price × Quantity × Rental Days. Your total estimated rental cost is the sum of all items in your basket.',
  },
  {
    id: 'multiple-products',
    featuredOnHome: true,
    question: 'Can I rent several different products together?',
    answer:
      'Yes. You can add chairs, tables, canopies, fabrics, staging accessories, and catering equipment into the same Rental Basket. Adding the same product more than once automatically updates its quantity instead of creating duplicate entries, and one rental period applies across your entire basket.',
  },
  {
    id: 'self-collection',
    featuredOnHome: false,
    question: 'Can I collect equipment myself?',
    answer:
      'Yes. During checkout on the Rental Basket page, simply choose "Customer collection" as your preferred fulfilment method. Our team will confirm collection timing and pickup location details in Lagos once your enquiry is reviewed.',
  },
  {
    id: 'delivery-service',
    featuredOnHome: true,
    question: 'Do you offer delivery?',
    answer:
      'Yes, we support delivery to event locations across Lagos and surrounding areas. Select "Delivery to the event location" and enter your venue address during checkout. Delivery logistics and any associated fees are confirmed separately based on item volume and distance.',
  },
  {
    id: 'return-timing',
    featuredOnHome: false,
    question: 'When should rented equipment be returned?',
    answer:
      'Equipment should be returned on your selected Return Date as agreed when confirming your booking arrangements. Because your return date must be at least one day after your collection date, you always have clear turnaround around your celebration.',
  },
  {
    id: 'check-quantities',
    featuredOnHome: false,
    question: 'How do I check available quantities?',
    answer:
      'Every product card and equipment detail page displays its listed available stock quantity (for example, 300 units for White Plastic Event Chairs or 30 units for Round Banquet Tables). The Rental Basket also prevents entering quantities higher than the listed stock.',
  },
  {
    id: 'booking-confirmation',
    featuredOnHome: false,
    question: 'Is the booking confirmed immediately?',
    answer:
      'No. Submitting your WhatsApp or web enquiry form sends a structured rental enquiry, not an instant confirmed reservation. Vvichelae Event Rentals will review your dates, verify stock availability for your event, and communicate final booking arrangements directly.',
  },
  {
    id: 'contact-business',
    featuredOnHome: false,
    question: 'How do I contact the business?',
    answer:
      'You can reach Vvichelae Event Rentals directly on WhatsApp at 08144084281, send an email to vvichelae@gmail.com, or submit a message through the enquiry form on our Contact page.',
  },
];
