import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ShoppingBag, ArrowRight } from 'lucide-react';
import type { EquipmentItem } from '../types/rental';
import { useBasket } from '../context/BasketContext';
import { formatNaira } from '../utils/rentalMath';
import { ResilientImage } from './ResilientImage';

interface EquipmentCardProps {
  item: EquipmentItem;
}

export const EquipmentCard: React.FC<EquipmentCardProps> = ({ item }) => {
  const { addItem, items } = useBasket();
  const [justAdded, setJustAdded] = useState(false);

  const basketEntry = items.find((b) => b.productId === item.id);
  const inBasketQty = basketEntry ? basketEntry.quantity : 0;
  const remainingStock = Math.max(0, item.availableStock - inBasketQty);

  const handleAdd = () => {
    const res = addItem(item.id, 1);
    if (res.ok) {
      setJustAdded(true);
      window.setTimeout(() => setJustAdded(false), 1200);
    }
  };

  return (
    <article className="group flex flex-col bg-white border border-[#245B59]/12 rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:border-[#E8C994] hover:shadow-[0_12px_30px_-12px_rgba(36,91,89,0.16)]">
      <Link
        to={`/equipment/${item.slug}`}
        className="block relative aspect-[4/3] w-full overflow-hidden bg-[#FFF9F0]"
      >
        <ResilientImage
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-2 text-xs text-[#245B59]/70">
          <span className="truncate">{item.category}</span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums whitespace-nowrap shrink-0">
            {item.availableStock} available
          </span>
        </div>

        <h3 className="mt-2 font-serif text-xl font-semibold text-[#245B59] leading-snug">
          <Link
            to={`/equipment/${item.slug}`}
            className="hover:text-[#245B59]/80 transition-colors focus-visible:outline-none focus-visible:underline"
          >
            {item.name}
          </Link>
        </h3>

        <p className="mt-2 text-sm text-[#245B59]/75 line-clamp-2 leading-relaxed">
          {item.shortDescription}
        </p>

        <div className="mt-auto pt-5 border-t border-[#245B59]/10">
          <div className="flex items-baseline justify-between gap-2 mb-4">
            <div>
              <span className="text-lg font-semibold text-[#245B59] tabular-nums">
                {formatNaira(item.dailyPrice)}
              </span>
              <span className="text-xs text-[#245B59]/65 ml-1">per day</span>
            </div>
            {inBasketQty > 0 && (
              <span className="text-xs font-medium text-[#245B59] tabular-nums">
                {inBasketQty} in basket
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handleAdd}
              disabled={remainingStock === 0}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#245B59] px-3 py-2.5 text-xs font-semibold text-[#FFF9F0] transition-colors hover:bg-[#245B59]/90 disabled:opacity-45 disabled:cursor-not-allowed whitespace-nowrap min-h-[40px] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#245B59]"
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#E8C994]" aria-hidden="true" />
                  <span>Added</span>
                </>
              ) : remainingStock === 0 ? (
                <span>Max Selected</span>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5 text-[#E8C994]" aria-hidden="true" />
                  <span>Add to Basket</span>
                </>
              )}
            </button>

            <Link
              to={`/equipment/${item.slug}`}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#E8C994] bg-[#E8C994]/25 px-3 py-2.5 text-xs font-semibold text-[#245B59] transition-colors hover:bg-[#E8C994]/45 whitespace-nowrap min-h-[40px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#245B59]"
            >
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};
