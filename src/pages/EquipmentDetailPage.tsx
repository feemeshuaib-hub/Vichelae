import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  Minus,
  Plus,
  ShoppingBag,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { EQUIPMENT_ITEMS } from '../data/equipment';
import { useBasket } from '../context/BasketContext';
import { formatNaira, validateQuantityValue } from '../utils/rentalMath';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { EquipmentCard } from '../components/EquipmentCard';
import { ResilientImage } from '../components/ResilientImage';

export const EquipmentDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const product = EQUIPMENT_ITEMS.find((item) => item.slug === slug);

  useDocumentTitle(
    product ? product.name : 'Equipment Not Found',
    product?.shortDescription
  );

  const { addItem, items } = useBasket();
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [qtyInput, setQtyInput] = useState<string>('1');
  const [qtyError, setQtyError] = useState<string | null>(null);
  const [addedFeedback, setAddedFeedback] = useState(false);

  useEffect(() => {
    setSelectedImageIdx(0);
    setQtyInput('1');
    setQtyError(null);
    setAddedFeedback(false);
  }, [slug]);

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#245B59]">
          Equipment Item Not Found
        </h1>
        <p className="mt-3 text-sm sm:text-base text-[#245B59]/75">
          The equipment listing you requested could not be found in our current inventory.
        </p>
        <Link
          to="/equipment"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#245B59] px-6 py-3 text-sm font-semibold text-[#FFF9F0]"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Return to Equipment Catalogue</span>
        </Link>
      </div>
    );
  }

  const basketEntry = items.find((b) => b.productId === product.id);
  const inBasketQty = basketEntry ? basketEntry.quantity : 0;
  const maxAddable = Math.max(0, product.availableStock - inBasketQty);

  const gallery =
    product.galleryImages.length > 0
      ? product.galleryImages
      : [{ src: product.image, caption: product.name }];
  const activeMedia = gallery[selectedImageIdx] ?? gallery[0];

  const handleQtyChange = (raw: string) => {
    setQtyInput(raw);
    if (raw.trim() === '') {
      setQtyError('Please enter a valid quantity.');
      return;
    }
    const parsed = Number(raw);
    const check = validateQuantityValue(parsed, product.availableStock);
    if (!check.valid) {
      setQtyError(check.error);
    } else if (inBasketQty + parsed > product.availableStock) {
      setQtyError(
        `You already have ${inBasketQty} in your basket. You can add up to ${maxAddable} more units.`
      );
    } else {
      setQtyError(null);
    }
  };

  const stepQuantity = (delta: number) => {
    const current = Number.isInteger(Number(qtyInput)) ? Number(qtyInput) : 1;
    const next = Math.max(1, current + delta);
    handleQtyChange(String(next));
  };

  const handleAddToBasket = () => {
    const parsed = Number(qtyInput);
    const check = validateQuantityValue(parsed, product.availableStock);
    if (!check.valid) {
      setQtyError(check.error);
      return;
    }
    if (inBasketQty + parsed > product.availableStock) {
      setQtyError('You cannot rent more units than are currently listed as available.');
      return;
    }

    const res = addItem(product.id, parsed);
    if (res.ok) {
      setQtyError(null);
      setAddedFeedback(true);
      window.setTimeout(() => setAddedFeedback(false), 1600);
    } else {
      setQtyError(res.message);
    }
  };

  const relatedProducts = EQUIPMENT_ITEMS.filter(
    (item) => item.id !== product.id && item.category === product.category
  ).concat(
    EQUIPMENT_ITEMS.filter(
      (item) => item.id !== product.id && item.category !== product.category
    ).slice(0, 2)
  ).slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-2 text-xs text-[#245B59]/70">
        <Link to="/" className="hover:text-[#245B59]">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <Link to="/equipment" className="hover:text-[#245B59]">
          Equipment
        </Link>
        <span aria-hidden="true">/</span>
        <Link
          to={`/equipment?category=${encodeURIComponent(product.category)}`}
          className="hover:text-[#245B59]"
        >
          {product.category}
        </Link>
        <span aria-hidden="true">/</span>
        <span className="font-semibold text-[#245B59]">{product.name}</span>
      </nav>

      {/* Main Product Module */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        {/* Left: Photo Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="overflow-hidden rounded-xl border border-[#245B59]/12 bg-white aspect-[4/3]">
            <ResilientImage
              src={activeMedia.src}
              alt={`${product.name} — ${activeMedia.caption}`}
              eager
              className="h-full w-full object-cover"
            />
          </div>

          {gallery.length > 1 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {gallery.map((img, idx) => (
                <button
                  key={img.src + idx}
                  type="button"
                  onClick={() => setSelectedImageIdx(idx)}
                  aria-label={`View image ${idx + 1}: ${img.caption}`}
                  className={`overflow-hidden rounded-lg border transition-all aspect-[4/3] cursor-pointer ${
                    idx === selectedImageIdx
                      ? 'border-[#245B59] ring-2 ring-[#E8C994]'
                      : 'border-[#245B59]/15 opacity-80 hover:opacity-100'
                  }`}
                >
                  <ResilientImage
                    src={img.src}
                    alt={img.caption}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          <p className="text-xs text-[#245B59]/70">{activeMedia.caption}</p>
        </div>

        {/* Right: Contiguous Purchase & Enquiry Module */}
        <div className="lg:col-span-5 rounded-xl border border-[#245B59]/12 bg-white p-6 sm:p-8 space-y-6 shadow-[0_10px_28px_-16px_rgba(36,91,89,0.14)]">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#245B59]/70">
              <span>{product.category}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums font-semibold text-[#245B59]">
                {product.availableStock} units available
              </span>
            </div>

            <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-semibold text-[#245B59] leading-tight">
              {product.name}
            </h1>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-semibold text-[#245B59] tabular-nums">
                {formatNaira(product.dailyPrice)}
              </span>
              <span className="text-sm text-[#245B59]/70">per day</span>
            </div>
          </div>

          <p className="text-sm sm:text-base text-[#245B59]/80 leading-relaxed">
            {product.fullDescription}
          </p>

          {/* Quantity Selector */}
          <div className="pt-4 border-t border-[#245B59]/12 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="detail-quantity" className="font-semibold text-[#245B59]">
                Select Rental Quantity
              </label>
              {inBasketQty > 0 && (
                <span className="text-[#245B59]/75 tabular-nums">
                  Currently in basket: <strong>{inBasketQty}</strong>
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="inline-flex items-center rounded-lg border border-[#245B59]/25 bg-[#FFF9F0]">
                <button
                  type="button"
                  onClick={() => stepQuantity(-1)}
                  aria-label="Decrease quantity"
                  className="p-3 text-[#245B59] hover:bg-[#E8C994]/35 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <Minus className="w-4 h-4" aria-hidden="true" />
                </button>
                <input
                  id="detail-quantity"
                  type="number"
                  min={1}
                  max={product.availableStock}
                  step={1}
                  value={qtyInput}
                  onChange={(e) => handleQtyChange(e.target.value)}
                  className="w-20 bg-transparent text-center text-sm font-semibold text-[#245B59] tabular-nums focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => stepQuantity(1)}
                  aria-label="Increase quantity"
                  className="p-3 text-[#245B59] hover:bg-[#E8C994]/35 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <Plus className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToBasket}
                disabled={maxAddable === 0}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-[#245B59] px-5 py-3 text-sm font-semibold text-[#FFF9F0] hover:bg-[#245B59]/90 disabled:opacity-45 disabled:cursor-not-allowed min-h-[44px] cursor-pointer"
              >
                {addedFeedback ? (
                  <>
                    <Check className="w-4 h-4 text-[#E8C994]" aria-hidden="true" />
                    <span>Added to Basket</span>
                  </>
                ) : maxAddable === 0 ? (
                  <span>Full Listed Stock in Basket</span>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-[#E8C994]" aria-hidden="true" />
                    <span>Add to Basket</span>
                  </>
                )}
              </button>
            </div>

            {qtyError && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-lg border border-[#245B59] bg-[#E8C994]/30 p-3 text-xs font-medium text-[#245B59]"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                <span>{qtyError}</span>
              </div>
            )}

            {inBasketQty > 0 && (
              <Link
                to="/basket"
                className="block text-center rounded-lg border border-[#E8C994] bg-[#E8C994]/30 py-2.5 text-xs font-semibold text-[#245B59] hover:bg-[#E8C994]/55 transition-colors"
              >
                Proceed to Rental Basket & Date Calculator →
              </Link>
            )}
          </div>

          {/* Specifications */}
          <div className="pt-4 border-t border-[#245B59]/12">
            <h2 className="font-serif text-xl font-semibold text-[#245B59]">
              Specifications
            </h2>
            <dl className="mt-3 divide-y divide-[#245B59]/10 text-xs sm:text-sm">
              {product.specifications.map((spec) => (
                <div key={spec.label} className="py-2.5 flex justify-between gap-4">
                  <dt className="text-[#245B59]/65">{spec.label}</dt>
                  <dd className="font-medium text-[#245B59] text-right">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Rental Information */}
          <div className="pt-4 border-t border-[#245B59]/12">
            <h2 className="font-serif text-xl font-semibold text-[#245B59]">
              Rental Information
            </h2>
            <ul className="mt-3 space-y-2 text-xs sm:text-sm text-[#245B59]/80">
              {product.rentalInfo.map((note) => (
                <li key={note} className="flex items-start gap-2">
                  <CheckCircle2
                    className="w-4 h-4 text-[#245B59] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Related Equipment */}
      <section className="mt-16 pt-12 border-t border-[#245B59]/12">
        <div className="flex items-center justify-between gap-4 mb-8">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#245B59]">
            Related Equipment
          </h2>
          <Link
            to="/equipment"
            className="text-xs sm:text-sm font-semibold text-[#245B59] underline decoration-[#E8C994] decoration-2 underline-offset-4"
          >
            View All Equipment
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedProducts.map((rel) => (
            <EquipmentCard key={rel.id} item={rel} />
          ))}
        </div>
      </section>
    </div>
  );
};
