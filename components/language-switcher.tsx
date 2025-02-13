'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale !== locale) {
      // Clear any existing language session
      sessionStorage.clear();
      // Set new language session
      sessionStorage.setItem('selectedLanguage', newLocale);
      // Force a full page reload with new locale
      window.location.href = `/${newLocale}${pathname.substring(3)}`;
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Image
        src="/images/languages.png"
        alt="Language Selector"
        width={32}
        height={32}
        className="cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="absolute top-full mt-2 w-32 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50">
          <button
            onClick={() => handleLanguageChange('en')}
            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            English
          </button>
          <button
            onClick={() => handleLanguageChange('fr')}
            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Français
          </button>
          <button
            onClick={() => handleLanguageChange('ar')}
            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            العربية
          </button>
        </div>
      )}
    </div>
  );
}
