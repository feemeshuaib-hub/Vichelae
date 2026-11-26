import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Check,
  ShoppingBag,
  Layers,
  CalendarRange,
  Sparkles,
  CheckCircle2,
  Star,
} from 'lucide-react';
import {
  BUSINESS_INFO,
  CATEGORIES,
  EQUIPMENT_ITEMS,
  FAQS,
  SAMPLE_REVIEWS,
} from '../data/equipment';
import { useBasket } from '../context/BasketContext';
import { formatNaira } from '../utils/rentalMath';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { EquipmentCard } from '../components/EquipmentCard';
import { ShowcaseVideoPlayer } from '../components/ShowcaseVideoPlayer';
import { FaqAccordion } from '../components/FaqAccordion';
import { ResilientImage } from '../components/ResilientImage';
import type { EquipmentCategory } from '../types/rental';

const EXPERIENCE_LAYERS: {
  id: EquipmentCategory;
  shortLabel: string;
  headline: string;
  summary: string;
  image?: string;
  objectPosition?: string;
}[] = [
  {
    id: 'Seating & Furniture',
    shortLabel: '01. Seating & Tables',
    headline: 'Structured guest comfort from ceremony to dinner',
    summary:
      'Pair stackable white chairs for open ceremonies with gold-framed banquet chairs and 10-seater round tables for formal receptions.',
    image: '/assets/aistudio/WEDFIELD_DECOR_4e2bd141.jpg',
    objectPosition: 'object-[50%_62%]',
  },
  {
    id: 'Tents & Canopies',
    shortLabel: '02. Tents & Canopies',
    headline: 'Architectural shade tailored to your compound or grounds',
    summary:
      'Choose compact 3m × 3m garden canopies, peaked 6m × 6m pagoda tents, or full clear-span marquee structures.',
  },
  {
    id: 'Fabrics & Decoration',
    shortLabel: '03. Fabrics & Draping',
    headline: 'Crisp linens, satin sashes, and layered focal backdrops',
    summary:
      'Tie the entire colour story together with pressed tablecloths, fitted ivory chair covers, and floor-to-ceiling chiffon drapes.',
  },
  {
    id: 'Event Setup & Accessories',
    shortLabel: '04. Staging & Lighting',
    headline: 'Elevated presence and warm evening atmosphere',
    summary:
      'Frame VIP entrances with a crimson carpet runner, raise your programme on modular stage decks, and wash walls in LED light.',
  },
  {
    id: 'Catering & Serving Equipment',
    shortLabel: '05. Catering & Service',
    headline: 'Polished hospitality for seamless buffet and drink service',
    summary:
      'Serve dishes hot from mirror-finish stainless chafing dishes alongside chilled glass beverage dispensers and gold-handled trays.',
  },
];

export const HomePage: React.FC = () => {
  useDocumentTitle(
    'Every Celebration, Beautifully Set',
    'Event furniture, canopies, decorative fabrics, staging accessories, and catering equipment rentals in Lagos, Nigeria.'
  );

  const { addItem } = useBasket();
  const [activeLayer, setActiveLayer] = useState<EquipmentCategory>('Seating & Furniture');
  const [addedLayerItemId, setAddedLayerItemId] = useState<string | null>(null);

  const featuredProducts = EQUIPMENT_ITEMS.filter((item) => item.featured).slice(0, 4);
  const homeFaqs = FAQS.filter((faq) => faq.featuredOnHome);

  const currentLayerMeta =
    EXPERIENCE_LAYERS.find((l) => l.id === activeLayer) ?? EXPERIENCE_LAYERS[0];
  const currentLayerItems = EQUIPMENT_ITEMS.filter((item) => item.category === activeLayer);

  const handleQuickAddLayerItem = (productId: string) => {
    const res = addItem(productId, 1);
    if (res.ok) {
      setAddedLayerItemId(productId);
      window.setTimeout(() => setAddedLayerItemId(null), 1200);
    }
  };

  return (
    <div>
      {/* A. HERO SECTION — Bright, Welcoming Warm Ivory + Deep Teal + Champagne Gold */}
      <section className="relative overflow-hidden bg-[#FFF9F0] text-[#245B59] border-b border-[#245B59]/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            {/* Editorial Copy Column */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 flex flex-col justify-center"
            >
              <div>
                <p className="inline-flex items-center gap-2.5 text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-[#245B59]">
                  <span className="h-[2px] w-6 bg-[#E8C994]" aria-hidden="true" />
                  <span>{BUSINESS_INFO.location}</span>
                </p>
                <p className="mt-1.5 font-serif text-lg sm:text-xl font-semibold italic text-[#245B59]">
                  {BUSINESS_INFO.tagline}
                </p>
              </div>

              <h1 className="mt-3 font-serif text-3xl sm:text-5xl lg:text-[3.35rem] font-bold leading-[1.08] tracking-tight text-[#245B59] text-balance">
                Everything You Need to Make Every Event Unforgettable.
              </h1>

              <p className="mt-3.5 text-base sm:text-lg font-medium text-[#245B59]/90 leading-relaxed max-w-xl">
                From elegant weddings and beautiful birthdays to corporate celebrations, find the
                equipment you need to bring your event vision to life.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3.5">
                <Link
                  to="/equipment"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#245B59] px-6 py-3.5 text-sm font-semibold text-[#FFF9F0] transition-colors hover:bg-[#245B59]/90 min-h-[44px]"
                >
                  <span>Explore Our Equipment</span>
                  <ArrowRight className="w-4 h-4 text-[#E8C994]" aria-hidden="true" />
                </Link>
                <Link
                  to="/basket"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#E8C994] bg-[#E8C994] px-6 py-3.5 text-sm font-semibold text-[#245B59] transition-colors hover:bg-[#E8C994]/80 min-h-[44px]"
                >
                  <span>Start Your Rental</span>
                </Link>
              </div>

              {/* Editorial Brand Pillars */}
              <div className="mt-7 pt-5 border-t border-[#E8C994] grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#E8C994]/70">
                <div className="pb-3.5 sm:pb-0 sm:pr-4">
                  <p className="font-serif text-lg font-bold text-[#245B59] leading-snug">
                    Curated Event Rentals
                  </p>
                  <p className="mt-1 text-xs text-[#245B59]/80 leading-relaxed">
                    Thoughtfully selected pieces for memorable occasions
                  </p>
                </div>
                <div className="py-3.5 sm:py-0 sm:px-4">
                  <p className="font-serif text-lg font-bold text-[#245B59] leading-snug">
                    Quality Event Essentials
                  </p>
                  <p className="mt-1 text-xs text-[#245B59]/80 leading-relaxed">
                    Clean, event-ready furniture, canopies, and decor
                  </p>
                </div>
                <div className="pt-3.5 sm:pt-0 sm:pl-4">
                  <p className="font-serif text-lg font-bold text-[#245B59] leading-snug">
                    Lagos Pickup & Delivery
                  </p>
                  <p className="mt-1 text-xs text-[#245B59]/80 leading-relaxed">
                    Flexible collection or direct venue delivery
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Editorial Event Photography Column */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 flex"
            >
              <div className="w-full overflow-hidden rounded-xl border border-[#E8C994] aspect-square lg:aspect-auto lg:h-full lg:min-h-[540px] shadow-[0_20px_48px_-18px_rgba(36,91,89,0.22)]">
                <img
                  src="/assets/aistudio/Amazon_com__10ftx40ft_Navy_Blue_Ceiling_Curtain_for_Wedding_Parties___2_Panels_Wrinkle-Free_40_FT_Long_Tent_Draping_Curtains_for_Wedding__Birthday___Theme_Parties__40ft_Height_with_Rod_Pocket___Home___Kitchen_49f92038.jpg"
                  alt="Outdoor event marquee tent styled with navy blue and gold ceiling drapery, crystal chandeliers, navy and gold balloon columns, dressed banquet tables, and white Chiavari chairs"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  className="h-full w-full object-cover object-center"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* B. EXPLORE OUR RENTALS (CATEGORIES) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] uppercase text-[#245B59]/70">
              The Vvichelae Collection
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-semibold text-[#245B59] tracking-tight">
              Explore Our Rentals
            </h2>
          </div>
          <Link
            to="/equipment"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#245B59] hover:text-[#245B59]/75 underline decoration-[#E8C994] decoration-2 underline-offset-4 whitespace-nowrap shrink-0"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              to={`/equipment?category=${encodeURIComponent(category.name)}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-[#245B59]/12 bg-white transition-all duration-200 hover:-translate-y-1 hover:border-[#E8C994] hover:shadow-[0_12px_24px_-12px_rgba(36,91,89,0.16)]"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-[#FFF9F0]">
                <ResilientImage
                  src={category.image}
                  alt={category.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-4">
                <span className="text-[11px] font-medium tracking-wide text-[#245B59]/65">
                  {category.tagline}
                </span>
                <h3 className="mt-1.5 font-serif text-lg font-semibold text-[#245B59] leading-snug">
                  {category.name}
                </h3>
                <p className="mt-1.5 text-xs text-[#245B59]/75 leading-relaxed line-clamp-2">
                  {category.description}
                </p>
                <span className="mt-auto pt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#245B59]">
                  <span>View category</span>
                  <ArrowRight
                    className="w-3.5 h-3.5 text-[#245B59] transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* C. FEATURED RENTALS — EXACTLY 4 ITEMS */}
      <section className="border-y border-[#245B59]/10 bg-[#E8C994]/18">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#245B59]/70">
                Popular Selections
              </p>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-semibold text-[#245B59] tracking-tight">
                Featured Rentals
              </h2>
            </div>
            <Link
              to="/equipment"
              className="inline-flex items-center justify-center rounded-lg border border-[#E8C994] bg-white px-4 py-2.5 text-xs font-semibold text-[#245B59] hover:bg-[#E8C994]/30 transition-colors min-h-[40px]"
            >
              View Full Catalogue
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((item) => (
              <EquipmentCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* D. THE COMPLETE EVENT EXPERIENCE + VIDEO 2 */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-16">
        <div>
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#245B59]/70">
              Interactive Setup Explorer
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-semibold text-[#245B59] tracking-tight text-balance">
              The Complete Event Experience
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#245B59]/75 leading-relaxed">
              Explore how seating, canopies, fabrics, staging accessories, and catering equipment
              work together in a unified celebration setup. Select any layer below to inspect and
              add items directly to your basket.
            </p>
          </div>

          {/* Interactive Layer Selector Tabs */}
          <div
            role="tablist"
            aria-label="Event Setup Layers"
            className="mt-8 flex flex-wrap gap-2 border-b border-[#245B59]/12 pb-4"
          >
            {EXPERIENCE_LAYERS.map((layer) => {
              const isSelected = layer.id === activeLayer;
              return (
                <button
                  key={layer.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveLayer(layer.id)}
                  className={`rounded-lg px-4 py-2.5 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap min-h-[40px] cursor-pointer ${
                    isSelected
                      ? 'bg-[#245B59] text-[#FFF9F0]'
                      : 'border border-[#245B59]/20 bg-white text-[#245B59] hover:border-[#E8C994] hover:bg-[#E8C994]/25'
                  }`}
                >
                  {layer.shortLabel}
                </button>
              );
            })}
          </div>

          {/* Active Layer Content */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 overflow-hidden rounded-xl border border-[#245B59]/12 bg-white">
              <div className="aspect-[4/3] w-full overflow-hidden">
                <ResilientImage
                  src={
                    currentLayerMeta.image ??
                    CATEGORIES.find((c) => c.name === activeLayer)?.image ??
                    BUSINESS_INFO.heroImage
                  }
                  alt={activeLayer}
                  className={`h-full w-full object-cover ${
                    currentLayerMeta.objectPosition ?? 'object-center'
                  }`}
                />
              </div>
              <div className="p-6">
                <p className="text-xs font-semibold tracking-wider uppercase text-[#245B59]/65">
                  {activeLayer}
                </p>
                <h3 className="mt-1.5 font-serif text-2xl font-semibold text-[#245B59]">
                  {currentLayerMeta.headline}
                </h3>
                <p className="mt-2.5 text-sm text-[#245B59]/75 leading-relaxed">
                  {currentLayerMeta.summary}
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 divide-y divide-[#245B59]/12 border-y border-[#245B59]/12 bg-white/70 rounded-xl px-4 sm:px-6">
              {currentLayerItems.map((item) => (
                <div
                  key={item.id}
                  className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <Link
                      to={`/equipment/${item.slug}`}
                      className="h-20 w-24 shrink-0 overflow-hidden rounded-lg border border-[#245B59]/12 bg-white"
                    >
                      <ResilientImage
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </Link>
                    <div>
                      <Link
                        to={`/equipment/${item.slug}`}
                        className="font-serif text-xl font-semibold text-[#245B59] hover:underline"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-1 text-xs text-[#245B59]/70">
                        <span className="font-semibold text-[#245B59] tabular-nums">
                          {formatNaira(item.dailyPrice)} / day
                        </span>{' '}
                        · <span className="tabular-nums">{item.availableStock} available</span>
                      </p>
                      <p className="mt-1 text-xs sm:text-sm text-[#245B59]/75 line-clamp-1">
                        {item.shortDescription}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleQuickAddLayerItem(item.id)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#245B59] px-4 py-2.5 text-xs font-semibold text-[#FFF9F0] hover:bg-[#245B59]/90 min-h-[40px] whitespace-nowrap cursor-pointer"
                    >
                      {addedLayerItemId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#E8C994]" aria-hidden="true" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5 text-[#E8C994]" aria-hidden="true" />
                          <span>Add to Basket</span>
                        </>
                      )}
                    </button>
                    <Link
                      to={`/equipment/${item.slug}`}
                      className="inline-flex items-center justify-center rounded-lg border border-[#E8C994] bg-[#E8C994]/25 px-3.5 py-2.5 text-xs font-semibold text-[#245B59] hover:bg-[#E8C994]/45 min-h-[40px] whitespace-nowrap"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* VIDEO 2 — EVENT TRANSFORMATION */}
        <div className="pt-8 border-t border-[#245B59]/12">
          <ShowcaseVideoPlayer
            eyebrow="Event Transformation · Video Showcase 02"
            heading={BUSINESS_INFO.videos.transformation.heading}
            caption={BUSINESS_INFO.videos.transformation.caption}
            videoSrc={BUSINESS_INFO.videos.transformation.src}
            posterSrc={BUSINESS_INFO.videos.transformation.poster}
          />
        </div>
      </section>

      {/* E. HOW IT WORKS — Carefully Selected Deep Teal Band */}
      <section className="bg-[#245B59] text-[#FFF9F0]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#E8C994]">
              Simple Rental Process
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-semibold text-[#FFF9F0] tracking-tight">
              How It Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-xl border border-[#E8C994]/35 bg-white/5 p-6 sm:p-7">
              <div className="flex items-center justify-between">
                <span className="font-serif text-3xl font-semibold text-[#E8C994]">01</span>
                <Layers className="w-5 h-5 text-[#E8C994]" aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-serif text-xl font-semibold text-[#FFF9F0]">
                Explore and select your equipment.
              </h3>
              <p className="mt-2.5 text-sm text-[#FFF9F0]/85 leading-relaxed">
                Search across chairs, tables, canopies, fabrics, staging accessories, and catering
                items with transparent daily Naira rates and listed stock levels.
              </p>
            </div>

            <div className="rounded-xl border border-[#E8C994]/35 bg-white/5 p-6 sm:p-7">
              <div className="flex items-center justify-between">
                <span className="font-serif text-3xl font-semibold text-[#E8C994]">02</span>
                <ShoppingBag className="w-5 h-5 text-[#E8C994]" aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-serif text-xl font-semibold text-[#FFF9F0]">
                Add multiple items to your rental basket.
              </h3>
              <p className="mt-2.5 text-sm text-[#FFF9F0]/85 leading-relaxed">
                Combine everything your venue needs in one saved basket. Adjust quantities effortlessly
                without losing selections while browsing pages.
              </p>
            </div>

            <div className="rounded-xl border border-[#E8C994]/35 bg-white/5 p-6 sm:p-7">
              <div className="flex items-center justify-between">
                <span className="font-serif text-3xl font-semibold text-[#E8C994]">03</span>
                <CalendarRange className="w-5 h-5 text-[#E8C994]" aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-serif text-xl font-semibold text-[#FFF9F0]">
                Choose rental dates, calculate your cost and send your enquiry.
              </h3>
              <p className="mt-2.5 text-sm text-[#FFF9F0]/85 leading-relaxed">
                Set your collection and return dates to see your exact itemised cost immediately,
                then send your complete enquiry via WhatsApp or our web form.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* F. FEATURED EVENT VIDEO (VIDEO 1) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <ShowcaseVideoPlayer
          eyebrow="Featured Showcase · Video 01"
          heading={BUSINESS_INFO.videos.showcase.heading}
          caption={BUSINESS_INFO.videos.showcase.caption}
          videoSrc={BUSINESS_INFO.videos.showcase.src}
          posterSrc={BUSINESS_INFO.videos.showcase.poster}
        />
      </section>

      {/* G. WHY CHOOSE US */}
      <section className="border-y border-[#245B59]/10 bg-[#E8C994]/18">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#245B59]/70">
              Thoughtful Event Support
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-semibold text-[#245B59] tracking-tight">
              Why Event Hosts Choose Vvichelae
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Cohesive Equipment Variety',
                body: 'Source seating, canopies, linens, stage platforms, lighting, and catering dishes from one coordinated Lagos catalogue.',
              },
              {
                title: 'Convenient Planning',
                body: 'Browse full pricing upfront in Nigerian Naira, inspect listed stock counts, and build a saved rental list at your own pace.',
              },
              {
                title: 'Flexible Fulfilment Options',
                body: 'Choose customer collection or request delivery to your event location anywhere across Lagos and surrounding areas.',
              },
              {
                title: 'Straightforward Enquiry Process',
                body: 'No confusing checkout surprises. Generate a clean itemised WhatsApp or web enquiry in seconds for fast confirmation.',
              },
            ].map((pillar) => (
              <div
                key={pillar.title}
                className="rounded-xl border border-[#245B59]/12 bg-white p-6"
              >
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#E8C994]/35">
                  <Sparkles className="w-4 h-4 text-[#245B59]" aria-hidden="true" />
                </div>
                <h3 className="mt-4 font-serif text-xl font-semibold text-[#245B59]">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-sm text-[#245B59]/75 leading-relaxed">{pillar.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* H. CUSTOMER TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="max-w-3xl mb-10">
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#245B59] tracking-tight">
            What Our Customers Say
          </h2>
          <p className="mt-3 text-base sm:text-lg font-medium text-[#245B59]/90 leading-relaxed">
            Discover why event planners, couples and celebration organisers choose Vvichelae for
            quality equipment, beautiful event setups and a smooth rental experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SAMPLE_REVIEWS.map((review) => (
            <article
              key={review.id}
              className="flex flex-col rounded-xl border border-[#245B59]/12 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-1" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Star
                    key={starIndex}
                    className="w-4 h-4 fill-[#E8C994] text-[#E8C994]"
                    aria-hidden="true"
                  />
                ))}
              </div>

              <blockquote className="mt-4 flex-1 text-sm text-[#245B59]/85 leading-relaxed">
                “{review.quote}”
              </blockquote>

              <div className="mt-6 pt-4 border-t border-[#E8C994]/60">
                <p className="font-serif text-lg font-semibold text-[#245B59]">
                  {review.customerName}
                </p>
                <p className="text-xs text-[#245B59]/75 mt-1 leading-snug">
                  {review.serviceRented}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* I. FAQ PREVIEW */}
      <section className="border-t border-[#245B59]/10 bg-[#E8C994]/15">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#245B59]/70">
                Common Questions
              </p>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-semibold text-[#245B59] tracking-tight">
                Rental FAQ Preview
              </h2>
            </div>
            <Link
              to="/contact#faq"
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#245B59] hover:text-[#245B59]/80 underline decoration-[#E8C994] decoration-2 underline-offset-4 whitespace-nowrap shrink-0 transition-colors"
            >
              <span>Need Help? Find Answers</span>
              <ArrowRight
                className="w-4 h-4 text-[#245B59] transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>

          <FaqAccordion items={homeFaqs} />
        </div>
      </section>

      {/* J. FINAL CALL TO ACTION — Light Champagne-Ivory Showcase transitioning to Deep Teal Footer */}
      <section className="bg-[#FFF9F0] border-t border-[#245B59]/10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="rounded-2xl border border-[#E8C994] bg-white px-6 py-12 sm:px-12 sm:py-16 text-center shadow-[0_18px_40px_-20px_rgba(36,91,89,0.16)]">
            <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#E8C994]/35">
              <CheckCircle2 className="w-6 h-6 text-[#245B59]" aria-hidden="true" />
            </div>
            <h2 className="mt-4 font-serif text-3xl sm:text-5xl font-semibold text-[#245B59] tracking-tight text-balance">
              Ready to Set the Scene for Your Next Celebration?
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#245B59]/80 max-w-2xl mx-auto leading-relaxed">
              Explore our curated collection across seating, canopies, decorative fabrics,
              accessories, and catering service—and build your tailored Lagos rental enquiry today.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/equipment"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#245B59] px-7 py-3.5 text-sm font-semibold text-[#FFF9F0] hover:bg-[#245B59]/90 transition-colors min-h-[44px]"
              >
                <span>Explore Equipment Catalogue</span>
                <ArrowRight className="w-4 h-4 text-[#E8C994]" aria-hidden="true" />
              </Link>
              <Link
                to="/basket"
                className="inline-flex items-center justify-center rounded-lg border border-[#E8C994] bg-[#E8C994] px-7 py-3.5 text-sm font-semibold text-[#245B59] hover:bg-[#E8C994]/80 transition-colors min-h-[44px]"
              >
                Open Rental Basket
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
