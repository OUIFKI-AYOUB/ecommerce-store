import getProduct from "@/actions/get-product";
import getProducts from "@/actions/get-products";
import Gallery from "@/components/gallery";
import Info from "@/components/info";
import ProductPageClient from "@/components/ProductPage";
import Container from "@/components/ui/container";
import ProductList from "@/components/ui/product-list";
import {useLocale } from 'next-intl';

interface ProductPageProps {
    params: {
        productId: string
    }
}

const ProductPage: React.FC<ProductPageProps> = async ({
    params
}) => {
    const product = await getProduct(params.productId);
    const locale = useLocale();
    const isRTL = locale === 'ar';

    const suggestedProducts = await getProducts({
        categoryId: product.categories[0]?.id,
    });

    // Filter out the current product from suggested products
    const filteredSuggestedProducts = suggestedProducts.filter(
        (suggestedProduct) => suggestedProduct.id !== params.productId
    );

    return (
        <div className="bg-white dark:bg-gray-900 min-h-screen">
            <Container>
                <div className="px-4 py-10 sm:px-6 lg:px-8">
                    <div className={`lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8 ${isRTL ? 'rtl' : ''}`}>
                        <Gallery media={product.media}/>
                        <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
                            <Info data={product} />
                        </div>
                    </div>
                    <hr className="my-10 border-gray-200 dark:border-gray-700" />
                    <ProductPageClient
            filteredSuggestedProducts={filteredSuggestedProducts}
            isRTL={isRTL}
          />
                </div>
            </Container>
        </div>
    );
}

export default ProductPage;
