import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Phone, Mail, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import { BUSINESS_INFO } from '../data/equipment';
import { useBasket } from '../context/BasketContext';
import { BrandLogo, BrandSymbol } from './BrandLogo';

const NAV_ITEMS = [
  { to: '/', label: 'Home' },
  { to: '/equipment', label: 'Equipment' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
  { to: '/basket', label: 'Rental Basket' },
];

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { totalUnitsCount, distinctProductsCount, toastMessage, dismissToast } = useBasket();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname, location.search]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F0] text-[#245B59]">
      {/* Sticky Top Navigation Bar — 3-Zone Contract */}
      <header className="sticky top-0 z-40 h-[72px] border-b border-[#245B59]/12 bg-[#FFF9F0]/95 backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 sm:gap-8 px-4 sm:px-6 lg:px-8">
          {/* Zone 1: Brand Lockup */}
          <Link
            to="/"
            aria-label="Vvichelae Event Rentals Home"
            className="shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#245B59]"
          >
            <BrandLogo variant="dark" compact />
          </Link>

          {/* Zone 2: Desktop Navigation Links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center gap-7 text-sm font-medium"
          >
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `relative py-1 whitespace-nowrap shrink-0 transition-colors duration-150 ${
                    isActive
                      ? 'text-[#245B59] font-semibold after:absolute after:inset-x-0 after:-bottom-0.5 after:h-[2px] after:bg-[#E8C994]'
                      : 'text-[#245B59]/75 hover:text-[#245B59]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Zone 3: Primary Action & Live Basket Icon */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <Link
              to="/equipment"
              className="hidden sm:inline-flex items-center justify-center rounded-lg bg-[#245B59] px-4 py-2 text-xs font-semibold text-[#FFF9F0] transition-colors hover:bg-[#245B59]/90 whitespace-nowrap shrink-0 min-h-[40px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#245B59]"
            >
              Explore Equipment
            </Link>

            <Link
              to="/basket"
              aria-label={`Rental Basket (${distinctProductsCount} products, ${totalUnitsCount} total units)`}
              className="relative inline-flex items-center justify-center gap-2 rounded-lg border border-[#245B59]/20 bg-white px-3 py-2 text-xs font-semibold text-[#245B59] transition-colors hover:border-[#E8C994] hover:bg-[#E8C994]/25 min-h-[40px] min-w-[44px] whitespace-nowrap shrink-0"
            >
              <ShoppingBag className="w-4 h-4 text-[#245B59]" aria-hidden="true" />
              <span className="hidden md:inline">Basket</span>
              <span
                key={totalUnitsCount}
                className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-md bg-[#245B59] text-[#E8C994] text-[11px] font-bold tabular-nums transition-transform duration-150"
              >
                {totalUnitsCount}
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="inline-flex lg:hidden items-center justify-center rounded-lg border border-[#245B59]/20 bg-white p-2 text-[#245B59] hover:bg-[#E8C994]/25 min-h-[44px] min-w-[44px] cursor-pointer"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[72px] bottom-0 z-30 bg-[#245B59] text-[#FFF9F0] px-6 py-8 overflow-y-auto">
          <div className="mb-6 pb-5 border-b border-[#E8C994]/30">
            <BrandLogo variant="light" />
          </div>
          <nav aria-label="Mobile Navigation" className="flex flex-col divide-y divide-[#E8C994]/25">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center justify-between py-4 font-serif text-2xl transition-colors ${
                    isActive ? 'text-[#E8C994] font-semibold' : 'text-[#FFF9F0]'
                  }`
                }
              >
                <span>{item.label}</span>
                {item.to === '/basket' && (
                  <span className="text-sm font-sans font-semibold text-[#245B59] bg-[#E8C994] px-2.5 py-0.5 rounded-md tabular-nums">
                    {totalUnitsCount} units
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="mt-8 pt-6 border-t border-[#E8C994]/30 space-y-4">
            <Link
              to="/equipment"
              className="flex w-full items-center justify-center rounded-lg bg-[#E8C994] px-5 py-3.5 text-sm font-semibold text-[#245B59]"
            >
              Explore Equipment
            </Link>
            <a
              href={BUSINESS_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center rounded-lg border border-[#E8C994]/60 px-5 py-3.5 text-sm font-semibold text-[#FFF9F0]"
            >
              WhatsApp: {BUSINESS_INFO.whatsappDisplay}
            </a>
          </div>
        </div>
      )}

      {/* Live Basket Feedback Toast */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-4 right-4 left-4 sm:left-auto sm:max-w-md z-50 rounded-xl border border-[#E8C994] bg-[#245B59] px-4 py-3.5 text-[#FFF9F0] shadow-xl flex items-start justify-between gap-3"
        >
          <div className="flex items-start gap-2.5">
            {toastMessage.isError ? (
              <AlertCircle className="w-5 h-5 text-[#E8C994] shrink-0 mt-0.5" aria-hidden="true" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-[#E8C994] shrink-0 mt-0.5" aria-hidden="true" />
            )}
            <div className="text-xs sm:text-sm leading-snug">
              <p>{toastMessage.text}</p>
              {!toastMessage.isError && (
                <Link
                  to="/basket"
                  className="inline-block mt-1.5 text-xs font-semibold text-[#E8C994] underline underline-offset-2"
                >
                  Review Rental Basket
                </Link>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={dismissToast}
            aria-label="Dismiss notification"
            className="text-[#FFF9F0]/75 hover:text-[#FFF9F0] p-1 cursor-pointer"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Page Main Content */}
      <main className="flex-1">{children}</main>

      {/* Editorial Deep Teal Footer */}
      <footer className="bg-[#245B59] text-[#FFF9F0] border-t border-[#E8C994]/35">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            {/* Brand Column */}
            <div className="md:col-span-5 space-y-5">
              <div className="flex items-center gap-4">
                <BrandSymbol className="h-14 sm:h-16" />
                <div>
                  <BrandLogo variant="light" showEmblem={false} />
                  <p className="mt-2 text-xs text-[#FFF9F0]/85">
                    {BUSINESS_INFO.tagline}
                  </p>
                </div>
              </div>
              <p className="text-sm text-[#FFF9F0]/85 leading-relaxed max-w-md">
                Serving individuals, event planners, wedding organisers, decorators, and corporate
                teams across {BUSINESS_INFO.serviceArea} with clean, well-maintained event equipment.
              </p>
            </div>

            {/* Navigation Column */}
            <div className="md:col-span-3 space-y-3">
              <h3 className="font-serif text-lg font-semibold text-[#E8C994]">
                Explore Pages
              </h3>
              <ul className="space-y-2.5 text-sm text-[#FFF9F0]/90">
                {NAV_ITEMS.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className="hover:text-[#E8C994] transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    to="/contact#faq"
                    className="hover:text-[#E8C994] transition-colors"
                  >
                    Frequently Asked Questions
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Column */}
            <div className="md:col-span-4 space-y-3">
              <h3 className="font-serif text-lg font-semibold text-[#E8C994]">
                Direct Contact
              </h3>
              <ul className="space-y-3 text-sm text-[#FFF9F0]/90">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#E8C994] shrink-0 mt-1" aria-hidden="true" />
                  <span>{BUSINESS_INFO.location} · Serving {BUSINESS_INFO.serviceArea}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#E8C994] shrink-0" aria-hidden="true" />
                  <a
                    href={BUSINESS_INFO.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#E8C994] transition-colors tabular-nums"
                  >
                    WhatsApp: {BUSINESS_INFO.whatsappDisplay}
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#E8C994] shrink-0" aria-hidden="true" />
                  <a
                    href={`mailto:${BUSINESS_INFO.email}`}
                    className="hover:text-[#E8C994] transition-colors"
                  >
                    {BUSINESS_INFO.email}
                  </a>
                </li>
              </ul>
              <div className="pt-2">
                <Link
                  to="/equipment"
                  className="inline-flex items-center justify-center rounded-lg bg-[#E8C994] px-4 py-2.5 text-xs font-semibold text-[#245B59] hover:bg-[#FFF9F0] transition-colors"
                >
                  Start Your Rental Enquiry
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-[#E8C994]/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#FFF9F0]/75">
            <p>© {new Date().getFullYear()} {BUSINESS_INFO.name}. All rights reserved.</p>
            <p>All rental submissions are enquiries pending availability confirmation.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
