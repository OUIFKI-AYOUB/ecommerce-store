'use client';

import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

const Pagination: React.FC<PaginationProps> = ({ totalPages, currentPage }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    return params.toString();
  };

  return (
    <div className="flex justify-center items-center mt-8 gap-2">
      <button
        onClick={() => router.push(`?${createQueryString(currentPage - 1)}`)}
        disabled={currentPage <= 1}
        className="px-4 py-2 border rounded-md  text-white bg-pink-600 disabled:opacity-50 hover:bg-white hover:text-black"
      >
        Previous
      </button>
      <span className="mx-4">
        {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => router.push(`?${createQueryString(currentPage + 1)}`)}
        disabled={currentPage >= totalPages}
        className="px-4 py-2 border rounded-md  text-white bg-pink-600 disabled:opacity-50 hover:bg-white hover:text-black"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
