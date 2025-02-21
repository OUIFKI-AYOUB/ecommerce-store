'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

const Pagination: React.FC<PaginationProps> = ({ totalPages, currentPage }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('filters');

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
        {t('Previous')}
      </button>
      <div className="flex flex-row-reverse items-center mx-4">
        <span className="ml-2">{totalPages}</span>
        <span className="mx-1">{t('of')}</span>
        <span className="mr-2">{currentPage}</span>
      </div>
      <button
        onClick={() => router.push(`?${createQueryString(currentPage + 1)}`)}
        disabled={currentPage >= totalPages}
        className="px-4 py-2 border rounded-md  text-white bg-pink-600 disabled:opacity-50 hover:bg-white hover:text-black"
      >
        {t('Next')}
      </button>
    </div>
  );
};

export default Pagination;
