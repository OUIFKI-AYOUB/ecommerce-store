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

const ProductPage: React.FC<ProductPageProps> = async ({ params }) => {
    const product = await getProduct(params.productId);
    const locale = useLocale();
    const isRTL = locale === 'ar';

    const suggestedProducts = await getProducts({
        categoryId: product.categories[0]?.id,
    });

    const filteredSuggestedProducts = suggestedProducts.filter(
        (suggestedProduct) => suggestedProduct.id !== params.productId
    );

    return (
        <div className="bg-white dark:bg-gray-900 min-h-screen">
            <Container>
                <div className="px-2 py-6 md:px-4 md:py-10">
                <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
                <div className="w-full">
                            <Gallery media={product.media}/>
                        </div>
                        <div className="mt-8 lg:mt-0 w-full">
                            <div className="px-2 md:px-4">
                                <Info data={product} />
                            </div>
                        </div>
                    </div>
                    <hr className="my-8 md:my-10 border-gray-200 dark:border-gray-700" />
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
