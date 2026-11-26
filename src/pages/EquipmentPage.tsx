import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { CATEGORIES, EQUIPMENT_ITEMS } from '../data/equipment';
import type { EquipmentCategory } from '../types/rental';
import { formatNaira } from '../utils/rentalMath';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { EquipmentCard } from '../components/EquipmentCard';

const MAX_CATALOGUE_PRICE = 120000;

export const EquipmentPage: React.FC = () => {
  useDocumentTitle(
    'Event Equipment Catalogue',
    'Browse all 15 rental items across seating, canopies, decorative fabrics, staging accessories, and catering equipment in Lagos.'
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategoryParam = searchParams.get('category');

  const isValidCategory = (val: string | null): val is EquipmentCategory =>
    CATEGORIES.some((c) => c.name === val);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<EquipmentCategory | 'All'>(() =>
    isValidCategory(initialCategoryParam) ? initialCategoryParam : 'All'
  );
  const [maxPrice, setMaxPrice] = useState<number>(MAX_CATALOGUE_PRICE);

  useEffect(() => {
    const paramCat = searchParams.get('category');
    if (isValidCategory(paramCat)) {
      setSelectedCategory(paramCat);
    } else if (!paramCat) {
      setSelectedCategory('All');
    }
  }, [searchParams]);

  const handleCategoryChange = (cat: EquipmentCategory | 'All') => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
      setSearchParams(searchParams, { replace: true });
    } else {
      setSearchParams({ category: cat }, { replace: true });
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setMaxPrice(MAX_CATALOGUE_PRICE);
    searchParams.delete('category');
    setSearchParams(searchParams, { replace: true });
  };

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return EQUIPMENT_ITEMS.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      const matchesPrice = item.dailyPrice <= maxPrice;
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.shortDescription.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);

      return matchesCategory && matchesPrice && matchesSearch;
    });
  }, [searchQuery, selectedCategory, maxPrice]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'All' ||
    maxPrice < MAX_CATALOGUE_PRICE;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Page Header */}
      <div className="max-w-3xl">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#245B59]/70">
          Lagos Event Rental Inventory
        </p>
        <h1 className="mt-2 font-serif text-4xl sm:text-5xl font-semibold text-[#245B59] tracking-tight">
          Equipment Catalogue
        </h1>
        <p className="mt-3 text-sm sm:text-base text-[#245B59]/75 leading-relaxed">
          Explore all {EQUIPMENT_ITEMS.length} equipment items across five event categories. Add
          items directly to your Rental Basket or open any item for full specifications and
          multi-unit selection.
        </p>
      </div>

      {/* Filter & Search Panel */}
      <section
        aria-label="Equipment search and filters"
        className="mt-8 rounded-xl border border-[#245B59]/12 bg-white p-5 sm:p-6 space-y-6 shadow-[0_8px_24px_-16px_rgba(36,91,89,0.14)]"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-end">
          {/* Search Input */}
          <div className="lg:col-span-5">
            <label
              htmlFor="equipment-search"
              className="block text-xs font-semibold text-[#245B59] mb-2"
            >
              Search by Equipment Name
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#245B59]/55"
                aria-hidden="true"
              />
              <input
                id="equipment-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. Banquet Chair, Canopy, Chafing Dish..."
                className="w-full rounded-lg border border-[#245B59]/25 bg-[#FFF9F0] pl-10 pr-4 py-2.5 text-sm text-[#245B59] placeholder:text-[#245B59]/45 focus:border-[#245B59] focus:outline-none min-h-[44px]"
              />
            </div>
          </div>

          {/* Max Daily Price Slider */}
          <div className="lg:col-span-5">
            <div className="flex items-center justify-between gap-2 mb-2">
              <label
                htmlFor="max-price-range"
                className="text-xs font-semibold text-[#245B59] flex items-center gap-1.5"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#245B59]" aria-hidden="true" />
                <span>Maximum Daily Rental Price</span>
              </label>
              <span className="text-sm font-semibold text-[#245B59] tabular-nums">
                Up to {formatNaira(maxPrice)} / day
              </span>
            </div>
            <input
              id="max-price-range"
              type="range"
              min={500}
              max={MAX_CATALOGUE_PRICE}
              step={500}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#245B59] cursor-pointer h-2"
            />
            <div className="flex justify-between text-[11px] text-[#245B59]/60 mt-1 tabular-nums">
              <span>₦500</span>
              <span>₦45,000</span>
              <span>₦120,000</span>
            </div>
          </div>

          {/* Clear Filters Button */}
          <div className="lg:col-span-2 flex justify-start lg:justify-end">
            <button
              type="button"
              onClick={handleClearFilters}
              disabled={!hasActiveFilters}
              className="inline-flex w-full lg:w-auto items-center justify-center gap-1.5 rounded-lg border border-[#E8C994] bg-[#E8C994]/30 px-4 py-2.5 text-xs font-semibold text-[#245B59] hover:bg-[#E8C994]/55 disabled:opacity-40 disabled:cursor-not-allowed min-h-[44px] whitespace-nowrap cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Clear Filters</span>
            </button>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="pt-4 border-t border-[#245B59]/10">
          <p className="text-xs font-semibold text-[#245B59]/70 mb-2.5">
            Filter by Category
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleCategoryChange('All')}
              className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap min-h-[40px] cursor-pointer ${
                selectedCategory === 'All'
                  ? 'bg-[#245B59] text-[#FFF9F0]'
                  : 'border border-[#245B59]/20 bg-[#FFF9F0] text-[#245B59] hover:border-[#E8C994] hover:bg-[#E8C994]/25'
              }`}
            >
              All Categories (15)
            </button>
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.name;
              return (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => handleCategoryChange(cat.name)}
                  className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap min-h-[40px] cursor-pointer ${
                    active
                      ? 'bg-[#245B59] text-[#FFF9F0]'
                      : 'border border-[#245B59]/20 bg-[#FFF9F0] text-[#245B59] hover:border-[#E8C994] hover:bg-[#E8C994]/25'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Results Count */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-2 border-b border-[#245B59]/12 pb-3">
        <p className="text-sm font-medium text-[#245B59] tabular-nums" aria-live="polite">
          Showing <span className="font-semibold">{filteredItems.length}</span> of{' '}
          <span className="font-semibold">{EQUIPMENT_ITEMS.length}</span> equipment items
        </p>
        {selectedCategory !== 'All' && (
          <p className="text-xs text-[#245B59]/70">
            Category: <span className="font-semibold text-[#245B59]">{selectedCategory}</span>
          </p>
        )}
      </div>

      {/* Product Grid or Empty State */}
      {filteredItems.length === 0 ? (
        <div className="mt-10 rounded-xl border border-[#E8C994] bg-white px-6 py-16 text-center">
          <Search className="w-9 h-9 text-[#245B59]/55 mx-auto" aria-hidden="true" />
          <h2 className="mt-4 font-serif text-2xl font-semibold text-[#245B59]">
            No Matching Equipment
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#245B59]/80 max-w-md mx-auto">
            No equipment found matching your selection. Try adjusting your search or filters.
          </p>
          <button
            type="button"
            onClick={handleClearFilters}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-[#245B59] px-5 py-3 text-xs font-semibold text-[#FFF9F0] hover:bg-[#245B59]/90 min-h-[44px] cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-[#E8C994]" aria-hidden="true" />
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {filteredItems.map((item) => (
            <EquipmentCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};
