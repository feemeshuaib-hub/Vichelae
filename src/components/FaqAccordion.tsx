import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { FaqItem } from '../types/rental';

interface FaqAccordionProps {
  items: FaqItem[];
}

export const FaqAccordion: React.FC<FaqAccordionProps> = ({ items }) => {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="divide-y divide-[#245B59]/15 border-y border-[#245B59]/15">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id} className="py-1">
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => toggle(item.id)}
              className="flex w-full items-center justify-between gap-4 py-4 text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#245B59]"
            >
              <span className="font-serif text-lg sm:text-xl font-semibold text-[#245B59]">
                {item.question}
              </span>
              <ChevronDown
                className={`w-5 h-5 shrink-0 text-[#245B59]/70 transition-transform duration-200 ${
                  isOpen ? 'rotate-180 text-[#245B59]' : ''
                }`}
                aria-hidden="true"
              />
            </button>
            <div
              className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
                isOpen ? 'grid-rows-[1fr] opacity-100 pb-4' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <p className="text-sm sm:text-base text-[#245B59]/80 leading-relaxed max-w-3xl">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
