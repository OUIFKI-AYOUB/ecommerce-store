import { Product } from "@/types";
import NoResults from "@/components/ui/no-results";
import ProductCard from "@/components/ui/product-card";
interface ProductListProps {
  title: string;
  items: Product[]
  isRTL?: boolean;

}

const ProductList: React.FC<ProductListProps> = ({
  title,
  items,
  isRTL
}) => {

  return (
    <div className="space-y-4">
     <h3 className={`font-bold text-2xl md:text-3xl dark:text-gray-100 ${isRTL ? 'rtl' : ''}`}>
        {title}
      </h3>      {items.length === 0 && <NoResults />}
      <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 ${isRTL ? 'rtl' : ''}`}>
        {items.map((item) => (
          <div key={item.id} className="scale-95 md:scale-90">
            <ProductCard data={item} />
          </div>
        ))}
      </div>
    </div>
  );
}


export default ProductList;
