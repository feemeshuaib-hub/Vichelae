import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { BUSINESS_INFO, CATEGORIES } from '../data/equipment';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { ResilientImage } from '../components/ResilientImage';
import { BrandSymbol } from '../components/BrandLogo';

export const AboutPage: React.FC = () => {
  useDocumentTitle(
    'About Vvichelae Event Rentals',
    'Learn about Vvichelae Event Rentals in Lagos, Nigeria — our equipment categories, supported celebrations, and straightforward rental process.'
  );

  return (
    <div>
      {/* Editorial Intro Header */}
      <section className="bg-[#E8C994]/18 border-b border-[#245B59]/12 text-[#245B59]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <p className="text-xs font-semibold tracking-[0.22em] uppercase text-[#245B59]/75">
                About Our Business · {BUSINESS_INFO.location}
              </p>
              <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-semibold leading-tight text-[#245B59] text-balance">
                Every Celebration, Beautifully Set.
              </h1>
              <p className="mt-5 text-base sm:text-lg text-[#245B59]/85 leading-relaxed max-w-2xl">
                Vvichelae Event Rentals is an event equipment and decoration rental business based
                in Lagos, Nigeria. We supply dependable seating, tables, canopies, decorative
                fabrics, staging accessories, and catering equipment for gatherings across Lagos
                and surrounding areas.
              </p>
            </div>

            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="w-full max-w-xs rounded-xl border border-[#E8C994] bg-white p-8 text-center shadow-sm">
                <BrandSymbol className="h-24 mx-auto" />
                <p className="mt-4 text-xs font-semibold tracking-[0.2em] uppercase text-[#245B59]">
                  {BUSINESS_INFO.location}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Serve & What We Offer */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-6 space-y-5">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#245B59]/70">
              Our Focus
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#245B59] tracking-tight">
              Making Event Planning Easier
            </h2>
            <p className="text-sm sm:text-base text-[#245B59]/85 leading-relaxed">
              Organising a celebration in Lagos involves coordinating many moving pieces at once.
              Whether you are a private host planning a family milestone, a professional wedding
              planner mapping out a floor plan, a decorator layering fabrics and lighting, or a
              corporate organiser preparing a company programme, sourcing core rentals should feel
              straightforward.
            </p>
            <p className="text-sm sm:text-base text-[#245B59]/85 leading-relaxed">
              Our website is designed around clarity: transparent daily rental prices in Nigerian
              Naira, clear unit counts, an interactive Rental Basket that calculates multi-day
              totals automatically, and direct enquiry channels via WhatsApp or our web form.
            </p>
          </div>

          <div className="lg:col-span-6 rounded-xl border border-[#E8C994] bg-white p-6 sm:p-8 space-y-5 shadow-sm">
            <h3 className="font-serif text-2xl font-semibold text-[#245B59]">
              Events & Celebrations Supported
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-sm text-[#245B59]/85">
              {[
                'White Weddings & Receptions',
                'Traditional Engagement Ceremonies',
                'Milestone Birthdays & Anniversaries',
                'Corporate Conferences & Dinners',
                'Naming & Thanksgiving Gatherings',
                'Product Launches & Brand Showcases',
              ].map((eventType) => (
                <li key={eventType} className="flex items-start gap-2.5">
                  <CheckCircle2
                    className="w-4 h-4 text-[#245B59] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>{eventType}</span>
                </li>
              ))}
            </ul>
            <div className="pt-4 border-t border-[#E8C994]/60">
              <p className="text-xs sm:text-sm text-[#245B59]/80 leading-relaxed">
                Every enquiry is reviewed personally so we can verify availability for your chosen
                dates and discuss collection or delivery arrangements for your Lagos venue.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Equipment Services Offered */}
      <section className="border-t border-[#245B59]/12 bg-[#FFF9F0]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#245B59]/70">
                Five Rental Categories
              </p>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-semibold text-[#245B59] tracking-tight">
                Equipment Services Offered
              </h2>
            </div>
            <Link
              to="/equipment"
              className="inline-flex items-center gap-2 rounded-lg bg-[#245B59] px-5 py-3 text-xs font-semibold text-[#FFF9F0] hover:bg-[#245B59]/90 transition-colors min-h-[44px]"
            >
              <span>Explore Full Inventory</span>
              <ArrowRight className="w-4 h-4 text-[#E8C994]" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map((category) => (
              <Link
                key={category.slug}
                to={`/equipment?category=${encodeURIComponent(category.name)}`}
                className="group rounded-xl border border-[#245B59]/12 bg-white overflow-hidden hover:border-[#E8C994] hover:shadow-sm transition-all"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <ResilientImage
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <span className="text-xs text-[#245B59]/70">{category.tagline}</span>
                  <h3 className="mt-1 font-serif text-xl font-semibold text-[#245B59]">
                    {category.name}
                  </h3>
                  <p className="mt-2 text-sm text-[#245B59]/80 leading-relaxed">
                    {category.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
