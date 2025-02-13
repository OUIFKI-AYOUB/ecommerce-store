
import { Product } from "@/types";
import Container from "@/components/ui/container";
import ProductCard from "@/components/ui/product-card";

const getSearchResults = async (query: string): Promise<Product[]> => {
  try {
    const encodedQuery = encodeURIComponent(query);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?name=${encodedQuery}`);
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    return data as Product[];
  } catch (error) {
    console.error("Error fetching search results:", error);
    return [];
  }
};

export const metadata = {
  title: 'Search Results',
  description: 'Search results for products',
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { query: string };
}) {
  const { query } = searchParams;
  const allProducts = await getSearchResults(query);

  // Filter products to only include those with names that contain the search query
  const filteredProducts = allProducts.filter(product => 
    product.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Container>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Search Results for "{query}"</h1>
        {filteredProducts.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} data={product} />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
