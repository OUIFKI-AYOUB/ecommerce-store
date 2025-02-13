import { Product } from "@/types";
import NoResults from "@/components/ui/no-results";
import ProductCard from "@/components/ui/product-card";

interface ProductListProps {
  title: string;
  items: Product[]
}

const ProductList: React.FC<ProductListProps> = ({
  title,
  items
}) => {
  return (
    <div className="space-y-4">
      <h3 className="font-bold text-2xl md:text-3xl dark:text-gray-100">{title}</h3>
      {items.length === 0 && <NoResults />}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
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
