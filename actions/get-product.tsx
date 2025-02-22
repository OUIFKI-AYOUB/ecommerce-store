import { Product } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;

const getProduct = async (id: string): Promise<Product> => {
  const res = await fetch(`${URL}/${id}`, {
    cache: 'no-store',
  });

  const product = await res.json();

  return {
    ...product,
    media: product.media.map((m: any) => ({
      ...m,
      url: m.url.startsWith('/uploads') 
        ? `${process.env.NEXT_PUBLIC_URL}${m.url}`
        : m.url
    }))
  };
};


export default getProduct