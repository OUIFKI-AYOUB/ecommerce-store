"use client";

import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

const MobileSearch = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
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
      setIsOpen(false);
      setQuery("");
    }
  };

  return (
    <div className="lg:hidden" ref={searchRef}>
      {!isOpen ? (
        <Search 
          className="h-6 w-6 cursor-pointer dark:text-gray-200" 
          onClick={() => setIsOpen(true)}
        />
      ) : (
        <form 
          onSubmit={onSubmit}
          className="absolute right-0 top-0 w-full max-w-[300px] p-2 bg-white dark:bg-gray-900 shadow-lg rounded-lg z-50"
        >
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 border dark:border-gray-700 p-2 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              autoFocus
            />
            <button 
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default MobileSearch;
