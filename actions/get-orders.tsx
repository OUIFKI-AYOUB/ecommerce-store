import { Order } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/orders`;

export const getOrders = async (orderId: string): Promise<Order> => {
  const res = await fetch(`${URL}/${orderId}`, {
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch order: ${res.statusText}`);
  }

  return res.json();
};