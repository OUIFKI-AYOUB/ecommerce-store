import { Comment } from "@/types";

const getComments = async (): Promise<Comment[]> => {
  const URL = `${process.env.NEXT_PUBLIC_API_URL}/comments`;

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

  return billboards.map((comment : Comment) => ({
    ...comment,
    imageUrl: comment.imageUrl.startsWith('/uploads') 
      ? `${process.env.NEXT_PUBLIC_URL}${comment.imageUrl}`
      : comment.imageUrl
  }));
};

export default getComments;
