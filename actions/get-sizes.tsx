import {Size } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/sizes`;


const getSizes = async (): Promise<Size[]> =>{
    const res = await fetch(URL, {
    cache: 'no-store',
    next: { revalidate: 0 }
  });
    return res.json()
}

export default getSizes