import { Billboard } from "@/types";

const getBillboards = async (): Promise<Billboard[]> => {
  const URL = `${process.env.NEXT_PUBLIC_API_URL}/billboards`;

  const res = await fetch(URL, {
    next: { revalidate: 0 },
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch billboards');
  }

  const billboards = await res.json();

  return billboards.map((billboard: Billboard) => ({
    ...billboard,
    imageUrl: billboard.imageUrl.startsWith('/uploads') 
      ? `${process.env.NEXT_PUBLIC_URL}${billboard.imageUrl}`
      : billboard.imageUrl
  }));
};

export default getBillboards;
