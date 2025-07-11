"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from 'next-intl';

interface MobileSearchProps {
  onSearch: () => void; // Callback to close the mobile nav
}

const MobileSearch: React.FC<MobileSearchProps> = ({ onSearch }) => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('mobile-nav');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?query=${encodeURIComponent(query)}`);
      setQuery("");
      onSearch(); // Close the mobile nav after search
    }
  };

  return (
    <div className="lg:hidden" ref={searchRef}>
      <form 
        onSubmit={onSubmit}
        className="w-full"
      >
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder={t('Search')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 border dark:border-gray-700 p-2 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 dark:focus:ring-pink-400"
            autoFocus
          />
          <button 
            type="button"
            onClick={() => setQuery("")}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
          >
            {/*{t('Cancel')}*/}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MobileSearch;