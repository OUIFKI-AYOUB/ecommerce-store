// All Products page
import Container from "@/components/ui/container";
import getProducts from "@/actions/get-products";
import ProductCard from "@/components/ui/product-card";
import NoResults from "@/components/ui/no-results";
import { getTranslations } from 'next-intl/server';
import PriceFilter from "@/components/price-filter";
import SortFilter from "@/components/sort-filter";
import MobileFilters from "../category/[categoryId]/components/mobile-filters";
import getColors from "@/actions/get-colors";
import getSizes from "@/actions/get-sizes";
import DesktopFilters from "../category/[categoryId]/components/desktop-filters";
import Pagination from "@/components/pagination";

export const revalidate = 0;

interface SearchParams {
  colorId?: string;
  sizeId?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  page?: string;

}
const PRODUCTS_PER_PAGE = 6;

const AllProductsPage = async ({
  searchParams
}: {
  searchParams: SearchParams
}) => {
  const page = Number(searchParams.page) || 1;

  const products = await getProducts({
    colorId: searchParams.colorId,
    sizeId: searchParams.sizeId,
    minPrice: searchParams.minPrice,
    maxPrice: searchParams.maxPrice,
    sort: searchParams.sort,
  });
  

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = products.slice(
    (page - 1) * PRODUCTS_PER_PAGE,
    page * PRODUCTS_PER_PAGE
  );

  const sizes = await getSizes();
  const colors = await getColors();
  const t = await getTranslations('navigation')




  return (
    <Container>
      <div className="pb-10">
        <div className="px-4 sm:px-6 lg:px-8 mt-10">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">{t('allProducts')}</h1>
            <span className="text-lg font-medium">
              {products.length} {t('products')}
            </span>
          </div>
          
          <div className="lg:grid lg:grid-cols-5 lg:gap-x-8">
            <div className="hidden lg:block">
              <DesktopFilters sizes={sizes} colors={colors} />
            </div>

            <div className="lg:col-span-4">
              <div className="flex items-center justify-between mb-6">
                <MobileFilters sizes={sizes} colors={colors} />
                <SortFilter />
              </div>

             {products.length === 0 ? (
      <NoResults />
    ) : (
      <>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {paginatedProducts.map((product) => (
            <ProductCard key={product.id} data={product} />
          ))}
        </div>
        <Pagination totalPages={totalPages} currentPage={page} />
      </>
    )}
              </div>
            </div>
          </div>
        </div>
      
    </Container>
  );
};

export default AllProductsPage;
