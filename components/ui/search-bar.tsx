"use client";

import React from 'react';
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const SearchBar = () => {
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;

    if (name) {
      router.push(`/search?query=${encodeURIComponent(name)}`);
    }
  };

  return (
    <form
      className="flex items-center justify-center w-full max-w-md mx-auto" 
      onSubmit={handleSearch}
    >
      <div className="relative w-full">
        <Input
          type="text"
          name="name"
          placeholder="Search products"
          className="pl-5 pr-2 py-2 w-full"
        />
      
        {/* Add the submit button */}
        <button
          type="submit"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-pink-500 text-white px-3 py-1 rounded"
        >
         <Search className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
