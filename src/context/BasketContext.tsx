import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { EQUIPMENT_ITEMS } from '../data/equipment';
import type { BasketItem, EquipmentItem, RentalDates } from '../types/rental';
import { getTodayIsoDate, getTomorrowIsoDate } from '../utils/rentalMath';

const BASKET_STORAGE_KEY = 'vvichelae_rental_basket_v1';
const DATES_STORAGE_KEY = 'vvichelae_rental_dates_v1';

interface AddResult {
  ok: boolean;
  message: string;
}

interface BasketContextValue {
  items: BasketItem[];
  dates: RentalDates;
  totalUnitsCount: number;
  distinctProductsCount: number;
  toastMessage: { id: number; text: string; isError?: boolean } | null;
  addItem: (productId: string, quantity?: number) => AddResult;
  updateItemQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearBasket: () => void;
  setDates: (next: RentalDates) => void;
  getProductById: (productId: string) => EquipmentItem | undefined;
  dismissToast: () => void;
}

const BasketContext = createContext<BasketContextValue | undefined>(undefined);

function loadStoredBasket(): BasketItem[] {
  try {
    const raw = window.localStorage.getItem(BASKET_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (entry): entry is BasketItem =>
        Boolean(entry) &&
        typeof entry.productId === 'string' &&
        typeof entry.quantity === 'number' &&
        EQUIPMENT_ITEMS.some((p) => p.id === entry.productId)
    );
  } catch {
    return [];
  }
}

function loadStoredDates(): RentalDates {
  const defaultDates: RentalDates = {
    collectionDate: getTodayIsoDate(),
    returnDate: getTomorrowIsoDate(),
  };
  try {
    const raw = window.localStorage.getItem(DATES_STORAGE_KEY);
    if (!raw) return defaultDates;
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed.collectionDate === 'string' &&
      typeof parsed.returnDate === 'string'
    ) {
      return {
        collectionDate: parsed.collectionDate,
        returnDate: parsed.returnDate,
      };
    }
    return defaultDates;
  } catch {
    return defaultDates;
  }
}

export const BasketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<BasketItem[]>(() => loadStoredBasket());
  const [dates, setDatesState] = useState<RentalDates>(() => loadStoredDates());
  const [toastMessage, setToastMessage] = useState<{
    id: number;
    text: string;
    isError?: boolean;
  } | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(BASKET_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore storage quota errors gracefully
    }
  }, [items]);

  useEffect(() => {
    try {
      window.localStorage.setItem(DATES_STORAGE_KEY, JSON.stringify(dates));
    } catch {
      // Ignore storage quota errors gracefully
    }
  }, [dates]);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => {
      setToastMessage(null);
    }, 3600);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const showToast = useCallback((text: string, isError = false) => {
    setToastMessage({ id: Date.now(), text, isError });
  }, []);

  const dismissToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  const getProductById = useCallback(
    (productId: string) => EQUIPMENT_ITEMS.find((p) => p.id === productId),
    []
  );

  const addItem = useCallback(
    (productId: string, quantity = 1): AddResult => {
      const product = EQUIPMENT_ITEMS.find((p) => p.id === productId);
      if (!product) {
        return { ok: false, message: 'Equipment item not found.' };
      }
      if (!Number.isInteger(quantity) || quantity < 1) {
        const msg = 'Please enter a valid quantity.';
        showToast(msg, true);
        return { ok: false, message: msg };
      }

      const existing = items.find((entry) => entry.productId === productId);
      const currentQty = existing ? existing.quantity : 0;
      const nextQty = currentQty + quantity;

      if (nextQty > product.availableStock) {
        const msg = `You cannot rent more units than are currently listed as available (${product.availableStock} max for ${product.name}).`;
        showToast(msg, true);
        return { ok: false, message: msg };
      }

      setItems((prev) => {
        const found = prev.find((entry) => entry.productId === productId);
        if (found) {
          return prev.map((entry) =>
            entry.productId === productId
              ? { ...entry, quantity: entry.quantity + quantity }
              : entry
          );
        }
        return [...prev, { productId, quantity }];
      });

      const msg = existing
        ? `Updated ${product.name} quantity to ${nextQty} in your Rental Basket.`
        : `Added ${quantity} × ${product.name} to your Rental Basket.`;
      showToast(msg, false);
      return { ok: true, message: msg };
    },
    [items, showToast]
  );

  const updateItemQuantity = useCallback((productId: string, quantity: number) => {
    setItems((prev) =>
      prev.map((entry) =>
        entry.productId === productId ? { ...entry, quantity } : entry
      )
    );
  }, []);

  const removeItem = useCallback(
    (productId: string) => {
      const product = EQUIPMENT_ITEMS.find((p) => p.id === productId);
      setItems((prev) => prev.filter((entry) => entry.productId !== productId));
      if (product) {
        showToast(`Removed ${product.name} from your Rental Basket.`);
      }
    },
    [showToast]
  );

  const clearBasket = useCallback(() => {
    setItems([]);
  }, []);

  const setDates = useCallback((next: RentalDates) => {
    setDatesState(next);
  }, []);

  const totalUnitsCount = useMemo(
    () =>
      items.reduce(
        (sum, entry) => sum + (Number.isInteger(entry.quantity) && entry.quantity > 0 ? entry.quantity : 0),
        0
      ),
    [items]
  );

  const distinctProductsCount = items.length;

  const value = useMemo<BasketContextValue>(
    () => ({
      items,
      dates,
      totalUnitsCount,
      distinctProductsCount,
      toastMessage,
      addItem,
      updateItemQuantity,
      removeItem,
      clearBasket,
      setDates,
      getProductById,
      dismissToast,
    }),
    [
      items,
      dates,
      totalUnitsCount,
      distinctProductsCount,
      toastMessage,
      addItem,
      updateItemQuantity,
      removeItem,
      clearBasket,
      setDates,
      getProductById,
      dismissToast,
    ]
  );

  return <BasketContext.Provider value={value}>{children}</BasketContext.Provider>;
};

export function useBasket(): BasketContextValue {
  const ctx = useContext(BasketContext);
  if (!ctx) {
    throw new Error('useBasket must be used within a BasketProvider');
  }
  return ctx;
}
