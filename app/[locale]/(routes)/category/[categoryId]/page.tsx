import getCategory from "@/actions/get-category";
import getColors from "@/actions/get-colors";
import getProducts from "@/actions/get-products";
import getSizes from "@/actions/get-sizes";
import Billboard from "@/components/billboard";
import Container from "@/components/ui/container";
import Filter from "./components/filter";
import MobileFilters from "./components/mobile-filters";
import NoResults from "@/components/ui/no-results";
import ProductCard from "@/components/ui/product-card";
import PriceFilter from "@/components/price-filter";
import SortFilter from "@/components/sort-filter";
import DesktopFilters from "./components/desktop-filters";
import Pagination from "@/components/pagination";
import { getTranslations } from 'next-intl/server';

export const revalidate = 0;

interface CategoryPageProps {
  params: {
    categoryId: string
  },
  searchParams: {
    colorId: string
    sizeId: string
    minPrice: string
    maxPrice: string
    sort: string
    page: string
  }
}

const PRODUCTS_PER_PAGE = 6;

const CategoryPage: React.FC<CategoryPageProps> = async ({
  params,
  searchParams
}) => {
  const page = Number(searchParams.page) || 1;
  
  const products = await getProducts({
    categoryId: params.categoryId,
    colorId: searchParams.colorId,
    sizeId: searchParams.sizeId,
    minPrice: searchParams.minPrice,
    maxPrice: searchParams.maxPrice,
    sort: searchParams.sort
  });

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = products.slice(
    (page - 1) * PRODUCTS_PER_PAGE,
    page * PRODUCTS_PER_PAGE
  );
  const allSizes = await getSizes();
  const allColors = await getColors();


  const availableSizes = allSizes.filter(size =>
    products.some(product => product.sizes?.some(pSize => pSize.id === size.id))
  );

  const availableColors = allColors.filter(color =>
    products.some(product => product.colors?.some(pColor => pColor.id === color.id))
  );


  const category = await getCategory(params.categoryId);

  const t = await getTranslations('navigation')

  return (
    <Container>
      <div className="space-y-4 pb-10 dark:bg-gray-900">
        <Billboard data={category.billboard || null} />
        <div className="pt-6 dark:bg-gray-900"> 
          <h2 className="text-lg font-medium text-center justify-center">
            {products.length} {t('products')}
          </h2>
        </div>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-5 lg:gap-x-8">
          {(availableSizes.length > 0 || availableColors.length > 0) && (
  <DesktopFilters sizes={availableSizes} colors={availableColors} />
)}
          <div className="lg:col-span-4">
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-2xl font-bold dark:text-white">{category.name}</h2>
    <div className="flex items-center gap-x-2 lg:gap-x-4">
      <div className="lg:ml-4">
        <SortFilter />
      </div>
      {(availableSizes.length > 0 || availableColors.length > 0) && (
  <MobileFilters sizes={availableSizes} colors={availableColors} />
)}
    </div>
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
}

export default CategoryPage;
